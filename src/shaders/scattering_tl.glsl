
// optional macros:
//   - LOOK_UP_SAMPLE_TRSM:		while integrating in-scattering, commit a texture
//								lookup for sample's transmittance to eye; otherwise
//								an interpolation is used as approximation

uniform sampler2D 	t_opticalDepth;

uniform vec3	u_optDepTexCoeff;  // let N = size(t_transmittance), u_trsmTexCoeff = vec3((N-1)/N/maxAngle, (N-1)/N/atmoThickness, 0.5/N)
uniform float	u_planetRadius;
uniform float	u_atmoThickness;



struct IntersectParam {
	vec3 viewPos;
	vec3 viewDir;
	float radius;
};


struct InScatteringParam {
	vec3 viewPos;
	vec3 viewDir;  // from viewPos
	vec3 lightDir;
};


struct IntersectResult {
	float distToNearInter;  // distance to the nearer intersection
	float distToFarInter;  // distance to the farther intersection
};


struct PlanetIntersectResult {
	bool hitsGround;
	IntersectResult t;
};



// remap to transmittance table x-coordinate
float RemapToTrsmTblX(float cosChi) {
	return acos(clamp(cosChi, -1.0, 1.0)) * u_optDepTexCoeff.x;  // * (N-1) / N / maxAngle
}


// remap to transmittance table y-coordinate
float RemapToTrsmTblY(float heightInMeter) {
	return heightInMeter * u_optDepTexCoeff.y;  // * (N-1) / N / atmoThickness
}


vec3 SampleTransmittance(float cosChi, float height) {
	vec3 opticalDepth = texture2D(
		t_opticalDepth,
		vec2(RemapToTrsmTblX(cosChi), RemapToTrsmTblY(height)) + u_optDepTexCoeff.z  // offset towards the texel center
	).rgb;
	return exp(opticalDepth);  // assuming all texels are 0 or negative
}


// sphere is assume to be at the origin
IntersectResult IntersectSphere(IntersectParam param) {
	IntersectResult result;

	float distToNearest = dot(-param.viewPos, param.viewDir);  // view ray's nearest point to origin

	// temp variables
	float distMin = length(param.viewPos + distToNearest * param.viewDir);  // distance to center from the nearest point
	float distHalfIntersection = sqrt(max(param.radius * param.radius - distMin * distMin, 0.0));

	result.distToNearInter = distToNearest - distHalfIntersection;
	result.distToFarInter = distToNearest + distHalfIntersection;

	return result;
}


// cylinder is assumed to aligned with z-axis
IntersectResult IntersectShadowCylinder(IntersectParam param) {
	IntersectParam newParam;
	newParam.viewDir = vec3(normalize(param.viewDir.xy), 0.0);
	newParam.viewPos = vec3(param.viewPos.xy, 0.0);
	newParam.radius = u_planetRadius;
	IntersectResult result = IntersectSphere(newParam);

	float scaler = length(param.viewDir) / length(param.viewDir.xy);
	result.distToNearInter *= scaler;
	result.distToFarInter *= scaler;
	return result;
}


// similar to IntersectSphere() but with consideration of atmosphere
// TODO: to support intersection from view positions within atmosphere
PlanetIntersectResult IntersectPlanet(InScatteringParam param) {
	PlanetIntersectResult result;

	float distToNearest = -dot(param.viewPos, param.viewDir);  // view ray's nearest point to origin, namely the lowest point

	// temp variables
	float distLowest = length(param.viewPos + distToNearest * param.viewDir);  // distance to planet center from the lowest point
	float distLowestSq = distLowest * distLowest;
	float radiusAtm = u_planetRadius + u_atmoThickness;
	float distLowestToGroundSq = u_planetRadius * u_planetRadius - distLowestSq;
	float distLowestToAtmSq = radiusAtm * radiusAtm - distLowestSq;

	result.hitsGround = (distLowestToGroundSq >= 0.0);
	result.t.distToFarInter = (result.hitsGround ? distToNearest - sqrt(distLowestToGroundSq) : distToNearest + sqrt(distLowestToAtmSq));
	result.t.distToNearInter = max(distToNearest - sqrt(distLowestToAtmSq), 0.0);

	return result;
}


bool IsShadowed(vec3 pos, vec3 lightDir, float radius) {
	float dotLV = dot(pos, -lightDir);
	vec3 closestPt = lightDir * dotLV + pos;
	return !(dotLV >= 0.0 || length(closestPt) > radius - 10.0);
}


