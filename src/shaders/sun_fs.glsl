
// required macros:
//   - ON_MOBILE


uniform vec3	u_color;
uniform float	u_surfaceAngle;  // defines the visual size of the Sun
uniform vec3	u_viewPos;
uniform vec3	u_centerPos;  // center of the Sun

varying vec3	v_worldPosition;



float EvalCoronaIntensity(float tangent) {
#if ON_MOBILE
		// color buffer on mobiles is in half-float format and thus unable to store detailed attenuation
		const float ATTENUATION_POWER = -8.0;
#else
		const float ATTENUATION_POWER = -5.0;
#endif  // ON_MOBILE

		float outness = tangent / u_surfaceAngle + 0.4;  // add 0.4 to offset a little, "pulling" the corona inwards, to make it dimmer
		return clamp(pow(outness, ATTENUATION_POWER), 0.0, 1.0);  // use hyperbola as attenuation function
}



void main(void) {
	vec3 viewDir = normalize(v_worldPosition - u_viewPos);
	vec3 centerDir = normalize(u_centerPos - u_viewPos);

	float cosine = dot(viewDir, centerDir);
	float tangent = sqrt(1.0 - cosine*cosine) / cosine;

	if (tangent <= u_surfaceAngle)
		gl_FragColor.a = 1.0;  // Sun surface
	else
		gl_FragColor.a = EvalCoronaIntensity(tangent);  // corona

	gl_FragColor.rgb = u_color;
}

