// dependencies:
//   - scattering_tl.glsl


uniform vec3	u_lightDir;
uniform vec3	u_viewPos;
uniform float	u_radiusAtmo;

varying vec3	v_worldPosition;	// world-space position (normalized)



void main(void) {
	vec3 viewDir = normalize(v_worldPosition - u_viewPos);

	InScatteringParam inSctrParam;
	inSctrParam.viewPos = u_viewPos * (u_planetRadius + u_atmoThickness) / u_radiusAtmo;
	inSctrParam.viewDir = viewDir;
	inSctrParam.lightDir = u_lightDir;
	gl_FragColor.xyz = GetPlanetaryTransmittance(inSctrParam);

	gl_FragColor.w = 1.0;
}

