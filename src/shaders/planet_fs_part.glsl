
// dependencies:
//   - brdf_tl.glsl
//   - cloud_tl.glsl
//   - color_tl.glsl
//   - normal_tl.glsl
//   - scattering_tl.glsl


uniform samplerCube	t_noise;

uniform vec3	u_lightColor;
uniform float	u_radius;
uniform mat4	u_invModelMat;

varying vec3	v_modelPosition;	// model-space position
varying vec3	v_worldNormal;		// world-space normal (normalized)



void main(void) {
	// constants
	vec3 modelNPos = normalize(v_modelPosition);  // normalized model-space position
	vec3 worldNormal = normalize(v_worldNormal);

	// prepare for surface
	SurfaceParam surfParam;
	{
		vec4 packedFBM = textureCube(t_noise, modelNPos);

		surfParam.surfacePos = modelNPos;
		surfParam.dotSunLight = dot(worldNormal, -u_lightDir);
		surfParam.fbm = UnpackFromRGB_888(packedFBM.ba);
		surfParam.fbmAlt = UnpackFromRGB_888(packedFBM.rg);
	}
	SurfaceProperties surface = CalcSurfaceProperties(surfParam);

	// TODO: sample in-scattering along zenith as ambient light
/*
	InScatteringParam inSctrParam;
	inSctrParam.viewPos = v_worldPosition * (u_planetRadius / u_radius);
	inSctrParam.viewDir = surface.normal;
	inSctrParam.lightDir = u_lightDir;
	vec3 inScattering = IntegrateInScattering(inSctrParam);
*/

	// shadows casted by clouds
	vec3 cloudSampleWorldSpace = GetCloudSamplePosition(v_worldPosition / u_radius * u_planetRadius, u_lightDir, u_planetRadius);
	vec3 cloudSampleModelSpace = (u_invModelMat * vec4(normalize(cloudSampleWorldSpace), 0.0)).xyz;
	float cloudThickness = EvalCloudThickness(SampleCloud(cloudSampleModelSpace));
	float cloudShadow = EvalCloudTransmittance(EvalCloudOpticalDepth(cloudThickness));

	vec3 trmtFromSun = SampleTransmittance(surfParam.dotSunLight, surface.height * 1e4);
	vec3 radiance = CalcLighting(surface, u_lightDir) * u_lightColor * trmtFromSun * cloudShadow;

	gl_FragColor = vec4(radiance, 1.0);
}

