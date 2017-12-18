
// required macros:
//   - SCALER


uniform sampler2D	t_srcImg;

uniform vec2	u_invSrcImgSize;



vec3 SampleSrcImg(vec2 samplePos) {
	return texture2D(t_srcImg, samplePos).rgb;
}


void main(void) {
	vec2 sampleStartPos = gl_FragCoord.xy * u_invSrcImgSize * SCALER;

	vec3 summedColor = vec3(0.0);
	for (float i = 0.0; i < SCALER; ++i) {
		for (float j = 0.0; j < SCALER; ++j)
			summedColor += SampleSrcImg(sampleStartPos + vec2(u_invSrcImgSize.x * i, u_invSrcImgSize.y * j));
	}
	summedColor *= (1.0 / SCALER / SCALER);

	gl_FragColor.rgb = max(summedColor, 0.0);
	gl_FragColor.a = 1.0;
}

