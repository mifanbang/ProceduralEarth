
// dependencies:
//   - cloud_tl.glsl
//   - scattering_tl.glsl


uniform vec3	u_lightColor;
uniform vec3	u_viewPos;
uniform float	u_radiusAtmo;
uniform mat4	u_invModelMat;


varying vec3	v_worldPosition;	// world-space position (normalized)
varying vec3	v_worldNormal;		// world-space normal (normalized)



void main(void) {
	// invariants
	vec3 worldNormal = normalize(v_worldNormal);
	vec3 viewDir = normalize(v_worldPosition - u_viewPos);
	float atmoRadius = u_planetRadius + u_atmoThickness;  // unit: m
	float glUnitToMeter = atmoRadius / u_radiusAtmo;

	// intersection
	InScatteringParam inSctrParam;
	inSctrParam.viewPos = u_viewPos * glUnitToMeter;
	inSctrParam.viewDir = viewDir;
	inSctrParam.lightDir = u_lightDir;
	PlanetIntersectResult intsct = IntersectPlanet(inSctrParam);

	// hit test with clouds
	if (intsct.hitsGround) {
		vec3 posWorldSpace = v_worldPosition * glUnitToMeter;  // unit: m
		vec3 cloudSampleWorldSpace = GetCloudSamplePosition(posWorldSpace, viewDir, u_planetRadius);
		vec3 cloudSampleModelSpace = (u_invModelMat * vec4(normalize(cloudSampleWorldSpace), 0.0)).xyz;
		float cloudThickness = EvalCloudThickness(SampleCloud(cloudSampleModelSpace));

		if (cloudThickness > 0.0) {
			// use blending on $distToFarInter to avoid sudden change of in-scattering
			const float INV_BLENDING_HEIGHT = 1.0 / 5e2;  // 500 meters
			float newDistToFarInter = intsct.t.distToNearInter + distance(cloudSampleWorldSpace, posWorldSpace) - cloudThickness;
			intsct.t.distToFarInter = mix(intsct.t.distToFarInter, newDistToFarInter, min(cloudThickness * INV_BLENDING_HEIGHT, 1.0));
		}
	}

	gl_FragColor.xyz = IntegrateInScattering(inSctrParam, intsct) * u_lightColor;
	gl_FragColor.w = 1.0;
}

