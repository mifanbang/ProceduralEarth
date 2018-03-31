
// required macros:
//   - FBM_GEN_TYPE:	usage for the output texture


#define TYPE_BASIC_N_TERRAIN	1
#define TYPE_CLOUDANIM			2
#define TYPE_MILKYWAY			3

#ifndef FBM_GEN_TYPE
	#define FBM_GEN_TYPE	TYPE_BASIC_N_TERRAIN  // default type
#endif



uniform sampler2D	t_gradients;
uniform samplerCube	t_prevFbm;
uniform bool		u_usePrevFbm;

uniform vec4		u_currGridCell;
uniform vec3		u_displace1;
uniform vec3		u_displace2;
uniform float		u_freqScaler;

varying vec3		v_modelPosition;



float NoiseWeight(float t) {
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);  // 6*t^5 - 15*t^4 + 10*t^3
}

vec3 SamplePrecomputedGradient(float x, float y, float z) {
	float fx = mod(x, 256.0);
	float fy = mod(y, 256.0);

	float blockX = mod(z, 16.0) * 256.0;
	float blockY = floor(z / 16.0) * 256.0;
	vec2 index = vec2(blockX + fx, blockY + fy) + 0.5;

	return (texture2D(t_gradients, index / 4096.0).rgb * 16.0 - 1.0);
}

float Gradient(vec3 index, vec3 delta) {
	vec3 grad = SamplePrecomputedGradient(index.x, index.y, index.z);
	return dot(grad, delta);
}

float PerlinNoise(vec3 p) {
	// compute noise cell coordinates and offsets
	vec3 delta = fract(p);
	vec3 index = mod(floor(p), 256.0);

	float w000 = Gradient(index, delta);
	float w100 = Gradient(index + vec3(1.0, 0.0, 0.0), delta - vec3(1.0, 0.0, 0.0));
	float w010 = Gradient(index + vec3(0.0, 1.0, 0.0), delta - vec3(0.0, 1.0, 0.0));
	float w110 = Gradient(index + vec3(1.0, 1.0, 0.0), delta - vec3(1.0, 1.0, 0.0));
	float w001 = Gradient(index + vec3(0.0, 0.0, 1.0), delta - vec3(0.0, 0.0, 1.0));
	float w101 = Gradient(index + vec3(1.0, 0.0, 1.0), delta - vec3(1.0, 0.0, 1.0));
	float w011 = Gradient(index + vec3(0.0, 1.0, 1.0), delta - vec3(0.0, 1.0, 1.0));
	float w111 = Gradient(index + vec3(1.0, 1.0, 1.0), delta - vec3(1.0, 1.0, 1.0));

	// compute trilinear interpolation of weights
	float wx = NoiseWeight(delta.x);
	float wy = NoiseWeight(delta.y);
	float wz = NoiseWeight(delta.z);
	float x00 = mix(w000, w100, wx);
	float x10 = mix(w010, w110, wx);
	float x01 = mix(w001, w101, wx);
	float x11 = mix(w011, w111, wx);
	float y0 = mix(x00, x10, wy);
	float y1 = mix(x01, x11, wy);
	return mix(y0, y1, wz);
}



struct Noise8 {
	vec4 high;
	vec4 low;
};


Noise8 CalcPerlinNoises(vec3 v3Point, float freq) {
	Noise8 result;

	result.low.x = PerlinNoise(v3Point);
	result.low.y = PerlinNoise(v3Point * freq);

	float currFreq = freq * freq;
	result.low.z = PerlinNoise(v3Point * currFreq);
	currFreq *= freq;
	result.low.w = PerlinNoise(v3Point * currFreq);

	currFreq *= freq;
	result.high.x = PerlinNoise(v3Point * currFreq);
	currFreq *= freq;
	result.high.y = PerlinNoise(v3Point * currFreq);
	currFreq *= freq;
	result.high.z = PerlinNoise(v3Point * currFreq);
	currFreq *= freq;
	result.high.w = PerlinNoise(v3Point * currFreq);

	return result;
}


float fBmTerrain(Noise8 noise, float lacunarity) {
	const float offset = 0.05;
	const float heightScaler = 0.7;

	float result = (noise.low.x + offset);
	float freq = lacunarity;

#define ITERATE(_noise) {  float increment = result * pow(freq, -0.57) * (_noise + offset);  result += increment;  freq *= lacunarity;  }
	ITERATE(noise.low.y);
	ITERATE(noise.low.z);
	ITERATE(noise.low.w);
	ITERATE(noise.high.x);
	ITERATE(noise.high.y);
	ITERATE(noise.high.z);
	ITERATE(noise.high.w);
#undef ITERATE

	return result * heightScaler;
}


float fBmBasic(Noise8 noise) {
	const vec4 multiplierLow = vec4(1.0, 0.5, 0.25, 0.125);
	const vec4 multiplierHigh = vec4(0.0625, 0.03125, 0.015625, 0.0078125);

	return dot(noise.low, multiplierLow) + dot(noise.high, multiplierHigh);
}


float fBmMilkyWay(Noise8 noise) {
	const vec4 multiplierLow = vec4(1.0, 0.5, 0.25, 0.125);
	const vec4 multiplierHigh = vec4(0.0625, 0.03125, 0.015625, 0.0078125);

	// multiplying a scaler to $normal (in this case, u_freqScaler) yields better results
	vec3 normal = normalize(v_modelPosition) * u_freqScaler;

	float weight = max(1.0 - abs(normal.y), 0.0);
	vec4 weightHigh;  // => weight(^4, ^3, ^2, ^1)
	weightHigh.w = weight;
	weightHigh.z = weight * weight;
	weightHigh.xy = weightHigh.zw * weightHigh.z;
	vec4 weightLow = weightHigh * weightHigh.x;  // => weight(^8, ^7, ^6, ^5)

	return dot(abs(noise.low) * multiplierLow, weightLow)  // only take abs() of the low-freq part
		+ dot(noise.high * multiplierHigh, weightHigh);
}



void main(void) {
	if (gl_FragCoord.x < u_currGridCell.x || gl_FragCoord.x >= u_currGridCell.y)
		discard;
	if (gl_FragCoord.y < u_currGridCell.z || gl_FragCoord.y >= u_currGridCell.w)
		discard;

	vec3 normal = normalize(v_modelPosition) * u_freqScaler;

#if FBM_GEN_TYPE == TYPE_BASIC_N_TERRAIN
	gl_FragColor.rg = PackToRGB_888( fBmBasic( CalcPerlinNoises(normal + u_displace1, 2.0) ) );
	gl_FragColor.ba = PackToRGB_888( fBmTerrain( CalcPerlinNoises(normal + u_displace2, 2.5), 2.5 ) );

#elif FBM_GEN_TYPE == TYPE_CLOUDANIM
	vec3 normalStretched = vec3(normal.x, normal.y * 1.25, normal.z);

	if (u_usePrevFbm)
		gl_FragColor.rg = textureCube(t_prevFbm, normal).ba;
	else
		gl_FragColor.rg = PackToRGB_888( fBmBasic( CalcPerlinNoises(normalStretched + u_displace1, 3.0) ) );
	gl_FragColor.ba = PackToRGB_888( fBmBasic( CalcPerlinNoises(normalStretched + u_displace2, 3.0) ) );

#elif FBM_GEN_TYPE == TYPE_MILKYWAY
	gl_FragColor.rg = PackToRGB_888( fBmMilkyWay( CalcPerlinNoises(normal + u_displace1, 2.0) ) );

#else
	#error FBM_GEN_TYPE is invalid
#endif  // FBM_GEN_TYPE

}

