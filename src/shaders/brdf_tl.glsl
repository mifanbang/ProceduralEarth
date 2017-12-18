

uniform vec3	u_viewPos;

varying vec3	v_worldPosition;	// world-space position (normalized)



struct SurfaceParam {
	vec3	surfacePos;
	float	dotSunLight;
	float	fbm;
	float	fbmAlt;
};

struct SurfaceProperties {
	vec3	albedo;
	float	glossiness;
	vec3	specularColor;
	vec3	normal;
	float	height;
};


// forward declarations
SurfaceProperties CalcSurfaceProperties(SurfaceParam param);



// TODO: normalization of BRDF
vec3 CalcLommelSeeliger(vec3 albedo, vec3 normal, vec3 light, vec3 view) {
	float uIncident = max(dot(light, normal), 0.0);
	float uReflective = max(dot(view, normal), 0.0);
	return albedo * uIncident / max(uIncident + uReflective, 1e-9);  // use max() to avoid the case of 0/0
}

vec3 CalcBRDF_Lambert(vec3 albedo, vec3 normal, vec3 light) {
	const float invPI = 1.0 / 3.1415926;
	return albedo * max(dot(normal, light), 0.0) * invPI;
}

vec3 CalcFresnel_Schlick(vec3 specularColor, float dotLH) {
	vec3 blendingOpponent = vec3(pow(1.0 - max(dotLH, 0.0), 5.0));
	return (1.0 - specularColor) * blendingOpponent + specularColor;
}

float CalcDistribution_Blinn(float sharpness, float dotNH) {
	const float twoPI = 2.0 * 3.1415926;
	return (sharpness + 2.0) / twoPI * pow(max(dotNH, 0.0), sharpness);
}

float CalcGeometry_CookTorrance(float dotNH_2_over_dotVH, float dotNV, float dotNL) {
	float g1 = dotNH_2_over_dotVH * dotNV;
	float g2 = dotNH_2_over_dotVH * dotNL;
	return min(1.0, min(g1, g2));
}

float CalcBRDF_TorranceSparrow(vec3 N, vec3 L, vec3 V, float glossiness, vec3 specColor, out vec3 fresnel) {
	vec3 H = normalize(V + L);
	float specularPower = exp2(10.0 * glossiness + 1.0);
	float dotNL = dot(N, L);
	float dotNV = dot(N, V);
	float dotNH = dot(N, H);
	float dotVH = dot(V, H);

	fresnel = CalcFresnel_Schlick(specColor, dotVH);  // dotLH = dotVH
	float outRadianceScaler = 
		  CalcGeometry_CookTorrance(2.0 * dotNH / dotVH, dotNV, dotNL)
		* CalcDistribution_Blinn(specularPower, dotNH)
		/ (dotNV * 4.0);  // dotNL in the denominator is cancelled out because BRDF takes irradiance

	return max(outRadianceScaler, 0.0);
}


vec3 CalcLighting(SurfaceProperties surface, vec3 lightDir) {
	vec3 viewDir = normalize(u_viewPos - v_worldPosition);

	// diffuse term: Lambert model
	vec3 diffuse = CalcBRDF_Lambert(
		max(surface.albedo, vec3(0.0)),
		surface.normal,	// N
		-lightDir	// L
	);

	// specular term: Torrance-Sparrow model
	if (surface.glossiness > 0.0) {  // only render highlights if glossiness is explicitly assigned in DrawSurfaceColor()
		vec3 fresnel;
		float specular = CalcBRDF_TorranceSparrow(
			surface.normal,	// N
			-lightDir,	// L
			viewDir,		// V
			surface.glossiness,
			surface.specularColor,
			fresnel  // output: fresnel term
		);

		// TODO: aim is energy conservation. some say this formula is wrong at the diffisive part but it looks ok for now
		return mix(diffuse, vec3(specular), fresnel);
	}
	else
		return diffuse;
}

