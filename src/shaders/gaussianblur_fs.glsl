
#if defined(DIRECTION) && DIRECTION == 1
	// vertical
	#define SAMPLE_POS_ELEM(var)	(var.y)
#else
	// horizontal by default
	#define SAMPLE_POS_ELEM(var)	(var.x)
#endif


uniform sampler2D	t_srcImg;

uniform vec2	u_invSrcImgSize;  // src and dst should have the same size



vec3 SampleSrcImg(vec2 samplePos) {
	return texture2D(t_srcImg, samplePos).rgb;
}


void main(void) {
	const float halfKernel = 7.0;
	const float sigma = 0.6;

	vec3 summedColor = vec3(0.0);
	float summedWeight = 0.0;

	vec2 samplePos = gl_FragCoord.xy;
	SAMPLE_POS_ELEM(samplePos) -= halfKernel;
	samplePos *= u_invSrcImgSize;
	for (float i = -halfKernel; i <= halfKernel; ++i) {
		if (SAMPLE_POS_ELEM(samplePos) >= 0.0 && SAMPLE_POS_ELEM(samplePos) <= 1.0) {
			float weight = exp(-i*i / 2.0*sigma*sigma) / (2.0*3.1415926*sigma*sigma);
			summedWeight += weight;
			summedColor += weight * SampleSrcImg(samplePos);
		}

		SAMPLE_POS_ELEM(samplePos) += SAMPLE_POS_ELEM(u_invSrcImgSize);
	}

	if (summedWeight > 0.0)
		gl_FragColor.rgb = summedColor / summedWeight;
	gl_FragColor.a = 1.0;
}

