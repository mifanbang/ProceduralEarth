
#define ToneMapping	ReinhardToneMapping
//#define ToneMapping	CalcToneMapUncharted2


uniform sampler2D	t_color;

uniform vec2	u_random;
uniform vec2	u_invImgSize;
uniform float	u_exposure;



void main(void) {
	vec2 samplePos = gl_FragCoord.xy * u_invImgSize;
	vec3 hdrColor = max(texture2D(t_color, samplePos).rgb, 0.0) * u_exposure;
	vec3 ldrLinearColor = ToneMapping(hdrColor);

	gl_FragColor.rgb = ConvertLinearToSRGB(ldrLinearColor);
	gl_FragColor.rgb += (GetGrain(gl_FragCoord.xy + u_random) - 0.5) / 256.0;  // anti-banding
	gl_FragColor.a = 1.0;
}

