

uniform samplerCube	t_noise;

uniform mat4	u_inverseProjView;
uniform vec3	u_galacticCamPos;  // affected by the angle between galatic and ecliptic planes
uniform float	u_distToGalacticCenter;

uniform float	u_rhoZero;
uniform float	u_densityGas;

varying vec3	v_modelPosition;



float IntegrateStarDensity(vec3 dir) {
	// REF: https://en.wikipedia.org/wiki/Thin_disk
	// REF: https://en.wikipedia.org/wiki/Milky_Way
	const float sampleLen = 1.0;  // unit: kpc
	const int sampleNum = 30;  // sampleLen*sampleNum >= 30kpc ~estimated Milky Way diameter
	vec3 centerPos = vec3(u_distToGalacticCenter, 0.0, 0.0);  // distance from galactic center to sun ~8kpc

	float totalDensity = 0.0;
	float currentStep = 0.0;
	for (int i = 0; i < sampleNum; ++i) {
		float distToSun = sampleLen * 0.5 + currentStep;
		vec3 samplePos = dir * distToSun;
		float distToCenVert = abs(samplePos.y - centerPos.y);
		float distToCenHori = distance(samplePos.xz, centerPos.xz);

		totalDensity += (
			  exp(distToCenHori / -3.5 + distToCenVert / -0.4)  // Thin Disk: scale length ~3.5kpc, scale height ~0.4kpc
			+ exp(length(samplePos - centerPos) / -0.6)  // Bulge: scale radius ~0.6kpc
		);
		currentStep += sampleLen;
	}

	return totalDensity;
}


// inter-stellar gas
float FetchGasDensity(vec3 dir) {
	vec4 fbm = textureCube(t_noise, dir);
	return UnpackFromRGB_888(fbm.rg);
}


vec3 CompositeMilkyWay(float densityStars, float grain, float densityGas) {
	const vec3 colorStar = vec3(1.0, 0.9, 0.7);
	const vec3 colorGas = vec3(0.12, 0.06, 0.02);
	const vec3 extinction = vec3(8e-1, 13.5e-1, 23e-1);  // non-physically based extinction coefficient

	float densityGalaxy = densityStars * grain - 2.5e-2;  // substract a little bit (2.5e-2) to counter some overestimate
	vec3 transmittance = exp(-extinction * densityGas * u_densityGas);  // Beer-Lambert law for transmittance due to gases
	return colorStar * transmittance * densityGalaxy;
}


void main() {
	vec4 reprojected = u_inverseProjView * vec4(v_modelPosition, 1.0);
	reprojected /= reprojected.w;
	vec3 dir = normalize(reprojected.xyz - u_galacticCamPos);

	// add grains to provide a more plausible appearance
	vec2 sphericalCoord = vec2(acos(dir.z), atan(dir.y/dir.x));
	sphericalCoord = floor(sphericalCoord * 1e3) * 1e-3;  // drop digits smaller than 1e-3 to avoid flickering
	float grain = GetGrain(sphericalCoord) * 0.5 + 1.0;  // remap to [1.0, 1.5]

	gl_FragColor.rgb = CompositeMilkyWay(IntegrateStarDensity(dir), grain, FetchGasDensity(dir)) * u_rhoZero;
}

