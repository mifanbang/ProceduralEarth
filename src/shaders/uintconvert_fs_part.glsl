
uniform sampler2D	t_srcImg;

uniform vec2	u_invSrcImgSize;



void main(void) {
	vec2 samplePos = gl_FragCoord.xy * u_invSrcImgSize;
	float val = texture2D(t_srcImg, samplePos).r;  // only red channel

	gl_FragColor.rgb = PackIntegralPartToRGB_888(val);
	gl_FragColor.a = 1.0;
}

