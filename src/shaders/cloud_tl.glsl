
// dependencies:
//   - color_tl.glsl


uniform samplerCube	t_animNoise;

uniform float	u_texBlendTime;
uniform float	u_cloudAmount;
uniform float	u_cloudHeight;
uniform vec3	u_lightDir;



float SampleCloud(vec3 position) {
	vec4 packedAnimFBM = textureCube(t_animNoise, position);
	float noiseCloud = u_cloudAmount + mix(
		UnpackFromRGB_888(packedAnimFBM.rg),
		UnpackFromRGB_888(packedAnimFBM.ba),
		u_texBlendTime
	);
	return max(noiseCloud, 0.0);
}


float EvalCloudThickness(float noiseCloud) {
	const float MAX_THICKNESS = 5e3;  // unit: m
	return noiseCloud * MAX_THICKNESS;
}


float EvalCloudOpticalDepth(float thickness) {
	const float EXTINCTION = 3.2e-4;  // REF: Egor Yusov. "Real-Time Rendering of Physically Based Clouds Using Precomputed Scattering". In GPU Pro 6, CRC Press, 2016.
	return thickness * EXTINCTION;
}


float EvalCloudTransmittance(float opticalDepth) {
	return pow(exp(-2.0 * opticalDepth), 10.0);
}


// $shadingPt can be either position on the ground or at the top of atmosphere
// $inDir can be either light or view direction towards the shading point
vec3 GetCloudSamplePosition(vec3 shadingPt, vec3 inDir, float planetRadius) {
	float radiusCloud = planetRadius + u_cloudHeight;  // unit: m

	vec3 lowestPos = inDir * -dot(inDir, shadingPt) + shadingPt;
	float lowestToCloud = sqrt(radiusCloud * radiusCloud - dot(lowestPos, lowestPos));
	return inDir * -lowestToCloud + lowestPos;
}

