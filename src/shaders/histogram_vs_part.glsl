
// required macros:
//   - BUCKET_SIZE
//   - OUTPUT_SIZE


uniform sampler2D	t_color;

uniform vec2	u_invImgSize;  // of source image



void main(void) {
	// to sample with a window of size defined in ImgProc.Histogram.sampleWindowSize
	vec2 samplePos = position.xy * u_invImgSize + 0.5;
	if (samplePos.x < 0.0 || samplePos.x > 1.0 || samplePos.y < 0.0 || samplePos.y > 1.0) {
		gl_Position = vec4(10.0);
		return;
	}
	else {

	float luminance = CalcLuminance(texture2D(t_color, samplePos).rgb);

	// TODO: replace hard-coded numbers like 128.0 with macros
	// clamp to [-128, 128) and remap to [0, 256) with each bucket 2^(1/BUCKET_SIZE) wide
	float bucketIdx = clamp(log2(luminance) * BUCKET_SIZE, -128.0, 127.0) + 128.0;

	// 1) $outPos divided by 8, to range [0, 2);
	// 2) then add an offset of half pixel
	vec2 outPos = vec2(mod(bucketIdx, OUTPUT_SIZE), floor(bucketIdx / OUTPUT_SIZE)) * (2.0/OUTPUT_SIZE) + (0.5/OUTPUT_SIZE);

	gl_Position = vec4(outPos - 1.0, 1.0, 1.0);
	gl_PointSize = 1.0;

	}
}

