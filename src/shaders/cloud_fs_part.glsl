
// dependencies:
//   - brdf_tl.glsl
//   - cloud_tl.glsl
//   - normal_tl.glsl
//   - scattering_tl.glsl


uniform vec3	u_lightColor;

varying vec3	v_modelPosition;	// model-space position
varying vec3	v_worldNormal;		// world-space normal (normalized)



float EvalHenyeyGreenstein(float g, float cosTheta) {
	const float INV_4_PI = 0.25 / 3.1415926;
	float gSq = g * g;
	return INV_4_PI * (1.0 - gSq) / pow(1.0 + gSq - 2.0 * g * cosTheta, 1.5);
}


// REF: Sebastien Hillaire. "Physically Based Sky, Atmosphere and Cloud Rendering in Frostbite". SIGGRAPH 2016 Physically Based Shading in Theory and Practice course.
float EvalPhase(float cosTheta) {
	const float G_1 = 0.5;
	const float G_2 = -0.3;
	const float mixFactor = 0.7;  // weight for the G_1 term
	return mix(EvalHenyeyGreenstein(G_2, cosTheta), EvalHenyeyGreenstein(G_1, cosTheta), mixFactor);
}


float EvalScattering(float phase, float opticalDepth) {
	float opticalDepthAdj = min(opticalDepth, 0.549);  // f(x)=exp(-x)*(1-exp(-2x)) has global max at x=0.549
	float transmittance = exp(-opticalDepthAdj);
	float powderEffect = 1.0 - exp(-2.0 * opticalDepthAdj);
	return phase * 2.0 * transmittance * powderEffect * opticalDepth;
}


// Lambertian diffuse lighting with "baked-in" ambient term
float EvalCloudLighting(float thickness, float dotNL) {
	const float ALBEDO = 0.8;
	return max(dotNL, 0.1) * ALBEDO / 3.1415926;  // set mininum to dotNL to acoount for ambient from sky
}


vec3 FixViewerTransmittance(float dotNV, float height) {
	return SampleTransmittance(dotNV, height) / SampleTransmittance(dotNV, 0.0);
}



void main(void) {
	// invariants
	vec3 modelNPos = normalize(v_modelPosition);  // normalized model-space position
	vec3 worldNormal = normalize(v_worldNormal);
	vec3 viewDir = normalize(v_worldPosition - u_viewPos);
	float dotNL = -dot(worldNormal, u_lightDir);
	float dotVL = dot(viewDir, u_lightDir);
	float dotNV = -dot(worldNormal, viewDir);

	// prepare properties
	float noiseCloud = SampleCloud(modelNPos);
	if (noiseCloud <= 0.0)
		discard;
	vec3 bumpNormal = CalcBumpNormal(modelNPos, noiseCloud, 3.33e-3);
	float thickness = EvalCloudThickness(noiseCloud);
	float opticalDepth = EvalCloudOpticalDepth(thickness);

	// diffuse and scattering terms
	float phase = EvalPhase(dotVL);
	float scattering = EvalScattering(phase, opticalDepth);
	float diffuse = EvalCloudLighting(thickness, max(-dot(bumpNormal, u_lightDir), 0.0));

	// put all things together
	vec3 incidentLight = u_lightColor * SampleTransmittance(dotNL, u_cloudHeight + thickness);
	vec3 fixedTransmittance = FixViewerTransmittance(dotNV, u_cloudHeight + thickness);
	vec3 radiance = incidentLight * mix(scattering, diffuse, 0.6) * fixedTransmittance;

	float transmittance = EvalCloudTransmittance(opticalDepth);
	gl_FragColor = vec4(radiance, 1.0 - transmittance);
}

