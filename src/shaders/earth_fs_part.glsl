
// dependencies:
//   - planet_fs_part.glsl

#define HEIGHTMAP_TO_KM		1e1
#define HEIGHTMAP_TO_METER	1e4


uniform float	u_heightOcean;
uniform vec3	u_colorLand;
uniform vec3	u_colorMountain;
uniform vec3	u_colorOcean;
uniform vec3	u_colorSand;



float CalcTemperature(vec3 surfacePos, float altitude) {
	float latitude = degrees(asin(surfacePos.y));
	float latitudeTerm = (max(abs(latitude), 20.0) - 20.0) * 0.78;
	float altitudeTerm = max(altitude, 0.0) * 6.49 * HEIGHTMAP_TO_KM;  // -6.49 K/km

	return 30.0 - latitudeTerm - altitudeTerm;
}


SurfaceProperties CalcSurfaceProperties(SurfaceParam param) {
	const vec3 COLOR_SNOW = vec3(0.75);  // REF: "Albedo". https://en.wikipedia.org/wiki/Albedo

	SurfaceProperties result;

	float height = param.fbm;
	float temperatureJitter = param.fbmAlt * 10.0;
	float temperature = CalcTemperature(param.surfacePos, smoothstep(u_heightOcean, 1.0, height)) + temperatureJitter;  // re-scale height with smoothstep()
	float bumpScaler = 3e-2;  // default value

	if (temperature <= 0.0) {
		result.albedo = COLOR_SNOW;
		result.glossiness = 0.1;
		result.specularColor = vec3(0.01801);  // water ice
		bumpScaler = (height > u_heightOcean ? 1e-2 : 1e-4);
	}
	else if (height > u_heightOcean) {
		result.albedo = mix(u_colorMountain, u_colorLand, clamp(temperature / 20.0, 0.0, 1.0));
		result.glossiness = 0.0;
		bumpScaler *= pow(min(height - u_heightOcean, 1.0), 0.5);  // flatten normal based on altitude
	}
	else {
		result.albedo = u_colorOcean;
		result.glossiness = 0.5;
		result.specularColor = vec3(0.02732);  // liquid water
		bumpScaler = 1e-5;

		// shallow seawater
		float depth = (u_heightOcean - height) * HEIGHTMAP_TO_METER;
		if (depth < 200.0) {
			const vec3 ALPHA_OCEAN = vec3(-0.34, -0.0325, -0.00635);  // unit: m^-1
			vec3 absorption = exp(ALPHA_OCEAN * depth);  // Beer's law
			result.albedo += u_colorSand * absorption * absorption;  // absorbed twice: Sun-to-seabed and seabed-to-eye
		}
	}

	result.normal = CalcBumpNormal(param.surfacePos, height, bumpScaler);
	result.height = height;

	return result;
}

