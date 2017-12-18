
// ref: http://filmicgames.com/archives/75
vec3 CalcToneMapUncharted2(vec3 hdrColor) {
	float A = 0.22;  // shoulder strength
	float B = 0.30;  // linear strength
	float C = 0.10;  // linear angle
	float D = 0.20;  // toe strength
	float E = 0.02;  // toe numerator
	float F = 0.30;  // toe denominator
	return ((hdrColor * (A * hdrColor + C * B) + D * E) / (hdrColor * (A * hdrColor + B) + D * F)) - E / F;
}

vec3 ConvertLinearToSRGB(vec3 linearColor) {
	return pow(linearColor, vec3(0.4545));
}

float GetGrain(vec2 co) {
	float f = sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453;
	return fract(f);
}


vec2 PackToRGB_888(float val) {
	val = clamp(val, -2.0, 2.0) * 0.25 + 0.5;  // remap [-2, 2] to [0, 1]
	vec2 result = floor(vec2(val * 255.0, val * 255.0 * 255.0));
	return fract(result / 255.0);
}

float UnpackFromRGB_888(vec2 val) {
	return dot(val, vec2(1.0, 1.0 / 255.0)) * 4.0 - 2.0;  // remap [0, 1] to [-2, 2]
}


vec3 PackIntegralPartToRGB_888(float val) {
	float intPart = floor(val);
	vec3 result = vec3(0.0);

	result.r = mod(intPart, 256.0);
	intPart = floor(intPart / 256.0);
	result.g = mod(intPart, 256.0);
	intPart = floor(intPart / 256.0);
	result.b = mod(intPart, 256.0);

	return result / 255.0;  // remap [0, 255] to [0, 1]
}



float CalcLuminance(vec3 color) {
	return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