// should only be used when view ray hits ground in the shadowed hemisphere.
void RefineWithShadowCylinder(InScatteringParam param, inout PlanetIntersectResult result) {
	// TODO: rotate everything if the light direction is not exactly towards the negative z-axis

	IntersectParam itrsctParam;
	itrsctParam.viewPos = param.viewPos;
	itrsctParam.viewDir = param.viewDir;
	itrsctParam.radius = u_planetRadius;

	IntersectResult itrsctCylinder = IntersectShadowCylinder(itrsctParam);
	if (length(param.viewPos.xy) > u_planetRadius)
		result.t.distToFarInter = max(itrsctCylinder.distToNearInter, result.t.distToNearInter);
	else
		result.t.distToNearInter = min(itrsctCylinder.distToFarInter, result.t.distToFarInter);
}


vec3 GetPlanetaryTransmittance(InScatteringParam param) {
	PlanetIntersectResult intsct = IntersectPlanet(param);

	vec3 posSample = param.viewDir * intsct.t.distToFarInter + param.viewPos;
	float distSampleToOrigin = length(posSample);
	return SampleTransmittance(-dot(param.viewDir, posSample / distSampleToOrigin), distSampleToOrigin - u_planetRadius);
}


// TODO: to support integration outwards from position within atmosphere
vec3 IntegrateInScattering(InScatteringParam param, PlanetIntersectResult intsct) {
	vec3 result = vec3(0.0);

	// start/end position may need some refinement
	if (IsShadowed(param.viewDir * intsct.t.distToFarInter + param.viewPos, param.lightDir, u_planetRadius))
		RefineWithShadowCylinder(param, intsct);

	// ray-marching setup
	const int NUM_SAMPLE_MAX = 20;
	const int NUM_SAMPLE_MIN = 8;
	float segmentCount = (intsct.hitsGround ? float(NUM_SAMPLE_MIN) : float(NUM_SAMPLE_MAX));
	float segmentLength = (intsct.t.distToFarInter - intsct.t.distToNearInter) / segmentCount;  // should always be positive

	// initialize with the far endpoint of the 1st segment
	vec3 posFarEndPoint = param.viewDir * intsct.t.distToFarInter + param.viewPos;  // the far endpoint of each segment
	float distFarEndPointToOrigin = length(posFarEndPoint);  // not actually needed in the iteration
	vec3 trsmFarEndPoint = SampleTransmittance(
		-dot(param.viewDir, posFarEndPoint / distFarEndPointToOrigin),
		distFarEndPointToOrigin - u_planetRadius
	);

	// integral with ray-marching
	for (int i = 0; i < NUM_SAMPLE_MAX; ++i) {
		if (float(i) >= segmentCount)
			break;

		vec3 posSample = segmentLength * -0.5 * param.viewDir + posFarEndPoint;  // sample at the center of the segment
		vec3 trsmSunToSample = vec3(0.0);
		vec3 trsmSampleToEye = vec3(0.0);

		// light that scatters in
		{
			float distSampleToOrigin = length(posSample);
			vec3 posSampleNorm = posSample / distSampleToOrigin;  // counting on compiler to reuse registers
			float sampleHeight = distSampleToOrigin - u_planetRadius;
			trsmSunToSample = SampleTransmittance(-dot(param.lightDir, posSampleNorm), sampleHeight);

#if defined(LOOK_UP_SAMPLE_TRSM)
			trsmSampleToEye = SampleTransmittance(-dot(param.viewDir, posSampleNorm), sampleHeight);
#endif  // LOOK_UP_SAMPLE_TRSM
		}

		// update shared variables
		{
			posFarEndPoint -= param.viewDir * segmentLength;
			float distFarEndPointToOrigin = length(posFarEndPoint);  // counting on compiler to reuse registers
			vec3 trsmNearEndPoint = SampleTransmittance(
				-dot(param.viewDir, posFarEndPoint / distFarEndPointToOrigin),
				distFarEndPointToOrigin - u_planetRadius
			);

			// 1. adding 1e-10 to avoid 0 being divided by 0
			// 2. because transmittance texture is somehow too coarse if intsct.hitsGround = false,
			//    to avoid artifacts must we handle situations of trsmFarEndPoint > trsmNearEndPoint
			vec3 trsmDelta = min(trsmFarEndPoint / (trsmNearEndPoint + 1e-10), 1.0);

	#if !defined(LOOK_UP_SAMPLE_TRSM)
			trsmSampleToEye = sqrt(trsmFarEndPoint * trsmNearEndPoint);  // approximate the transmittance from posSample to eye
	#endif  // !LOOK_UP_SAMPLE_TRSM
			trsmFarEndPoint = trsmNearEndPoint;

			result += trsmSunToSample * trsmSampleToEye * -log(trsmDelta);  // -log(trsmDelta) = beta*∫dt = optical depth
		}
	}

	float phaseCosTheta = dot(-param.viewDir, param.lightDir);
	float phase = (3.0 / 16.0 / 3.1415926) * (1.0 + phaseCosTheta*phaseCosTheta);

	return result * phase;
}

