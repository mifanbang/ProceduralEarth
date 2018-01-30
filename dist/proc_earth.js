"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ColorHelper;
(function (ColorHelper) {
    var xyzMatchingFunc = [
        [0.003769647, 0.0004146161, 0.0184726],
        [0.009382967, 0.001059646, 0.04609784],
        [0.02214302, 0.002452194, 0.109609],
        [0.04742986, 0.004971717, 0.2369246],
        [0.08953803, 0.00907986, 0.4508369],
        [0.1446214, 0.01429377, 0.7378822],
        [0.2035729, 0.02027369, 1.051821],
        [0.2488523, 0.02612106, 1.305008],
        [0.2918246, 0.03319038, 1.552826],
        [0.3227087, 0.0415794, 1.74828],
        [0.3482554, 0.05033657, 1.917479],
        [0.3418483, 0.05743393, 1.918437],
        [0.3224637, 0.06472352, 1.848545],
        [0.2826646, 0.07238339, 1.664439],
        [0.2485254, 0.08514816, 1.522157],
        [0.2219781, 0.1060145, 1.42844],
        [0.1806905, 0.1298957, 1.25061],
        [0.129192, 0.1535066, 0.9991789],
        [0.08182895, 0.1788048, 0.7552379],
        [0.04600865, 0.2064828, 0.5617313],
        [0.02083981, 0.237916, 0.4099313],
        [0.007097731, 0.285068, 0.3105939],
        [0.002461588, 0.3483536, 0.2376753],
        [0.003649178, 0.4277595, 0.1720018],
        [0.01556989, 0.5204972, 0.1176796],
        [0.04315171, 0.6206256, 0.08283548],
        [0.07962917, 0.718089, 0.05650407],
        [0.1268468, 0.7946448, 0.03751912],
        [0.1818026, 0.8575799, 0.02438164],
        [0.2405015, 0.9071347, 0.01566174],
        [0.3098117, 0.9544675, 0.00984647],
        [0.3804244, 0.9814106, 0.006131421],
        [0.4494206, 0.9890228, 0.003790291],
        [0.5280233, 0.9994608, 0.002327186],
        [0.6133784, 0.9967737, 0.001432128],
        [0.7016774, 0.9902549, 0.0008822531],
        [0.796775, 0.9732611, 0.0005452416],
        [0.8853376, 0.9424569, 0.0003386739],
        [0.9638388, 0.8963613, 0.0002117772],
        [1.051011, 0.8587203, 0.0001335031],
        [1.109767, 0.8115868, 0.00008494468],
        [1.14362, 0.7544785, 0.00005460706],
        [1.151033, 0.6918553, 0.00003549661],
        [1.134757, 0.6270066, 0.00002334738],
        [1.083928, 0.5583746, 0.00001554631],
        [1.007344, 0.489595, 0.00001048387],
        [0.9142877, 0.4229897, 0],
        [0.8135565, 0.3609245, 0],
        [0.6924717, 0.2980865, 0],
        [0.575541, 0.2416902, 0],
        [0.4731224, 0.1943124, 0],
        [0.3844986, 0.1547397, 0],
        [0.2997374, 0.119312, 0],
        [0.2277792, 0.08979594, 0],
        [0.1707914, 0.06671045, 0],
        [0.1263808, 0.04899699, 0],
        [0.09224597, 0.03559982, 0],
        [0.0663996, 0.02554223, 0],
        [0.04710606, 0.01807939, 0],
        [0.03292138, 0.01261573, 0],
        [0.02262306, 0.008661284, 0],
        [0.01575417, 0.006027677, 0],
        [0.01096778, 0.004195941, 0],
        [0.00760875, 0.002910864, 0],
        [0.005214608, 0.001995557, 0],
        [0.003569452, 0.001367022, 0],
        [0.002464821, 0.0009447269, 0],
        [0.001703876, 0.000653705, 0],
        [0.001186238, 0.000455597, 0],
        [0.0008269535, 0.0003179738, 0],
        [0.0005758303, 0.0002217445, 0],
        [0.0004058303, 0.0001565566, 0],
        [0.0002856577, 0.0001103928, 0],
        [0.0002021853, 0.00007827442, 0],
        [0.000143827, 0.00005578862, 0],
        [0.0001024685, 0.00003981884, 0],
        [0.00007347551, 0.00002860175, 0],
        [0.0000525987, 0.00002051259, 0],
        [0.00003806114, 0.00001487243, 0],
        [0.00002758222, 0.00001080001, 0],
        [0.00002004122, 0.00000786392, 0],
        [0.00001458792, 0.000005736935, 0],
        [0.00001068141, 0.000004211597, 0],
        [0.000007857521, 0.000003106561, 0],
        [0.000005768284, 0.000002286786, 0],
        [0.000004259166, 0.000001693147, 0],
        [0.000003167765, 0.000001262556, 0],
        [0.000002358723, 9.422514e-7, 0],
        [0.000001762465, 7.05386e-7, 0]
    ];
    function EvalSpectralRadiance(temperature, wavelength) {
        var h = 6.626e-34;
        var c = 3e8;
        var k = 1.38e-23;
        return 2 * h * c * c * Math.pow(wavelength, -5)
            / (Math.exp(h * c / k / (wavelength * temperature)) - 1);
    }
    function EvalSpectrum(temperature) {
        var START = 390;
        var END = 830;
        var STEP = 5;
        var NUM_SAMPLE = Math.round((END - START) / STEP + 1);
        var dLambda = STEP * 1e-9;
        var spectrum = new Array(NUM_SAMPLE);
        for (var i = START; i <= END; i += STEP)
            spectrum[Math.round((i - START) / STEP)] = EvalSpectralRadiance(temperature, i * 1e-9) * dLambda;
        return spectrum;
    }
    ColorHelper.EvalSpectrum = EvalSpectrum;
    function EvalXYZ(spectrum) {
        if (spectrum.length != xyzMatchingFunc.length)
            throw new Error('#samples mismatched with matching functions');
        var invIntegralY = 1 / xyzMatchingFunc.reduce(function (accu, val) { return accu + val[1]; }, 0);
        var numSamples = spectrum.length;
        var _a = [0, 0, 0], x = _a[0], y = _a[1], z = _a[2];
        for (var i = 0; i < numSamples; ++i) {
            var sampleSpec = spectrum[i];
            var sampleMatching = xyzMatchingFunc[i];
            x += sampleSpec * sampleMatching[0];
            y += sampleSpec * sampleMatching[1];
            z += sampleSpec * sampleMatching[2];
        }
        return { x: x * invIntegralY, y: y * invIntegralY, z: z * invIntegralY };
    }
    ColorHelper.EvalXYZ = EvalXYZ;
    function ConvertXYZToRGB(xyz) {
        return {
            r: 3.2404542 * xyz.x - 1.5371385 * xyz.y - 0.4985314 * xyz.z,
            g: -0.9692660 * xyz.x + 1.8760108 * xyz.y + 0.0415560 * xyz.z,
            b: 0.0556434 * xyz.x - 0.2040259 * xyz.y + 1.0572252 * xyz.z
        };
    }
    ColorHelper.ConvertXYZToRGB = ConvertXYZToRGB;
    function EvalLuminance(rgb) {
        return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    }
    ColorHelper.EvalLuminance = EvalLuminance;
    function EvalColorAndLumi(temperature) {
        var spectrum = EvalSpectrum(temperature);
        var xyz = EvalXYZ(spectrum);
        var rgb = ConvertXYZToRGB(xyz);
        var lumi = xyz.y;
        rgb.r /= lumi;
        rgb.g /= lumi;
        rgb.b /= lumi;
        return { color: rgb, lumi: lumi };
    }
    ColorHelper.EvalColorAndLumi = EvalColorAndLumi;
})(ColorHelper || (ColorHelper = {}));
var Astro;
(function (Astro) {
    var ColorTemperature = (function () {
        function ColorTemperature(temperature) {
            this.temperature = 6000;
            this.color = new THREE.Color(1, 1, 1);
            this.power = 10;
            this.SetTemperature(temperature);
        }
        ColorTemperature.prototype.SetTemperature = function (temperature) {
            this.temperature = temperature;
            var colorLumi = ColorHelper.EvalColorAndLumi(temperature);
            this.power = ColorTemperature.ConvertLuminanceToPower(colorLumi.lumi);
            this.color.setRGB(colorLumi.color.r, colorLumi.color.g, colorLumi.color.b);
        };
        ColorTemperature.prototype.GetTemperature = function () {
            return this.temperature;
        };
        ColorTemperature.prototype.GetPremultipliedColor = function () {
            return this.color.clone().multiplyScalar(this.power);
        };
        ColorTemperature.ConvertLuminanceToPower = function (lumi) {
            return Math.pow(lumi / 1.5e5, 1 / 5) * 9.8 + 0.2;
        };
        return ColorTemperature;
    }());
    Astro.ColorTemperature = ColorTemperature;
})(Astro || (Astro = {}));
var ShaderArchive = (function () {
    function ShaderArchive() {
    }
    ShaderArchive.atmoscattering_fs_part = '// dependencies:\n//   - cloud_tl.glsl\n//   - scattering_tl.glsl\nuniform vec3	u_lightColor;\nuniform vec3	u_viewPos;\nuniform float	u_radiusAtmo;\nuniform mat4	u_invModelMat;\nvarying vec3	v_worldPosition;	// world-space position (normalized)\nvarying vec3	v_worldNormal;		// world-space normal (normalized)\nvoid main(void) {\n	// invariants\n	vec3 worldNormal = normalize(v_worldNormal);\n	vec3 viewDir = normalize(v_worldPosition - u_viewPos);\n	float atmoRadius = u_planetRadius + u_atmoThickness;  // unit: m\n	float glUnitToMeter = atmoRadius / u_radiusAtmo;\n	// intersection\n	InScatteringParam inSctrParam;\n	inSctrParam.viewPos = u_viewPos * glUnitToMeter;\n	inSctrParam.viewDir = viewDir;\n	inSctrParam.lightDir = u_lightDir;\n	PlanetIntersectResult intsct = IntersectPlanet(inSctrParam);\n	// hit test with clouds\n	if (intsct.hitsGround) {\n		vec3 posWorldSpace = v_worldPosition * glUnitToMeter;  // unit: m\n		vec3 cloudSampleWorldSpace = GetCloudSamplePosition(posWorldSpace, viewDir, u_planetRadius);\n		vec3 cloudSampleModelSpace = (u_invModelMat * vec4(normalize(cloudSampleWorldSpace), 0.0)).xyz;\n		float cloudThickness = EvalCloudThickness(SampleCloud(cloudSampleModelSpace));\n		if (cloudThickness > 0.0) {\n			// use blending on $distToFarInter to avoid sudden change of in-scattering\n			const float INV_BLENDING_HEIGHT = 1.0 / 5e2;  // 500 meters\n			float newDistToFarInter = intsct.t.distToNearInter + distance(cloudSampleWorldSpace, posWorldSpace) - cloudThickness;\n			intsct.t.distToFarInter = mix(intsct.t.distToFarInter, newDistToFarInter, min(cloudThickness * INV_BLENDING_HEIGHT, 1.0));\n		}\n	}\n	gl_FragColor.xyz = IntegrateInScattering(inSctrParam, intsct) * u_lightColor;\n	gl_FragColor.w = 1.0;\n}\n';
    ShaderArchive.atmotransmittance_fs_part = '// dependencies:\n//   - scattering_tl.glsl\nuniform vec3	u_lightDir;\nuniform vec3	u_viewPos;\nuniform float	u_radiusAtmo;\nvarying vec3	v_worldPosition;	// world-space position (normalized)\nvoid main(void) {\n	vec3 viewDir = normalize(v_worldPosition - u_viewPos);\n	InScatteringParam inSctrParam;\n	inSctrParam.viewPos = u_viewPos * (u_planetRadius + u_atmoThickness) / u_radiusAtmo;\n	inSctrParam.viewDir = viewDir;\n	inSctrParam.lightDir = u_lightDir;\n	gl_FragColor.xyz = GetPlanetaryTransmittance(inSctrParam);\n	gl_FragColor.w = 1.0;\n}\n';
    ShaderArchive.background_vs = 'varying vec3	v_modelPosition;\nvoid main(void) {\n	gl_Position = vec4(position.xy, 1.0, 1.0);  // maximum of visible depth value (z=1)\n	v_modelPosition = gl_Position.xyz;\n}\n';
    ShaderArchive.brdf_tl = 'uniform vec3	u_viewPos;\nvarying vec3	v_worldPosition;	// world-space position (normalized)\nstruct SurfaceParam {\n	vec3	surfacePos;\n	float	dotSunLight;\n	float	fbm;\n	float	fbmAlt;\n};\nstruct SurfaceProperties {\n	vec3	albedo;\n	float	glossiness;\n	vec3	specularColor;\n	vec3	normal;\n	float	height;\n};\n// forward declarations\nSurfaceProperties CalcSurfaceProperties(SurfaceParam param);\n// TODO: normalization of BRDF\nvec3 CalcLommelSeeliger(vec3 albedo, vec3 normal, vec3 light, vec3 view) {\n	float uIncident = max(dot(light, normal), 0.0);\n	float uReflective = max(dot(view, normal), 0.0);\n	return albedo * uIncident / max(uIncident + uReflective, 1e-9);  // use max() to avoid the case of 0/0\n}\nvec3 CalcBRDF_Lambert(vec3 albedo, vec3 normal, vec3 light) {\n	const float invPI = 1.0 / 3.1415926;\n	return albedo * max(dot(normal, light), 0.0) * invPI;\n}\nvec3 CalcFresnel_Schlick(vec3 specularColor, float dotLH) {\n	vec3 blendingOpponent = vec3(pow(1.0 - max(dotLH, 0.0), 5.0));\n	return (1.0 - specularColor) * blendingOpponent + specularColor;\n}\nfloat CalcDistribution_Blinn(float sharpness, float dotNH) {\n	const float twoPI = 2.0 * 3.1415926;\n	return (sharpness + 2.0) / twoPI * pow(max(dotNH, 0.0), sharpness);\n}\nfloat CalcGeometry_CookTorrance(float dotNH_2_over_dotVH, float dotNV, float dotNL) {\n	float g1 = dotNH_2_over_dotVH * dotNV;\n	float g2 = dotNH_2_over_dotVH * dotNL;\n	return min(1.0, min(g1, g2));\n}\nfloat CalcBRDF_TorranceSparrow(vec3 N, vec3 L, vec3 V, float glossiness, vec3 specColor, out vec3 fresnel) {\n	vec3 H = normalize(V + L);\n	float specularPower = exp2(10.0 * glossiness + 1.0);\n	float dotNL = dot(N, L);\n	float dotNV = dot(N, V);\n	float dotNH = dot(N, H);\n	float dotVH = dot(V, H);\n	fresnel = CalcFresnel_Schlick(specColor, dotVH);  // dotLH = dotVH\n	float outRadianceScaler = \n		  CalcGeometry_CookTorrance(2.0 * dotNH / dotVH, dotNV, dotNL)\n		* CalcDistribution_Blinn(specularPower, dotNH)\n		/ (dotNV * 4.0);  // dotNL in the denominator is cancelled out because BRDF takes irradiance\n	return max(outRadianceScaler, 0.0);\n}\nvec3 CalcLighting(SurfaceProperties surface, vec3 lightDir) {\n	vec3 viewDir = normalize(u_viewPos - v_worldPosition);\n	// diffuse term: Lambert model\n	vec3 diffuse = CalcBRDF_Lambert(\n		max(surface.albedo, vec3(0.0)),\n		surface.normal,	// N\n		-lightDir	// L\n	);\n	// specular term: Torrance-Sparrow model\n	if (surface.glossiness > 0.0) {  // only render highlights if glossiness is explicitly assigned in DrawSurfaceColor()\n		vec3 fresnel;\n		float specular = CalcBRDF_TorranceSparrow(\n			surface.normal,	// N\n			-lightDir,	// L\n			viewDir,		// V\n			surface.glossiness,\n			surface.specularColor,\n			fresnel  // output: fresnel term\n		);\n		// TODO: aim is energy conservation. some say this formula is wrong at the diffisive part but it looks ok for now\n		return mix(diffuse, vec3(specular), fresnel);\n	}\n	else\n		return diffuse;\n}\n';
    ShaderArchive.cloud_fs_part = '// dependencies:\n//   - brdf_tl.glsl\n//   - cloud_tl.glsl\n//   - normal_tl.glsl\n//   - scattering_tl.glsl\nuniform vec3	u_lightColor;\nvarying vec3	v_modelPosition;	// model-space position\nvarying vec3	v_worldNormal;		// world-space normal (normalized)\nfloat EvalHenyeyGreenstein(float g, float cosTheta) {\n	const float INV_4_PI = 0.25 / 3.1415926;\n	float gSq = g * g;\n	return INV_4_PI * (1.0 - gSq) / pow(1.0 + gSq - 2.0 * g * cosTheta, 1.5);\n}\n// REF: Sebastien Hillaire. \"Physically Based Sky, Atmosphere and Cloud Rendering in Frostbite\". SIGGRAPH 2016 Physically Based Shading in Theory and Practice course.\nfloat EvalPhase(float cosTheta) {\n	const float G_1 = 0.5;\n	const float G_2 = -0.3;\n	const float mixFactor = 0.7;  // weight for the G_1 term\n	return mix(EvalHenyeyGreenstein(G_2, cosTheta), EvalHenyeyGreenstein(G_1, cosTheta), mixFactor);\n}\nfloat EvalScattering(float phase, float opticalDepth) {\n	float opticalDepthAdj = min(opticalDepth, 0.549);  // f(x)=exp(-x)*(1-exp(-2x)) has global max at x=0.549\n	float transmittance = exp(-opticalDepthAdj);\n	float powderEffect = 1.0 - exp(-2.0 * opticalDepthAdj);\n	return phase * 2.0 * transmittance * powderEffect * opticalDepth;\n}\n// Lambertian diffuse lighting with \"baked-in\" ambient term\nfloat EvalCloudLighting(float thickness, float dotNL) {\n	const float ALBEDO = 0.8;\n	return max(dotNL, 0.1) * ALBEDO / 3.1415926;  // set mininum to dotNL to acoount for ambient from sky\n}\nvec3 FixViewerTransmittance(float dotNV, float height) {\n	return SampleTransmittance(dotNV, height) / SampleTransmittance(dotNV, 0.0);\n}\nvoid main(void) {\n	// invariants\n	vec3 modelNPos = normalize(v_modelPosition);  // normalized model-space position\n	vec3 worldNormal = normalize(v_worldNormal);\n	vec3 viewDir = normalize(v_worldPosition - u_viewPos);\n	float dotNL = -dot(worldNormal, u_lightDir);\n	float dotVL = dot(viewDir, u_lightDir);\n	float dotNV = -dot(worldNormal, viewDir);\n	// prepare properties\n	float noiseCloud = SampleCloud(modelNPos);\n	if (noiseCloud <= 0.0)\n		discard;\n	vec3 bumpNormal = CalcBumpNormal(modelNPos, noiseCloud, 3.33e-3);\n	float thickness = EvalCloudThickness(noiseCloud);\n	float opticalDepth = EvalCloudOpticalDepth(thickness);\n	// diffuse and scattering terms\n	float phase = EvalPhase(dotVL);\n	float scattering = EvalScattering(phase, opticalDepth);\n	float diffuse = EvalCloudLighting(thickness, max(-dot(bumpNormal, u_lightDir), 0.0));\n	// put all things together\n	vec3 incidentLight = u_lightColor * SampleTransmittance(dotNL, u_cloudHeight + thickness);\n	vec3 fixedTransmittance = FixViewerTransmittance(dotNV, u_cloudHeight + thickness);\n	vec3 radiance = incidentLight * mix(scattering, diffuse, 0.6) * fixedTransmittance;\n	float transmittance = EvalCloudTransmittance(opticalDepth);\n	gl_FragColor = vec4(radiance, 1.0 - transmittance);\n}\n';
    ShaderArchive.cloud_tl = '// dependencies:\n//   - color_tl.glsl\nuniform samplerCube	t_animNoise;\nuniform float	u_texBlendTime;\nuniform float	u_cloudAmount;\nuniform float	u_cloudHeight;\nuniform vec3	u_lightDir;\nfloat SampleCloud(vec3 position) {\n	vec4 packedAnimFBM = textureCube(t_animNoise, position);\n	float noiseCloud = u_cloudAmount + mix(\n		UnpackFromRGB_888(packedAnimFBM.rg),\n		UnpackFromRGB_888(packedAnimFBM.ba),\n		u_texBlendTime\n	);\n	return max(noiseCloud, 0.0);\n}\nfloat EvalCloudThickness(float noiseCloud) {\n	const float MAX_THICKNESS = 5e3;  // unit: m\n	return noiseCloud * MAX_THICKNESS;\n}\nfloat EvalCloudOpticalDepth(float thickness) {\n	const float EXTINCTION = 3.2e-4;  // REF: Egor Yusov. \"Real-Time Rendering of Physically Based Clouds Using Precomputed Scattering\". In GPU Pro 6, CRC Press, 2016.\n	return thickness * EXTINCTION;\n}\nfloat EvalCloudTransmittance(float opticalDepth) {\n	return pow(exp(-2.0 * opticalDepth), 10.0);\n}\n// $shadingPt can be either position on the ground or at the top of atmosphere\n// $inDir can be either light or view direction towards the shading point\nvec3 GetCloudSamplePosition(vec3 shadingPt, vec3 inDir, float planetRadius) {\n	float radiusCloud = planetRadius + u_cloudHeight;  // unit: m\n	vec3 lowestPos = inDir * -dot(inDir, shadingPt) + shadingPt;\n	float lowestToCloud = sqrt(radiusCloud * radiusCloud - dot(lowestPos, lowestPos));\n	return inDir * -lowestToCloud + lowestPos;\n}\n';
    ShaderArchive.color_tl = '// ref: http://filmicgames.com/archives/75\nvec3 CalcToneMapUncharted2(vec3 hdrColor) {\n	float A = 0.22;  // shoulder strength\n	float B = 0.30;  // linear strength\n	float C = 0.10;  // linear angle\n	float D = 0.20;  // toe strength\n	float E = 0.02;  // toe numerator\n	float F = 0.30;  // toe denominator\n	return ((hdrColor * (A * hdrColor + C * B) + D * E) / (hdrColor * (A * hdrColor + B) + D * F)) - E / F;\n}\nvec3 ConvertLinearToSRGB(vec3 linearColor) {\n	return pow(linearColor, vec3(0.4545));\n}\nfloat GetGrain(vec2 co) {\n	float f = sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453;\n	return fract(f);\n}\nvec2 PackToRGB_888(float val) {\n	val = clamp(val, -2.0, 2.0) * 0.25 + 0.5;  // remap [-2, 2] to [0, 1]\n	vec2 result = floor(vec2(val * 255.0, val * 255.0 * 255.0));\n	return fract(result / 255.0);\n}\nfloat UnpackFromRGB_888(vec2 val) {\n	return dot(val, vec2(1.0, 1.0 / 255.0)) * 4.0 - 2.0;  // remap [0, 1] to [-2, 2]\n}\nvec3 PackIntegralPartToRGB_888(float val) {\n	float intPart = floor(val);\n	vec3 result = vec3(0.0);\n	result.r = mod(intPart, 256.0);\n	intPart = floor(intPart / 256.0);\n	result.g = mod(intPart, 256.0);\n	intPart = floor(intPart / 256.0);\n	result.b = mod(intPart, 256.0);\n	return result / 255.0;  // remap [0, 255] to [0, 1]\n}\nfloat CalcLuminance(vec3 color) {\n	return dot(color, vec3(0.2126, 0.7152, 0.0722));\n}\n';
    ShaderArchive.downscaler_fs = '// required macros:\n//   - SCALER\nuniform sampler2D	t_srcImg;\nuniform vec2	u_invSrcImgSize;\nvec3 SampleSrcImg(vec2 samplePos) {\n	return texture2D(t_srcImg, samplePos).rgb;\n}\nvoid main(void) {\n	vec2 sampleStartPos = gl_FragCoord.xy * u_invSrcImgSize * SCALER;\n	vec3 summedColor = vec3(0.0);\n	for (float i = 0.0; i < SCALER; ++i) {\n		for (float j = 0.0; j < SCALER; ++j)\n			summedColor += SampleSrcImg(sampleStartPos + vec2(u_invSrcImgSize.x * i, u_invSrcImgSize.y * j));\n	}\n	summedColor *= (1.0 / SCALER / SCALER);\n	gl_FragColor.rgb = max(summedColor, 0.0);\n	gl_FragColor.a = 1.0;\n}\n';
    ShaderArchive.earth_fs_part = '// dependencies:\n//   - planet_fs_part.glsl\nuniform float	u_heightOcean;\nuniform vec3	u_colorLand;\nuniform vec3	u_colorMountain;\nuniform vec3	u_colorOcean;\nfloat CalcTemperature(vec3 surfacePos, float altitude) {\n	float latitude = degrees(asin(surfacePos.y));\n	float latitudeTerm = (max(abs(latitude), 20.0) - 20.0) * 0.78;\n	float altitudeTerm = max(altitude, 0.0) * 6.49 * 10.0;  // -6.49 K/km\n	return 30.0 - latitudeTerm - altitudeTerm;\n}\nSurfaceProperties CalcSurfaceProperties(SurfaceParam param) {\n	const vec3 COLOR_SNOW = vec3(0.75);  // REF: \"Albedo\". https://en.wikipedia.org/wiki/Albedo\n	SurfaceProperties result;\n	float height = param.fbm;\n	float temperatureJitter = param.fbmAlt * 10.0;\n	float temperature = CalcTemperature(param.surfacePos, smoothstep(u_heightOcean, 1.0, height)) + temperatureJitter;  // re-scale height with smoothstep()\n	float bumpScaler = 5.6e-3;  // default value\n	if (temperature <= 0.0) {\n		result.albedo = COLOR_SNOW;\n		result.glossiness = 0.1;\n		result.specularColor = vec3(0.01801);  // water ice\n		bumpScaler = (height > u_heightOcean ? 3.6e-3 : 1e-5);\n	}\n	else if (height > u_heightOcean) {\n		result.albedo = mix(u_colorMountain, u_colorLand, clamp(temperature / 20.0, 0.0, 1.0));\n		result.glossiness = 0.0;\n		bumpScaler *= max(height - u_heightOcean, 0.6);  // flatten normal based on altitude\n	}\n	else {\n		result.albedo = u_colorOcean;\n		result.glossiness = 0.5;\n		result.specularColor = vec3(0.02732);  // liquid water\n		bumpScaler = 1e-5;\n	}\n	result.normal = CalcBumpNormal(param.surfacePos, height, bumpScaler);\n	result.height = height;\n	return result;\n}\n';
    ShaderArchive.fbm_fs = '// required macros:\n//   - FBM_GEN_TYPE:	usage for the output texture\n#define TYPE_BASIC_N_TERRAIN	1\n#define TYPE_CLOUDANIM			2\n#define TYPE_MILKYWAY			3\n#ifndef FBM_GEN_TYPE\n	#define FBM_GEN_TYPE	TYPE_BASIC_N_TERRAIN  // default type\n#endif\nuniform sampler2D	t_gradients;\nuniform vec4		u_currGridCell;\nuniform vec3		u_displace1;\nuniform vec3		u_displace2;\nuniform float		u_freqScaler;\nvarying vec3		v_modelPosition;\nfloat NoiseWeight(float t) {\n	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);  // 6*t^5 - 15*t^4 + 10*t^3\n}\nvec3 SamplePrecomputedGradient(float x, float y, float z) {\n	float fx = mod(x, 256.0);\n	float fy = mod(y, 256.0);\n	float blockX = mod(z, 16.0) * 256.0;\n	float blockY = floor(z / 16.0) * 256.0;\n	vec2 index = vec2(blockX + fx, blockY + fy) + 0.5;\n	return (texture2D(t_gradients, index / 4096.0).rgb * 16.0 - 1.0);\n}\nfloat Gradient(vec3 index, vec3 delta) {\n	vec3 grad = SamplePrecomputedGradient(index.x, index.y, index.z);\n	return dot(grad, delta);\n}\nfloat PerlinNoise(vec3 p) {\n	// compute noise cell coordinates and offsets\n	vec3 delta = fract(p);\n	vec3 index = mod(floor(p), 256.0);\n	float w000 = Gradient(index, delta);\n	float w100 = Gradient(index + vec3(1.0, 0.0, 0.0), delta - vec3(1.0, 0.0, 0.0));\n	float w010 = Gradient(index + vec3(0.0, 1.0, 0.0), delta - vec3(0.0, 1.0, 0.0));\n	float w110 = Gradient(index + vec3(1.0, 1.0, 0.0), delta - vec3(1.0, 1.0, 0.0));\n	float w001 = Gradient(index + vec3(0.0, 0.0, 1.0), delta - vec3(0.0, 0.0, 1.0));\n	float w101 = Gradient(index + vec3(1.0, 0.0, 1.0), delta - vec3(1.0, 0.0, 1.0));\n	float w011 = Gradient(index + vec3(0.0, 1.0, 1.0), delta - vec3(0.0, 1.0, 1.0));\n	float w111 = Gradient(index + vec3(1.0, 1.0, 1.0), delta - vec3(1.0, 1.0, 1.0));\n	// compute trilinear interpolation of weights\n	float wx = NoiseWeight(delta.x);\n	float wy = NoiseWeight(delta.y);\n	float wz = NoiseWeight(delta.z);\n	float x00 = mix(w000, w100, wx);\n	float x10 = mix(w010, w110, wx);\n	float x01 = mix(w001, w101, wx);\n	float x11 = mix(w011, w111, wx);\n	float y0 = mix(x00, x10, wy);\n	float y1 = mix(x01, x11, wy);\n	return mix(y0, y1, wz);\n}\nstruct Noise8 {\n	vec4 high;\n	vec4 low;\n};\nNoise8 CalcPerlinNoises(vec3 v3Point, float freq) {\n	Noise8 result;\n	result.low.x = PerlinNoise(v3Point);\n	result.low.y = PerlinNoise(v3Point * freq);\n	float currFreq = freq * freq;\n	result.low.z = PerlinNoise(v3Point * currFreq);\n	currFreq *= freq;\n	result.low.w = PerlinNoise(v3Point * currFreq);\n	currFreq *= freq;\n	result.high.x = PerlinNoise(v3Point * currFreq);\n	currFreq *= freq;\n	result.high.y = PerlinNoise(v3Point * currFreq);\n	currFreq *= freq;\n	result.high.z = PerlinNoise(v3Point * currFreq);\n	currFreq *= freq;\n	result.high.w = PerlinNoise(v3Point * currFreq);\n	return result;\n}\nfloat fBmTerrain(Noise8 noise, float lacunarity) {\n	const float offset = 0.05;\n	const float heightScaler = 0.7;\n	float result = (noise.low.x + offset);\n	float freq = lacunarity;\n#define ITERATE(_noise) {  float increment = result * pow(freq, -0.57) * (_noise + offset);  result += increment;  freq *= lacunarity;  }\n	ITERATE(noise.low.y);\n	ITERATE(noise.low.z);\n	ITERATE(noise.low.w);\n	ITERATE(noise.high.x);\n	ITERATE(noise.high.y);\n	ITERATE(noise.high.z);\n	ITERATE(noise.high.w);\n#undef ITERATE\n	return result * heightScaler;\n}\nfloat fBmBasic(Noise8 noise) {\n	const vec4 multiplierLow = vec4(1.0, 0.5, 0.25, 0.125);\n	const vec4 multiplierHigh = vec4(0.0625, 0.03125, 0.015625, 0.0078125);\n	return dot(noise.low, multiplierLow) + dot(noise.high, multiplierHigh);\n}\nfloat fBmMilkyWay(Noise8 noise) {\n	const vec4 multiplierLow = vec4(1.0, 0.5, 0.25, 0.125);\n	const vec4 multiplierHigh = vec4(0.0625, 0.03125, 0.015625, 0.0078125);\n	// multiplying a scaler to $normal (in this case, u_freqScaler) yields better results\n	vec3 normal = normalize(v_modelPosition) * u_freqScaler;\n	float weight = max(1.0 - abs(normal.y), 0.0);\n	vec4 weightHigh;  // => weight(^4, ^3, ^2, ^1)\n	weightHigh.w = weight;\n	weightHigh.z = weight * weight;\n	weightHigh.xy = weightHigh.zw * weightHigh.z;\n	vec4 weightLow = weightHigh * weightHigh.x;  // => weight(^8, ^7, ^6, ^5)\n	return dot(abs(noise.low) * multiplierLow, weightLow)  // only take abs() of the low-freq part\n		+ dot(noise.high * multiplierHigh, weightHigh);\n}\nvoid main(void) {\n	if (gl_FragCoord.x < u_currGridCell.x || gl_FragCoord.x >= u_currGridCell.y)\n		discard;\n	if (gl_FragCoord.y < u_currGridCell.z || gl_FragCoord.y >= u_currGridCell.w)\n		discard;\n	vec3 normal = normalize(v_modelPosition) * u_freqScaler;\n#if FBM_GEN_TYPE == TYPE_BASIC_N_TERRAIN\n	gl_FragColor.rg = PackToRGB_888( fBmBasic( CalcPerlinNoises(normal + u_displace1, 2.0) ) );\n	gl_FragColor.ba = PackToRGB_888( fBmTerrain( CalcPerlinNoises(normal + u_displace2, 2.5), 2.5 ) );\n#elif FBM_GEN_TYPE == TYPE_CLOUDANIM\n	normal.y *= 1.25;\n	gl_FragColor.rg = PackToRGB_888( fBmBasic( CalcPerlinNoises(normal + u_displace1, 3.0) ) );\n	gl_FragColor.ba = PackToRGB_888( fBmBasic( CalcPerlinNoises(normal + u_displace2, 3.0) ) );\n#elif FBM_GEN_TYPE == TYPE_MILKYWAY\n	gl_FragColor.rg = PackToRGB_888( fBmMilkyWay( CalcPerlinNoises(normal + u_displace1, 2.0) ) );\n#else\n	#error FBM_GEN_TYPE is invalid\n#endif  // FBM_GEN_TYPE\n}\n';
    ShaderArchive.fbm_vs = 'varying vec3	v_modelPosition;\nvoid main(void) {\n	v_modelPosition = position;\n	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\n}\n';
    ShaderArchive.gaussianblur_fs = '#if defined(DIRECTION) && DIRECTION == 1\n	// vertical\n	#define SAMPLE_POS_ELEM(var)	(var.y)\n#else\n	// horizontal by default\n	#define SAMPLE_POS_ELEM(var)	(var.x)\n#endif\nuniform sampler2D	t_srcImg;\nuniform vec2	u_invSrcImgSize;  // src and dst should have the same size\nvec3 SampleSrcImg(vec2 samplePos) {\n	return texture2D(t_srcImg, samplePos).rgb;\n}\nvoid main(void) {\n	const float halfKernel = 7.0;\n	const float sigma = 0.6;\n	vec3 summedColor = vec3(0.0);\n	float summedWeight = 0.0;\n	vec2 samplePos = gl_FragCoord.xy;\n	SAMPLE_POS_ELEM(samplePos) -= halfKernel;\n	samplePos *= u_invSrcImgSize;\n	for (float i = -halfKernel; i <= halfKernel; ++i) {\n		if (SAMPLE_POS_ELEM(samplePos) >= 0.0 && SAMPLE_POS_ELEM(samplePos) <= 1.0) {\n			float weight = exp(-i*i / 2.0*sigma*sigma) / (2.0*3.1415926*sigma*sigma);\n			summedWeight += weight;\n			summedColor += weight * SampleSrcImg(samplePos);\n		}\n		SAMPLE_POS_ELEM(samplePos) += SAMPLE_POS_ELEM(u_invSrcImgSize);\n	}\n	if (summedWeight > 0.0)\n		gl_FragColor.rgb = summedColor / summedWeight;\n	gl_FragColor.a = 1.0;\n}\n';
    ShaderArchive.histogram_fs = 'void main(void) {\n	gl_FragColor = vec4(1.0);\n}\n';
    ShaderArchive.histogram_vs_part = '// required macros:\n//   - BUCKET_SIZE\n//   - OUTPUT_SIZE\nuniform sampler2D	t_color;\nuniform vec2	u_invImgSize;  // of source image\nvoid main(void) {\n	// to sample with a window of size defined in ImgProc.Histogram.sampleWindowSize\n	vec2 samplePos = position.xy * u_invImgSize + 0.5;\n	if (samplePos.x < 0.0 || samplePos.x > 1.0 || samplePos.y < 0.0 || samplePos.y > 1.0) {\n		gl_Position = vec4(10.0);\n		return;\n	}\n	else {\n	float luminance = CalcLuminance(texture2D(t_color, samplePos).rgb);\n	// TODO: replace hard-coded numbers like 128.0 with macros\n	// clamp to [-128, 128) and remap to [0, 256) with each bucket 2^(1/BUCKET_SIZE) wide\n	float bucketIdx = clamp(log2(luminance) * BUCKET_SIZE, -128.0, 127.0) + 128.0;\n	// 1) $outPos divided by 8, to range [0, 2);\n	// 2) then add an offset of half pixel\n	vec2 outPos = vec2(mod(bucketIdx, OUTPUT_SIZE), floor(bucketIdx / OUTPUT_SIZE)) * (2.0/OUTPUT_SIZE) + (0.5/OUTPUT_SIZE);\n	gl_Position = vec4(outPos - 1.0, 1.0, 1.0);\n	gl_PointSize = 1.0;\n	}\n}\n';
    ShaderArchive.milkyway_fs = 'uniform samplerCube	t_noise;\nuniform mat4	u_inverseProjView;\nuniform vec3	u_galacticCamPos;  // affected by the angle between galatic and ecliptic planes\nuniform float	u_distToGalacticCenter;\nuniform float	u_rhoZero;\nuniform float	u_densityGas;\nvarying vec3	v_modelPosition;\nfloat IntegrateStarDensity(vec3 dir) {\n	// REF: https://en.wikipedia.org/wiki/Thin_disk\n	// REF: https://en.wikipedia.org/wiki/Milky_Way\n	const float sampleLen = 1.0;  // unit: kpc\n	const int sampleNum = 30;  // sampleLen*sampleNum >= 30kpc ~estimated Milky Way diameter\n	vec3 centerPos = vec3(u_distToGalacticCenter, 0.0, 0.0);  // distance from galactic center to sun ~8kpc\n	float totalDensity = 0.0;\n	float currentStep = 0.0;\n	for (int i = 0; i < sampleNum; ++i) {\n		float distToSun = sampleLen * 0.5 + currentStep;\n		vec3 samplePos = dir * distToSun;\n		float distToCenVert = abs(samplePos.y - centerPos.y);\n		float distToCenHori = distance(samplePos.xz, centerPos.xz);\n		totalDensity += (\n			  exp(distToCenHori / -3.5 + distToCenVert / -0.4)  // Thin Disk: scale length ~3.5kpc, scale height ~0.4kpc\n			+ exp(length(samplePos - centerPos) / -0.6)  // Bulge: scale radius ~0.6kpc\n		);\n		currentStep += sampleLen;\n	}\n	return totalDensity;\n}\n// inter-stellar gas\nfloat FetchGasDensity(vec3 dir) {\n	vec4 fbm = textureCube(t_noise, dir);\n	return UnpackFromRGB_888(fbm.rg);\n}\nvec3 CompositeMilkyWay(float densityStars, float grain, float densityGas) {\n	const vec3 colorStar = vec3(1.0, 0.9, 0.7);\n	const vec3 colorGas = vec3(0.12, 0.06, 0.02);\n	const vec3 extinction = vec3(8e-1, 13.5e-1, 23e-1);  // non-physically based extinction coefficient\n	float densityGalaxy = densityStars * grain - 2.5e-2;  // substract a little bit (2.5e-2) to counter some overestimate\n	vec3 transmittance = exp(-extinction * densityGas * u_densityGas);  // Beer-Lambert law for transmittance due to gases\n	return colorStar * transmittance * densityGalaxy;\n}\nvoid main() {\n	vec4 reprojected = u_inverseProjView * vec4(v_modelPosition, 1.0);\n	reprojected /= reprojected.w;\n	vec3 dir = normalize(reprojected.xyz - u_galacticCamPos);\n	// add grains to provide a more plausible appearance\n	vec2 sphericalCoord = vec2(acos(dir.z), atan(dir.y/dir.x));\n	sphericalCoord = floor(sphericalCoord * 1e3) * 1e-3;  // drop digits smaller than 1e-3 to avoid flickering\n	float grain = GetGrain(sphericalCoord) * 0.5 + 1.0;  // remap to [1.0, 1.5]\n	gl_FragColor.rgb = CompositeMilkyWay(IntegrateStarDensity(dir), grain, FetchGasDensity(dir)) * u_rhoZero;\n}\n';
    ShaderArchive.normal_tl = 'uniform mat4	modelMatrix;\nvec3 CalcBumpNormal(vec3 modelNPos, float fbm, float scaler) {\n	vec3 dPos_dX = dFdx(modelNPos);\n	vec3 dPos_dY = dFdy(modelNPos);\n	mat3 tan2obj = mat3(normalize(dPos_dX), normalize(dPos_dY), modelNPos);\n	float tan_bumpNormal_x = -dFdx(fbm) / length(dPos_dX) * scaler;\n	float tan_bumpNormal_y = -dFdy(fbm) / length(dPos_dY) * scaler;\n	vec3 tan_bumpNormal = vec3(tan_bumpNormal_x, tan_bumpNormal_y, sqrt(1.0-tan_bumpNormal_x*tan_bumpNormal_x+tan_bumpNormal_y*tan_bumpNormal_y));\n	vec4 bumpNormal = modelMatrix * vec4(tan2obj * normalize(tan_bumpNormal), 0.0);\n	return normalize(bumpNormal.xyz);\n}\n';
    ShaderArchive.planet_fs_part = '// dependencies:\n//   - brdf_tl.glsl\n//   - cloud_tl.glsl\n//   - color_tl.glsl\n//   - normal_tl.glsl\n//   - scattering_tl.glsl\nuniform samplerCube	t_noise;\nuniform vec3	u_lightColor;\nuniform float	u_radius;\nuniform mat4	u_invModelMat;\nvarying vec3	v_modelPosition;	// model-space position\nvarying vec3	v_worldNormal;		// world-space normal (normalized)\nvoid main(void) {\n	// constants\n	vec3 modelNPos = normalize(v_modelPosition);  // normalized model-space position\n	vec3 worldNormal = normalize(v_worldNormal);\n	// prepare for surface\n	SurfaceParam surfParam;\n	{\n		vec4 packedFBM = textureCube(t_noise, modelNPos);\n		surfParam.surfacePos = modelNPos;\n		surfParam.dotSunLight = dot(worldNormal, -u_lightDir);\n		surfParam.fbm = UnpackFromRGB_888(packedFBM.ba);\n		surfParam.fbmAlt = UnpackFromRGB_888(packedFBM.rg);\n	}\n	SurfaceProperties surface = CalcSurfaceProperties(surfParam);\n	// TODO: sample in-scattering along zenith as ambient light\n/*\n	InScatteringParam inSctrParam;\n	inSctrParam.viewPos = v_worldPosition * (u_planetRadius / u_radius);\n	inSctrParam.viewDir = surface.normal;\n	inSctrParam.lightDir = u_lightDir;\n	vec3 inScattering = IntegrateInScattering(inSctrParam);\n*/\n	// shadows casted by clouds\n	vec3 cloudSampleWorldSpace = GetCloudSamplePosition(v_worldPosition / u_radius * u_planetRadius, u_lightDir, u_planetRadius);\n	vec3 cloudSampleModelSpace = (u_invModelMat * vec4(normalize(cloudSampleWorldSpace), 0.0)).xyz;\n	float cloudThickness = EvalCloudThickness(SampleCloud(cloudSampleModelSpace));\n	float cloudShadow = EvalCloudTransmittance(EvalCloudOpticalDepth(cloudThickness));\n	vec3 trmtFromSun = SampleTransmittance(surfParam.dotSunLight, surface.height * 1e4);\n	vec3 radiance = CalcLighting(surface, u_lightDir) * u_lightColor * trmtFromSun * cloudShadow;\n	gl_FragColor = vec4(radiance, 1.0);\n}\n';
    ShaderArchive.planet_vs = '// required macros:\n//   - MESH_TYPE:	type of the mesh\n#define TYPE_SURFACE	0\n#define TYPE_ATMOSPHERE	1\n#define TYPE_CLOUD		2\n#ifndef MESH_TYPE\n	#define MESH_TYPE	TYPE_SURFACE\n#endif\nuniform float	u_radius;\nuniform float	u_radiusAtmo;\nuniform float	u_radiusCloud;\nvarying vec3	v_modelPosition;	// model-space position\nvarying vec3	v_worldPosition;	// world-space position (normalized)\nvarying vec3	v_worldNormal;		// world-space normal (normalized)\nvoid main(void) {\n#if MESH_TYPE == TYPE_SURFACE\n	float radius = u_radius;\n#elif MESH_TYPE == TYPE_ATMOSPHERE\n	float radius = u_radiusAtmo;\n#elif MESH_TYPE == TYPE_CLOUD\n	float radius = u_radiusCloud;\n#else\n	#error MESH_TYPE isinvalid\n#endif  // MESH_TYPE\n	gl_Position = modelMatrix * vec4(position * radius, 1.0);\n	v_worldPosition = gl_Position.xyz / gl_Position.w;\n	v_modelPosition = position * radius;\n	v_worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;\n	gl_Position = projectionMatrix * viewMatrix * gl_Position;\n}\n';
    ShaderArchive.posteffect_fs_part = '#define ToneMapping	ReinhardToneMapping\n//#define ToneMapping	CalcToneMapUncharted2\nuniform sampler2D	t_color;\nuniform vec2	u_random;\nuniform vec2	u_invImgSize;\nuniform float	u_exposure;\nvoid main(void) {\n	vec2 samplePos = gl_FragCoord.xy * u_invImgSize;\n	vec3 hdrColor = max(texture2D(t_color, samplePos).rgb, 0.0) * u_exposure;\n	vec3 ldrLinearColor = ToneMapping(hdrColor);\n	gl_FragColor.rgb = ConvertLinearToSRGB(ldrLinearColor);\n	gl_FragColor.rgb += (GetGrain(gl_FragCoord.xy + u_random) - 0.5) / 256.0;  // anti-banding\n	gl_FragColor.a = 1.0;\n}\n';
    ShaderArchive.posteffect_vs = 'void main(void) {\n	gl_Position = vec4(position, 1.0);\n}\n';
    ShaderArchive.scattering_tl = '// optional macros:\n//   - LOOK_UP_SAMPLE_TRSM:		while integrating in-scattering, commit a texture\n//								lookup for sample\'s transmittance to eye; otherwise\n//								an interpolation is used as approximation\nuniform sampler2D 	t_opticalDepth;\nuniform vec3	u_optDepTexCoeff;  // let N = size(t_transmittance), u_trsmTexCoeff = vec3((N-1)/N/maxAngle, (N-1)/N/atmoThickness, 0.5/N)\nuniform float	u_planetRadius;\nuniform float	u_atmoThickness;\nstruct IntersectParam {\n	vec3 viewPos;\n	vec3 viewDir;\n	float radius;\n};\nstruct InScatteringParam {\n	vec3 viewPos;\n	vec3 viewDir;  // from viewPos\n	vec3 lightDir;\n};\nstruct IntersectResult {\n	float distToNearInter;  // distance to the nearer intersection\n	float distToFarInter;  // distance to the farther intersection\n};\nstruct PlanetIntersectResult {\n	bool hitsGround;\n	IntersectResult t;\n};\n// remap to transmittance table x-coordinate\nfloat RemapToTrsmTblX(float cosChi) {\n	return acos(clamp(cosChi, -1.0, 1.0)) * u_optDepTexCoeff.x;  // * (N-1) / N / maxAngle\n}\n// remap to transmittance table y-coordinate\nfloat RemapToTrsmTblY(float heightInMeter) {\n	return heightInMeter * u_optDepTexCoeff.y;  // * (N-1) / N / atmoThickness\n}\nvec3 SampleTransmittance(float cosChi, float height) {\n	vec3 opticalDepth = texture2D(\n		t_opticalDepth,\n		vec2(RemapToTrsmTblX(cosChi), RemapToTrsmTblY(height)) + u_optDepTexCoeff.z  // offset towards the texel center\n	).rgb;\n	return exp(opticalDepth);  // assuming all texels are 0 or negative\n}\n// sphere is assume to be at the origin\nIntersectResult IntersectSphere(IntersectParam param) {\n	IntersectResult result;\n	float distToNearest = dot(-param.viewPos, param.viewDir);  // view ray\'s nearest point to origin\n	// temp variables\n	float distMin = length(param.viewPos + distToNearest * param.viewDir);  // distance to center from the nearest point\n	float distHalfIntersection = sqrt(max(param.radius * param.radius - distMin * distMin, 0.0));\n	result.distToNearInter = distToNearest - distHalfIntersection;\n	result.distToFarInter = distToNearest + distHalfIntersection;\n	return result;\n}\n// cylinder is assumed to aligned with z-axis\nIntersectResult IntersectShadowCylinder(IntersectParam param) {\n	IntersectParam newParam;\n	newParam.viewDir = vec3(normalize(param.viewDir.xy), 0.0);\n	newParam.viewPos = vec3(param.viewPos.xy, 0.0);\n	newParam.radius = u_planetRadius;\n	IntersectResult result = IntersectSphere(newParam);\n	float scaler = length(param.viewDir) / length(param.viewDir.xy);\n	result.distToNearInter *= scaler;\n	result.distToFarInter *= scaler;\n	return result;\n}\n// similar to IntersectSphere() but with consideration of atmosphere\n// TODO: to support intersection from view positions within atmosphere\nPlanetIntersectResult IntersectPlanet(InScatteringParam param) {\n	PlanetIntersectResult result;\n	float distToNearest = -dot(param.viewPos, param.viewDir);  // view ray\'s nearest point to origin, namely the lowest point\n	// temp variables\n	float distLowest = length(param.viewPos + distToNearest * param.viewDir);  // distance to planet center from the lowest point\n	float distLowestSq = distLowest * distLowest;\n	float radiusAtm = u_planetRadius + u_atmoThickness;\n	float distLowestToGroundSq = u_planetRadius * u_planetRadius - distLowestSq;\n	float distLowestToAtmSq = radiusAtm * radiusAtm - distLowestSq;\n	result.hitsGround = (distLowestToGroundSq >= 0.0);\n	result.t.distToFarInter = (result.hitsGround ? distToNearest - sqrt(distLowestToGroundSq) : distToNearest + sqrt(distLowestToAtmSq));\n	result.t.distToNearInter = max(distToNearest - sqrt(distLowestToAtmSq), 0.0);\n	return result;\n}\nbool IsShadowed(vec3 pos, vec3 lightDir, float radius) {\n	float dotLV = dot(pos, -lightDir);\n	vec3 closestPt = lightDir * dotLV + pos;\n	return !(dotLV >= 0.0 || length(closestPt) > radius - 10.0);\n}\n// should only be used when view ray hits ground in the shadowed hemisphere.\nvoid RefineWithShadowCylinder(InScatteringParam param, inout PlanetIntersectResult result) {\n	// TODO: rotate everything if the light direction is not exactly towards the negative z-axis\n	IntersectParam itrsctParam;\n	itrsctParam.viewPos = param.viewPos;\n	itrsctParam.viewDir = param.viewDir;\n	itrsctParam.radius = u_planetRadius;\n	IntersectResult itrsctCylinder = IntersectShadowCylinder(itrsctParam);\n	if (length(param.viewPos.xy) > u_planetRadius)\n		result.t.distToFarInter = max(itrsctCylinder.distToNearInter, result.t.distToNearInter);\n	else\n		result.t.distToNearInter = min(itrsctCylinder.distToFarInter, result.t.distToFarInter);\n}\nvec3 GetPlanetaryTransmittance(InScatteringParam param) {\n	PlanetIntersectResult intsct = IntersectPlanet(param);\n	vec3 posSample = param.viewDir * intsct.t.distToFarInter + param.viewPos;\n	float distSampleToOrigin = length(posSample);\n	return SampleTransmittance(-dot(param.viewDir, posSample / distSampleToOrigin), distSampleToOrigin - u_planetRadius);\n}\n// TODO: to support integration outwards from position within atmosphere\nvec3 IntegrateInScattering(InScatteringParam param, PlanetIntersectResult intsct) {\n	vec3 result = vec3(0.0);\n	// start/end position may need some refinement\n	if (IsShadowed(param.viewDir * intsct.t.distToFarInter + param.viewPos, param.lightDir, u_planetRadius))\n		RefineWithShadowCylinder(param, intsct);\n	// ray-marching setup\n	const int NUM_SAMPLE_MAX = 20;\n	const int NUM_SAMPLE_MIN = 8;\n	float segmentCount = (intsct.hitsGround ? float(NUM_SAMPLE_MIN) : float(NUM_SAMPLE_MAX));\n	float segmentLength = (intsct.t.distToFarInter - intsct.t.distToNearInter) / segmentCount;  // should always be positive\n	// initialize with the far endpoint of the 1st segment\n	vec3 posFarEndPoint = param.viewDir * intsct.t.distToFarInter + param.viewPos;  // the far endpoint of each segment\n	float distFarEndPointToOrigin = length(posFarEndPoint);  // not actually needed in the iteration\n	vec3 trsmFarEndPoint = SampleTransmittance(\n		-dot(param.viewDir, posFarEndPoint / distFarEndPointToOrigin),\n		distFarEndPointToOrigin - u_planetRadius\n	);\n	// integral with ray-marching\n	for (int i = 0; i < NUM_SAMPLE_MAX; ++i) {\n		if (float(i) >= segmentCount)\n			break;\n		vec3 posSample = segmentLength * -0.5 * param.viewDir + posFarEndPoint;  // sample at the center of the segment\n		vec3 trsmSunToSample = vec3(0.0);\n		vec3 trsmSampleToEye = vec3(0.0);\n		// light that scatters in\n		{\n			float distSampleToOrigin = length(posSample);\n			vec3 posSampleNorm = posSample / distSampleToOrigin;  // counting on compiler to reuse registers\n			float sampleHeight = distSampleToOrigin - u_planetRadius;\n			trsmSunToSample = SampleTransmittance(-dot(param.lightDir, posSampleNorm), sampleHeight);\n#if defined(LOOK_UP_SAMPLE_TRSM)\n			trsmSampleToEye = SampleTransmittance(-dot(param.viewDir, posSampleNorm), sampleHeight);\n#endif  // LOOK_UP_SAMPLE_TRSM\n		}\n		// update shared variables\n		{\n			posFarEndPoint -= param.viewDir * segmentLength;\n			float distFarEndPointToOrigin = length(posFarEndPoint);  // counting on compiler to reuse registers\n			vec3 trsmNearEndPoint = SampleTransmittance(\n				-dot(param.viewDir, posFarEndPoint / distFarEndPointToOrigin),\n				distFarEndPointToOrigin - u_planetRadius\n			);\n			// 1. adding 1e-10 to avoid 0 being divided by 0\n			// 2. because transmittance texture is somehow too coarse if intsct.hitsGround = false,\n			//    to avoid artifacts must we handle situations of trsmFarEndPoint > trsmNearEndPoint\n			vec3 trsmDelta = min(trsmFarEndPoint / (trsmNearEndPoint + 1e-10), 1.0);\n	#if !defined(LOOK_UP_SAMPLE_TRSM)\n			trsmSampleToEye = sqrt(trsmFarEndPoint * trsmNearEndPoint);  // approximate the transmittance from posSample to eye\n	#endif  // !LOOK_UP_SAMPLE_TRSM\n			trsmFarEndPoint = trsmNearEndPoint;\n			result += trsmSunToSample * trsmSampleToEye * -log(trsmDelta);  // -log(trsmDelta) = beta*∫dt = optical depth\n		}\n	}\n	float phaseCosTheta = dot(-param.viewDir, param.lightDir);\n	float phase = (3.0 / 16.0 / 3.1415926) * (1.0 + phaseCosTheta*phaseCosTheta);\n	return result * phase;\n}\n';
    ShaderArchive.simplecolor_fs = 'uniform vec4	u_color;\nvoid main(void) {\n	gl_FragColor = u_color;\n}\n';
    ShaderArchive.star_vs = 'varying vec3	v_color;\nvarying vec3	v_worldPosition;	// world-space position (normalized)\nvoid main(void) {\n#ifdef USE_COLOR\n	v_color = color;\n#endif  // USE_COLOR\n	vec4 worldPos = modelMatrix * vec4(position, 1.0);\n	v_worldPosition = worldPos.xyz / worldPos.w;\n	vec4 transformed = projectionMatrix * viewMatrix * worldPos;\n	transformed.z = transformed.w;  // always inside the frustrum\n	gl_Position = transformed;\n	gl_PointSize = 1.0;\n}\n';
    ShaderArchive.sun_fs = '// required macros:\n//   - ON_MOBILE\nuniform vec3	u_color;\nuniform float	u_surfaceAngle;  // defines the visual size of the Sun\nuniform vec3	u_viewPos;\nuniform vec3	u_centerPos;  // center of the Sun\nvarying vec3	v_worldPosition;\nfloat EvalCoronaIntensity(float tangent) {\n#if ON_MOBILE\n		// color buffer on mobiles is in half-float format and thus unable to store detailed attenuation\n		const float ATTENUATION_POWER = -8.0;\n#else\n		const float ATTENUATION_POWER = -5.0;\n#endif  // ON_MOBILE\n		float outness = tangent / u_surfaceAngle + 0.4;  // add 0.4 to offset a little, \"pulling\" the corona inwards, to make it dimmer\n		return clamp(pow(outness, ATTENUATION_POWER), 0.0, 1.0);  // use hyperbola as attenuation function\n}\nvoid main(void) {\n	vec3 viewDir = normalize(v_worldPosition - u_viewPos);\n	vec3 centerDir = normalize(u_centerPos - u_viewPos);\n	float cosine = dot(viewDir, centerDir);\n	float tangent = sqrt(1.0 - cosine*cosine) / cosine;\n	if (tangent <= u_surfaceAngle)\n		gl_FragColor.a = 1.0;  // Sun surface\n	else\n		gl_FragColor.a = EvalCoronaIntensity(tangent);  // corona\n	gl_FragColor.rgb = u_color;\n}\n';
    ShaderArchive.uintconvert_fs_part = 'uniform sampler2D	t_srcImg;\nuniform vec2	u_invSrcImgSize;\nvoid main(void) {\n	vec2 samplePos = gl_FragCoord.xy * u_invSrcImgSize;\n	float val = texture2D(t_srcImg, samplePos).r;  // only red channel\n	gl_FragColor.rgb = PackIntegralPartToRGB_888(val);\n	gl_FragColor.a = 1.0;\n}\n';
    ShaderArchive.vertexcolor_fs = 'varying vec3	v_color;\nvoid main(void) {\n	gl_FragColor.rgb = v_color;\n	gl_FragColor.a = 1.0;\n}\n';
    return ShaderArchive;
}());
var Rendering;
(function (Rendering) {
    var DrawContext = (function () {
        function DrawContext() {
        }
        return DrawContext;
    }());
    Rendering.DrawContext = DrawContext;
})(Rendering || (Rendering = {}));
var Rendering;
(function (Rendering) {
    var UniformFulfillment = (function () {
        function UniformFulfillment(name, setter) {
            this.name = name;
            this.setter = setter;
        }
        return UniformFulfillment;
    }());
    Rendering.UniformFulfillment = UniformFulfillment;
    var UniformRequirement = (function () {
        function UniformRequirement(name, uniform) {
            this.name = name;
            this.uniform = uniform;
        }
        return UniformRequirement;
    }());
    var UniformBindingItem = (function () {
        function UniformBindingItem(name, setter, uniform) {
            this.name = name;
            this.setter = setter;
            this.uniform = uniform;
        }
        UniformBindingItem.prototype.Update = function (context) {
            this.setter(this.uniform, context);
        };
        return UniformBindingItem;
    }());
    var UniformBinding = (function () {
        function UniformBinding(requirements, fulfillments) {
            this.isValid = false;
            this.bindings = [];
            this.missing = [];
            this.Bind(requirements, fulfillments);
        }
        UniformBinding.prototype.GetMissing = function () {
            return this.missing;
        };
        UniformBinding.prototype.IsValid = function () {
            return this.isValid;
        };
        UniformBinding.prototype.Update = function (context) {
            this.bindings.forEach(function (item) { return item.Update(context); });
        };
        UniformBinding.prototype.Bind = function (requirements, fulfillments) {
            var _this = this;
            var bindings = requirements
                .map(function (itemReq) {
                var matched = fulfillments.find(function (itemFul) { return itemFul.name == itemReq.name; });
                if (typeof matched !== 'undefined')
                    return new UniformBindingItem(itemReq.name, matched.setter, itemReq.uniform);
                else
                    _this.missing.push(itemReq.name);
                return matched;
            })
                .filter(function (item) { return typeof item !== 'undefined'; });
            if (bindings.length === requirements.length) {
                this.bindings = bindings;
                this.isValid = true;
            }
        };
        return UniformBinding;
    }());
    Rendering.UniformBinding = UniformBinding;
    function BuildRequirements(material) {
        var uniforms = material.uniforms;
        return Object.keys(uniforms).map(function (name) { return new UniformRequirement(name, uniforms[name]); });
    }
    function BuildUniformSkeleton(names) {
        var uniforms = {};
        names.forEach(function (name) { return uniforms[name] = { value: 0 }; });
        return uniforms;
    }
    Rendering.BuildUniformSkeleton = BuildUniformSkeleton;
    function ExtractUniformNames(code) {
        var regexp = /uniform[\s]+[\w]+[\s]+([\w]+)[\s]*;/g;
        var names = [];
        for (var regexpResult = regexp.exec(code); regexpResult !== null; regexpResult = regexp.exec(code))
            names.push(regexpResult[1]);
        var threeBuiltIns = [
            'modelMatrix',
            'modelViewMatrix',
            'projectionMatrix',
            'viewMatrix',
            'normalMatrix',
            'cameraPosition'
        ];
        return names.filter(function (name) { return threeBuiltIns.indexOf(name) === -1; });
    }
    Rendering.ExtractUniformNames = ExtractUniformNames;
    function CreateBindingOrThrow(clsName, material, fulfillments) {
        var requirements = BuildRequirements(material);
        var binding = new UniformBinding(requirements, fulfillments);
        if (!binding.IsValid())
            throw new Error('Renderable=' + clsName + ', Shader=' + material.name + ' lacks fulfillments: ' + binding.GetMissing().join(', '));
        return binding;
    }
    Rendering.CreateBindingOrThrow = CreateBindingOrThrow;
})(Rendering || (Rendering = {}));
var Resource;
(function (Resource) {
    var GeometryRepo = (function () {
        function GeometryRepo() {
            this.sphere = this.CreateSphere(100);
            this.sphereCoarse = this.CreateSphere(10);
            this.cube = this.CreateCube();
            this.screenPlane = this.CreateScreenPlane();
        }
        GeometryRepo.prototype.GetSphere = function () {
            return this.sphere;
        };
        GeometryRepo.prototype.GetSphereCoarse = function () {
            return this.sphereCoarse;
        };
        GeometryRepo.prototype.GetCube = function () {
            return this.cube;
        };
        GeometryRepo.prototype.GetScreenPlane = function () {
            return this.screenPlane;
        };
        GeometryRepo.prototype.CreateSphere = function (numSegments) {
            var sphere = new THREE.SphereGeometry(1, numSegments, numSegments);
            return sphere;
        };
        GeometryRepo.prototype.CreateCube = function () {
            var cube = new THREE.BoxGeometry(1, 1, 1);
            return cube;
        };
        GeometryRepo.prototype.CreateScreenPlane = function () {
            var plane = new THREE.PlaneGeometry(2, 2);
            return plane;
        };
        return GeometryRepo;
    }());
    Resource.GeometryRepo = GeometryRepo;
})(Resource || (Resource = {}));
var Rendering;
(function (Rendering) {
    var Renderable = (function () {
        function Renderable(name) {
            this.name = name;
        }
        Renderable.prototype.GetRenderItems = function (geoRepo) {
            if (typeof this.objects === 'undefined' || typeof this.uniBindings === 'undefined')
                this.Init(geoRepo);
            return this.objects;
        };
        Renderable.prototype.UpdateUniforms = function (drawCtx) {
            this.OnUpdatingUniform();
            this.uniBindings.forEach(function (binding) { return binding.Update(drawCtx); });
        };
        Renderable.prototype.Init = function (geoRepo) {
            var _this = this;
            this.objects = this.CreateRenderItems(geoRepo);
            var fulfillments = this.GetUniformFulfillments();
            this.uniBindings = [];
            this.objects.forEach(function (obj) { return _this.uniBindings.push(Rendering.CreateBindingOrThrow(_this.name, obj.material, fulfillments)); });
        };
        return Renderable;
    }());
    Rendering.Renderable = Renderable;
})(Rendering || (Rendering = {}));
var Util;
(function (Util) {
    Util.unitLength = 250e3;
    function ConvertToRadians(degree) {
        return degree / 180 * Math.PI;
    }
    Util.ConvertToRadians = ConvertToRadians;
    function ConvertToDegrees(radian) {
        return radian / Math.PI * 180;
    }
    Util.ConvertToDegrees = ConvertToDegrees;
    function ConvertToMeters(unit) {
        return unit * Util.unitLength;
    }
    Util.ConvertToMeters = ConvertToMeters;
    function ConvertToUnits(meter) {
        return meter / Util.unitLength;
    }
    Util.ConvertToUnits = ConvertToUnits;
})(Util || (Util = {}));
var Astro;
(function (Astro) {
    var PlanetMeshType;
    (function (PlanetMeshType) {
        PlanetMeshType[PlanetMeshType["Surface"] = 0] = "Surface";
        PlanetMeshType[PlanetMeshType["Atmosphere"] = 1] = "Atmosphere";
        PlanetMeshType[PlanetMeshType["Cloud"] = 2] = "Cloud";
    })(PlanetMeshType = Astro.PlanetMeshType || (Astro.PlanetMeshType = {}));
    var AtmosphereMeshBase = (function (_super) {
        __extends(AtmosphereMeshBase, _super);
        function AtmosphereMeshBase(type, geometry, fragShader) {
            var _this = _super.call(this) || this;
            _this.SetupMesh(type, geometry, fragShader);
            _this.SetupShader(_this.material);
            _this.frustumCulled = false;
            return _this;
        }
        AtmosphereMeshBase.prototype.SetupMesh = function (type, geometry, fragShader) {
            this.geometry = geometry;
            var uniformNames = Rendering.ExtractUniformNames(AtmosphereMeshBase.shaderVert + fragShader);
            var material = new THREE.ShaderMaterial({
                name: 'AtmosphereMesh',
                defines: { 'MESH_TYPE': type },
                transparent: true,
                uniforms: Rendering.BuildUniformSkeleton(uniformNames),
                vertexShader: AtmosphereMeshBase.shaderVert,
                fragmentShader: fragShader
            });
            this.material = material;
        };
        AtmosphereMeshBase.shaderVert = ShaderArchive.planet_vs;
        return AtmosphereMeshBase;
    }(THREE.Mesh));
    var TransmittanceMesh = (function (_super) {
        __extends(TransmittanceMesh, _super);
        function TransmittanceMesh(geometry) {
            return _super.call(this, PlanetMeshType.Atmosphere, geometry, TransmittanceMesh.shaderFrag) || this;
        }
        TransmittanceMesh.prototype.SetupShader = function (shaderMat) {
            shaderMat.blending = THREE.MultiplyBlending;
            shaderMat.depthTest = false;
        };
        TransmittanceMesh.shaderFrag = ShaderArchive.color_tl
            + ShaderArchive.scattering_tl
            + ShaderArchive.atmotransmittance_fs_part;
        return TransmittanceMesh;
    }(AtmosphereMeshBase));
    Astro.TransmittanceMesh = TransmittanceMesh;
    var ScatteringMesh = (function (_super) {
        __extends(ScatteringMesh, _super);
        function ScatteringMesh(geometry) {
            return _super.call(this, PlanetMeshType.Atmosphere, geometry, ScatteringMesh.shaderFrag) || this;
        }
        ScatteringMesh.prototype.SetupShader = function (shaderMat) {
            shaderMat.blending = THREE.AdditiveBlending;
            shaderMat.depthTest = false;
        };
        ScatteringMesh.shaderFrag = ShaderArchive.color_tl
            + ShaderArchive.scattering_tl
            + ShaderArchive.cloud_tl
            + ShaderArchive.atmoscattering_fs_part;
        return ScatteringMesh;
    }(AtmosphereMeshBase));
    Astro.ScatteringMesh = ScatteringMesh;
    var CloudMesh = (function (_super) {
        __extends(CloudMesh, _super);
        function CloudMesh(geometry) {
            return _super.call(this, PlanetMeshType.Cloud, geometry, CloudMesh.shaderFrag) || this;
        }
        CloudMesh.prototype.SetupShader = function (shaderMat) {
            shaderMat.extensions.derivatives = true;
            shaderMat.depthTest = false;
        };
        CloudMesh.shaderFrag = ShaderArchive.brdf_tl
            + ShaderArchive.color_tl
            + ShaderArchive.normal_tl
            + ShaderArchive.scattering_tl
            + ShaderArchive.cloud_tl
            + ShaderArchive.cloud_fs_part;
        return CloudMesh;
    }(AtmosphereMeshBase));
    Astro.CloudMesh = CloudMesh;
})(Astro || (Astro = {}));
var AirMassData = (function () {
    function AirMassData() {
    }
    AirMassData.texSize = 256;
    AirMassData.texData = new Float32Array(__airMassData);
    return AirMassData;
}());
var Astro;
(function (Astro) {
    var AtmosphericParam = (function () {
        function AtmosphericParam() {
            this.thickness = 100000;
            this.planetRadius = 6371000;
            this.maxAngle = 1.74682773867577;
            this.betaRayleigh = new THREE.Vector3(0.0000058, 0.0000135, 0.0000331);
        }
        return AtmosphericParam;
    }());
    Astro.AtmosphericParam = AtmosphericParam;
})(Astro || (Astro = {}));
var Astro;
(function (Astro) {
    var OpticalDepthTexture = (function (_super) {
        __extends(OpticalDepthTexture, _super);
        function OpticalDepthTexture(param) {
            var _this = this;
            var rawData = OpticalDepthTexture.EvalOpticalDepth(AirMassData.texData, param.betaRayleigh);
            _this = _super.call(this, rawData, OpticalDepthTexture.texSize, OpticalDepthTexture.texSize, THREE.RGBFormat, THREE.FloatType) || this;
            _this.wrapS = THREE.ClampToEdgeWrapping;
            _this.wrapT = THREE.ClampToEdgeWrapping;
            _this.magFilter = THREE.LinearFilter;
            _this.minFilter = THREE.LinearFilter;
            _this.generateMipmaps = false;
            _this.needsUpdate = true;
            return _this;
        }
        OpticalDepthTexture.EvalOpticalDepth = function (airmass, betaRayleigh) {
            var result = new Float32Array(airmass.length);
            var opticalDepth = new THREE.Vector3();
            var numTexel = OpticalDepthTexture.texSize * OpticalDepthTexture.texSize;
            for (var i = 0; i < numTexel; ++i) {
                opticalDepth.copy(betaRayleigh);
                opticalDepth.multiplyScalar(-airmass[i * 3]);
                result[i * 3] = opticalDepth.x;
                result[i * 3 + 1] = opticalDepth.y;
                result[i * 3 + 2] = opticalDepth.z;
            }
            return result;
        };
        OpticalDepthTexture.texSize = AirMassData.texSize;
        return OpticalDepthTexture;
    }(THREE.DataTexture));
    Astro.OpticalDepthTexture = OpticalDepthTexture;
})(Astro || (Astro = {}));
var Util;
(function (Util) {
    function IsOnMobile() {
        var mobileDetect = new MobileDetect(window.navigator.userAgent);
        return mobileDetect.mobile() !== null || mobileDetect.tablet() !== null;
    }
    Util.IsOnMobile = IsOnMobile;
    function GetPlatformFloatType() {
        return IsOnMobile() ? THREE.HalfFloatType : THREE.FloatType;
    }
    Util.GetPlatformFloatType = GetPlatformFloatType;
    function IsPageOnServer() {
        return window.location.origin.indexOf('http') === 0;
    }
    Util.IsPageOnServer = IsPageOnServer;
})(Util || (Util = {}));
var Astro;
(function (Astro) {
    var SunParam = (function () {
        function SunParam() {
            this.position = new THREE.Vector3(0, 0, Util.ConvertToUnits(149.6e9));
            this.temperature = new Astro.ColorTemperature(6000);
        }
        SunParam.prototype.Copy = function (other) {
            this.position.copy(other.position);
            this.temperature.SetTemperature(other.temperature.GetTemperature());
        };
        return SunParam;
    }());
    Astro.SunParam = SunParam;
    ;
    var Sun = (function (_super) {
        __extends(Sun, _super);
        function Sun(param) {
            var _this = _super.call(this, 'Sun') || this;
            _this.param = param;
            return _this;
        }
        Sun.prototype.CreateRenderItems = function (geoRepo) {
            var params = {
                defines: { 'ON_MOBILE': Util.IsOnMobile() ? 1 : 0 },
                transparent: true,
                vertexShader: Sun.shaderVert,
                fragmentShader: Sun.shaderFrag
            };
            var mesh = MeshHelper.CreateShaderMesh('Sun', geoRepo.GetSphereCoarse(), params);
            var scale = this.param.position.length() * Sun.radiusToDistRatio * 15;
            mesh.scale.multiplyScalar(scale);
            return [mesh];
        };
        Sun.prototype.GetUniformFulfillments = function () {
            var _this = this;
            return [
                new Rendering.UniformFulfillment('u_color', function (uni) { return uni.value = _this.param.temperature.GetPremultipliedColor(); }),
                new Rendering.UniformFulfillment('u_surfaceAngle', function (uni) { return uni.value = Sun.radiusToDistRatio; }),
                new Rendering.UniformFulfillment('u_viewPos', function (uni, ctx) { return uni.value = ctx.camera.getWorldPosition(); }),
                new Rendering.UniformFulfillment('u_centerPos', function (uni) { return uni.value = _this.objects[0].position; }),
            ];
        };
        Sun.prototype.OnUpdatingUniform = function () {
            this.objects[0].position.copy(this.param.position);
        };
        Sun.radiusToDistRatio = 4.65e-3;
        Sun.shaderVert = ShaderArchive.star_vs;
        Sun.shaderFrag = ShaderArchive.sun_fs;
        return Sun;
    }(Rendering.Renderable));
    Astro.Sun = Sun;
})(Astro || (Astro = {}));
var Astro;
(function (Astro) {
    var Auxiliaries = (function (_super) {
        __extends(Auxiliaries, _super);
        function Auxiliaries() {
            var _this = _super.call(this) || this;
            _this.add(Auxiliaries.CreateRotationAxis());
            return _this;
        }
        Auxiliaries.CreateRotationAxis = function () {
            var geo = new THREE.BufferGeometry();
            var vertices = new Float32Array([
                0, 1.2, 0,
                0, -1.2, 0
            ]);
            geo.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x60FFFF, linewidth: 1 }));
        };
        return Auxiliaries;
    }(THREE.Scene));
    var EarthParam = (function () {
        function EarthParam() {
            this.heightOcean = 0.2;
            this.colorLand = new THREE.Vector3(0.036, 0.064, 0.034).multiplyScalar(2.239);
            this.colorMountain = new THREE.Vector3(0.136, 0.117, 0.072).multiplyScalar(1.569);
            this.colorOcean = new THREE.Vector3(0.003, 0.023, 0.068).multiplyScalar(1.915);
            this.cloudAmount = 0;
            this.cloudHeight = 2.4e3;
            this.radius = Util.ConvertToUnits(6371e3);
            this.axialTilt = Util.ConvertToRadians(23.5);
            this.selfRotSpeed = 0.001;
        }
        EarthParam.prototype.Clone = function () {
            var result = new EarthParam();
            result.heightOcean = this.heightOcean;
            result.colorLand = this.colorLand;
            result.colorMountain = this.colorMountain;
            result.colorOcean = this.colorOcean;
            result.cloudAmount = this.cloudAmount;
            result.cloudHeight = this.cloudHeight;
            result.radius = this.radius;
            result.axialTilt = this.axialTilt;
            result.selfRotSpeed = this.selfRotSpeed;
            return result;
        };
        EarthParam.prototype.Copy = function (other) {
            this.heightOcean = other.heightOcean;
            this.colorLand.copy(other.colorLand);
            this.colorMountain.copy(other.colorMountain);
            this.colorOcean.copy(other.colorOcean);
            this.cloudAmount = other.cloudAmount;
            this.cloudHeight = other.cloudHeight;
            this.radius = other.radius;
            this.axialTilt = other.axialTilt;
            this.selfRotSpeed = other.selfRotSpeed;
        };
        return EarthParam;
    }());
    Astro.EarthParam = EarthParam;
    var Earth = (function (_super) {
        __extends(Earth, _super);
        function Earth(param, paramSun, textures) {
            var _this = _super.call(this, 'Earth') || this;
            _this.param = param;
            _this.paramAtmo = new Astro.AtmosphericParam();
            _this.paramSun = paramSun;
            _this.SetupTextures(textures);
            return _this;
        }
        Earth.prototype.SetupTextures = function (textures) {
            this.textures = {
                fbm: textures.fbm,
                cloud: textures.cloud,
                opticalDepth: textures.opticalDepth
            };
            if (typeof this.textures.opticalDepth === 'undefined')
                this.textures.opticalDepth = new Astro.OpticalDepthTexture(this.paramAtmo);
        };
        Earth.prototype.CreateRenderItems = function (geoRepo) {
            var sphere = geoRepo.GetSphere();
            var surface = MeshHelper.CreateShaderMesh('Earth', sphere, { vertexShader: Earth.shaderVert, fragmentShader: Earth.shaderFrag });
            surface.frustumCulled = false;
            return [
                surface,
                new Astro.CloudMesh(sphere),
                new Astro.TransmittanceMesh(sphere),
                new Astro.ScatteringMesh(sphere)
            ];
        };
        Earth.prototype.GetUniformFulfillments = function () {
            var _this = this;
            var param = this.param;
            var paramAtmo = this.paramAtmo;
            var paramSun = this.paramSun;
            var textures = this.textures;
            var optDepTexCoeffBase = new THREE.Vector2(Astro.OpticalDepthTexture.texSize - 1, 0.5).divideScalar(Astro.OpticalDepthTexture.texSize);
            var radiusSurface = paramAtmo.planetRadius;
            var radiusAtmo = radiusSurface + paramAtmo.thickness;
            var radiusCloud = radiusSurface + param.cloudHeight;
            return [
                new Rendering.UniformFulfillment('u_viewPos', function (uni, ctx) { return uni.value = ctx.camera.getWorldPosition(); }),
                new Rendering.UniformFulfillment('u_invModelMat', function (uni) { return uni.value = new THREE.Matrix4().getInverse(_this.objects[0].matrixWorld); }),
                new Rendering.UniformFulfillment('u_lightColor', function (uni) { return uni.value = paramSun.temperature.GetPremultipliedColor(); }),
                new Rendering.UniformFulfillment('u_lightDir', function (uni) { return uni.value = paramSun.position.clone().normalize().negate(); }),
                new Rendering.UniformFulfillment('t_noise', function (uni) { return uni.value = textures.fbm; }),
                new Rendering.UniformFulfillment('t_animNoise', function (uni) { return uni.value = textures.cloud.GetFrontTexture(); }),
                new Rendering.UniformFulfillment('u_texBlendTime', function (uni) { return uni.value = textures.cloud.GetBlendingFactor(); }),
                new Rendering.UniformFulfillment('t_opticalDepth', function (uni) { return uni.value = textures.opticalDepth; }),
                new Rendering.UniformFulfillment('u_optDepTexCoeff', function (uni) { return uni.value = new THREE.Vector3(optDepTexCoeffBase.x / _this.paramAtmo.maxAngle, optDepTexCoeffBase.x / _this.paramAtmo.thickness, optDepTexCoeffBase.y); }),
                new Rendering.UniformFulfillment('u_radius', function (uni) { return uni.value = param.radius; }),
                new Rendering.UniformFulfillment('u_radiusAtmo', function (uni) { return uni.value = param.radius / radiusSurface * radiusAtmo; }),
                new Rendering.UniformFulfillment('u_radiusCloud', function (uni) { return uni.value = param.radius / radiusSurface * radiusCloud; }),
                new Rendering.UniformFulfillment('u_heightOcean', function (uni) { return uni.value = param.heightOcean; }),
                new Rendering.UniformFulfillment('u_cloudAmount', function (uni) { return uni.value = param.cloudAmount; }),
                new Rendering.UniformFulfillment('u_colorLand', function (uni) { return uni.value = param.colorLand; }),
                new Rendering.UniformFulfillment('u_colorMountain', function (uni) { return uni.value = param.colorMountain; }),
                new Rendering.UniformFulfillment('u_colorOcean', function (uni) { return uni.value = param.colorOcean; }),
                new Rendering.UniformFulfillment('u_planetRadius', function (uni) { return uni.value = paramAtmo.planetRadius; }),
                new Rendering.UniformFulfillment('u_cloudHeight', function (uni) { return uni.value = param.cloudHeight; }),
                new Rendering.UniformFulfillment('u_atmoThickness', function (uni) { return uni.value = paramAtmo.thickness; }),
            ];
        };
        Earth.prototype.OnUpdatingUniform = function () {
            var _a = this.objects, meshSurface = _a[0], others = _a.slice(1);
            meshSurface.rotation.x = this.param.axialTilt;
            meshSurface.rotation.y += this.param.selfRotSpeed;
            meshSurface.updateMatrixWorld(true);
            others.forEach(function (obj) { return obj.rotation.copy(meshSurface.rotation); });
        };
        Earth.shaderVert = ShaderArchive.planet_vs;
        Earth.shaderFrag = ShaderArchive.brdf_tl
            + ShaderArchive.color_tl
            + ShaderArchive.normal_tl
            + ShaderArchive.cloud_tl
            + ShaderArchive.scattering_tl
            + ShaderArchive.planet_fs_part
            + ShaderArchive.earth_fs_part;
        return Earth;
    }(Rendering.Renderable));
    Astro.Earth = Earth;
})(Astro || (Astro = {}));
var MeshHelper = (function () {
    function MeshHelper() {
    }
    MeshHelper.CreateMaterial = function (name, shaderParams) {
        var paramsCopy = Object.create(shaderParams);
        if (typeof paramsCopy.vertexShader === 'undefined' || typeof paramsCopy.fragmentShader === 'undefined')
            throw new Error(['shader "', name, '" has undefined source code'].join(''));
        var uniformNames = Rendering.ExtractUniformNames(paramsCopy.vertexShader + paramsCopy.fragmentShader);
        paramsCopy.uniforms = Rendering.BuildUniformSkeleton(uniformNames);
        paramsCopy.name = name;
        var material = new THREE.ShaderMaterial(paramsCopy);
        material.extensions.derivatives = true;
        return material;
    };
    MeshHelper.CreateShaderMesh = function (name, geometry, shaderParams) {
        var material = MeshHelper.CreateMaterial(name, shaderParams);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        return mesh;
    };
    MeshHelper.CreateShaderPoints = function (name, geometry, shaderParams) {
        var material = MeshHelper.CreateMaterial(name, shaderParams);
        var mesh = new THREE.Points(geometry, material);
        mesh.frustumCulled = false;
        return mesh;
    };
    return MeshHelper;
}());
var Astro;
(function (Astro) {
    var LocalArmStars = (function (_super) {
        __extends(LocalArmStars, _super);
        function LocalArmStars() {
            return _super.call(this, LocalArmStars.CreateGeometry(), LocalArmStars.CreateMaterial()) || this;
        }
        LocalArmStars.CreateGeometry = function () {
            var geometry = new THREE.Geometry();
            geometry.vertices = new Array(LocalArmStars.numStars);
            for (var i = 0; i < LocalArmStars.numStars; ++i)
                geometry.vertices[i] = LocalArmStars.CreateSamplePosition(Math.random(), Math.random()).multiplyScalar(1e16);
            geometry.colors = new Array(LocalArmStars.numStars);
            for (var i = 0; i < LocalArmStars.numStars; ++i)
                geometry.colors[i] = LocalArmStars.CreateSampleColor(Math.random(), Math.random());
            return geometry;
        };
        LocalArmStars.CreateMaterial = function () {
            var material = new THREE.ShaderMaterial({
                name: 'LocalArmStars',
                vertexShader: ShaderArchive.star_vs,
                fragmentShader: ShaderArchive.vertexcolor_fs,
                vertexColors: THREE.VertexColors
            });
            return material;
        };
        LocalArmStars.CreateSamplePosition = function (x, y) {
            var phi = x * Math.PI * 2;
            var theta = Math.acos(y * 2 - 1);
            return new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta));
        };
        LocalArmStars.CreateSampleColor = function (x, y) {
            var probType = [0.12, 0.43, 0.55, 0.65, 0.93, 1];
            var probBrightness = [0.0004, 0.0020, 0.0077, 0.0272, 0.0925, 0.3072, 1];
            var stellarColors = [
                new THREE.Color(0.410, 0.530, 1),
                new THREE.Color(0.599, 0.687, 1),
                new THREE.Color(0.941, 0.932, 1),
                new THREE.Color(1, 0.908, 0.828),
                new THREE.Color(1, 0.652, 0.364),
                new THREE.Color(1, 0.612, 0.160)
            ];
            var GreaterEqual = function (target) { return (function (val) { return val >= target; }); };
            var GetTypeIndex = function (val) { return probType.findIndex(GreaterEqual(val)); };
            var GetBrightnessIndex = function (val) { return probBrightness.findIndex(GreaterEqual(val)); };
            var type = GetTypeIndex(x);
            var brightness = Math.pow(2.512, -GetBrightnessIndex(y));
            return stellarColors[type].clone().multiplyScalar(brightness);
        };
        LocalArmStars.numStars = 5e4;
        return LocalArmStars;
    }(THREE.Points));
    var MilkyWaySphere = (function (_super) {
        __extends(MilkyWaySphere, _super);
        function MilkyWaySphere(geoRepo) {
            var _this = this;
            var mesh = MeshHelper.CreateShaderMesh('MilkyWaySphere', geoRepo.GetScreenPlane(), { vertexShader: MilkyWaySphere.shaderVert, fragmentShader: MilkyWaySphere.shaderFrag });
            _this = _super.call(this, mesh.geometry, mesh.material) || this;
            _this.frustumCulled = false;
            return _this;
        }
        MilkyWaySphere.shaderVert = ShaderArchive.background_vs;
        MilkyWaySphere.shaderFrag = ShaderArchive.color_tl + ShaderArchive.milkyway_fs;
        return MilkyWaySphere;
    }(THREE.Mesh));
    var MilkyWayParam = (function () {
        function MilkyWayParam() {
            this.distToCenter = 8.0;
            this.rhoZero = 1e-3;
            this.gasDensity = 7;
            this.angleToOrbit = 60;
        }
        MilkyWayParam.prototype.Clone = function () {
            var result = new MilkyWayParam();
            result.distToCenter = this.distToCenter;
            result.rhoZero = this.rhoZero;
            result.gasDensity = this.gasDensity;
            result.angleToOrbit = this.angleToOrbit;
            return result;
        };
        MilkyWayParam.prototype.Copy = function (other) {
            this.distToCenter = other.distToCenter;
            this.rhoZero = other.rhoZero;
            this.gasDensity = other.gasDensity;
            this.angleToOrbit = other.angleToOrbit;
        };
        return MilkyWayParam;
    }());
    Astro.MilkyWayParam = MilkyWayParam;
    var MilkyWay = (function (_super) {
        __extends(MilkyWay, _super);
        function MilkyWay(param, texFBM) {
            var _this = _super.call(this, 'MilkyWay') || this;
            _this.param = param;
            _this.texFBM = texFBM;
            return _this;
        }
        MilkyWay.prototype.CreateRenderItems = function (geoRepo) {
            return [
                new MilkyWaySphere(geoRepo),
                new LocalArmStars()
            ];
        };
        MilkyWay.prototype.GetUniformFulfillments = function () {
            var _this = this;
            return [
                new Rendering.UniformFulfillment('t_noise', function (uni) { return uni.value = _this.texFBM; }),
                new Rendering.UniformFulfillment('u_inverseProjView', function (uni, ctx) {
                    var matPV = ctx.camera.projectionMatrix.clone()
                        .multiply(ctx.camera.matrixWorldInverse)
                        .multiply(new THREE.Matrix4().makeRotationX(Util.ConvertToRadians(_this.param.angleToOrbit)));
                    uni.value = new THREE.Matrix4().getInverse(matPV);
                }),
                new Rendering.UniformFulfillment('u_galacticCamPos', function (uni, ctx) { return uni.value = new THREE.Vector3()
                    .setFromMatrixPosition(ctx.camera.matrixWorld)
                    .applyMatrix4(new THREE.Matrix4().makeRotationX(Util.ConvertToRadians(-_this.param.angleToOrbit))); }),
                new Rendering.UniformFulfillment('u_distToGalacticCenter', function (uni) { return uni.value = _this.param.distToCenter; }),
                new Rendering.UniformFulfillment('u_rhoZero', function (uni) { return uni.value = _this.param.rhoZero; }),
                new Rendering.UniformFulfillment('u_densityGas', function (uni) { return uni.value = _this.param.gasDensity; })
            ];
        };
        MilkyWay.prototype.OnUpdatingUniform = function () {
        };
        return MilkyWay;
    }(Rendering.Renderable));
    Astro.MilkyWay = MilkyWay;
})(Astro || (Astro = {}));
var Rendering;
(function (Rendering) {
    var Pass = (function () {
        function Pass(renderables, geoRepo) {
            var _this = this;
            this.scene = new THREE.Scene();
            this.renderables = renderables;
            this.renderables.forEach(function (item) { return item.GetRenderItems(geoRepo).forEach(function (obj) { return _this.scene.add(obj); }); });
        }
        Pass.prototype.RenderWithContext = function (drawCtx) {
            this.renderables.forEach(function (item) { return item.UpdateUniforms(drawCtx); });
            drawCtx.renderer.render(this.scene, drawCtx.camera, drawCtx.dstBuffer);
        };
        return Pass;
    }());
    Rendering.Pass = Pass;
})(Rendering || (Rendering = {}));
var Rendering;
(function (Rendering) {
    var ScreenPass = (function (_super) {
        __extends(ScreenPass, _super);
        function ScreenPass(renderable, geoRepo) {
            return _super.call(this, [renderable], geoRepo) || this;
        }
        ScreenPass.prototype.Render = function (canvas, camera, src, target) {
            this.RenderWithContext({
                renderer: canvas,
                camera: camera,
                srcBuffer: src,
                dstBuffer: target
            });
        };
        return ScreenPass;
    }(Rendering.Pass));
    Rendering.ScreenPass = ScreenPass;
})(Rendering || (Rendering = {}));
var ImgProc;
(function (ImgProc) {
    var DownScalerRenderable = (function (_super) {
        __extends(DownScalerRenderable, _super);
        function DownScalerRenderable() {
            return _super.call(this, 'ImgProc.DownScaler') || this;
        }
        DownScalerRenderable.prototype.CreateRenderItems = function (geoRepo) {
            var shaderParams = {
                vertexShader: DownScalerRenderable.shaderVert,
                fragmentShader: DownScalerRenderable.shaderFrag,
                defines: {
                    'SCALER': DownScaler.scaler + 1e-7
                }
            };
            return [
                MeshHelper.CreateShaderMesh(this.name, geoRepo.GetScreenPlane(), shaderParams)
            ];
        };
        DownScalerRenderable.prototype.GetUniformFulfillments = function () {
            return [
                new Rendering.UniformFulfillment('t_srcImg', function (uni, ctx) { return uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0; }),
                new Rendering.UniformFulfillment('u_invSrcImgSize', function (uni, ctx) { return uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0; })
            ];
        };
        DownScalerRenderable.prototype.OnUpdatingUniform = function () {
        };
        DownScalerRenderable.shaderVert = ShaderArchive.posteffect_vs;
        DownScalerRenderable.shaderFrag = ShaderArchive.downscaler_fs;
        return DownScalerRenderable;
    }(Rendering.Renderable));
    var DownScaler = (function () {
        function DownScaler(geoRepo) {
            if (typeof DownScaler.sharedPass === 'undefined')
                this.InitSharedPass(geoRepo);
        }
        DownScaler.prototype.Calculate = function (renderer, camera, src, dst) {
            DownScaler.sharedPass.Render(renderer, camera, src, dst);
        };
        DownScaler.prototype.InitSharedPass = function (geoRepo) {
            var renderable = new DownScalerRenderable();
            DownScaler.sharedPass = new Rendering.ScreenPass(renderable, geoRepo);
        };
        DownScaler.scaler = 4;
        return DownScaler;
    }());
    ImgProc.DownScaler = DownScaler;
})(ImgProc || (ImgProc = {}));
var ImgProc;
(function (ImgProc) {
    var HistogramRenderable = (function (_super) {
        __extends(HistogramRenderable, _super);
        function HistogramRenderable() {
            return _super.call(this, 'ImgProc.Histogram') || this;
        }
        HistogramRenderable.prototype.CreateRenderItems = function (geoRepo) {
            var shaderParams = {
                transparent: true,
                vertexShader: HistogramRenderable.shaderVert,
                fragmentShader: HistogramRenderable.shaderFrag,
                defines: {
                    'BUCKET_SIZE': Histogram.bucketSize + 1e-7,
                    'OUTPUT_SIZE': Histogram.texSize + 1e-1
                }
            };
            var points = MeshHelper.CreateShaderPoints(this.name, HistogramRenderable.CreateGPGPUVertices(), shaderParams);
            points.material.blending = THREE.AdditiveBlending;
            points.material.depthTest = false;
            return [points];
        };
        HistogramRenderable.prototype.GetUniformFulfillments = function () {
            return [
                new Rendering.UniformFulfillment('t_color', function (uni, ctx) { return uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0; }),
                new Rendering.UniformFulfillment('u_invImgSize', function (uni, ctx) { return uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0; })
            ];
        };
        HistogramRenderable.prototype.OnUpdatingUniform = function () {
        };
        HistogramRenderable.CreateGPGPUVertices = function () {
            var dataVertices = new Float32Array(Histogram.numSamples * 3);
            var linearIdx = 0;
            for (var i = 0; i < Histogram.sampleWindowSize; ++i) {
                for (var j = 0; j < Histogram.sampleWindowSize; ++j) {
                    dataVertices[linearIdx] = j - Histogram.sampleWindowSize / 2;
                    dataVertices[linearIdx + 1] = i - Histogram.sampleWindowSize / 2;
                    linearIdx += 3;
                }
            }
            var geo = new THREE.BufferGeometry();
            geo.addAttribute('position', new THREE.BufferAttribute(dataVertices, 3));
            return geo;
        };
        HistogramRenderable.shaderVert = ShaderArchive.color_tl + ShaderArchive.histogram_vs_part;
        HistogramRenderable.shaderFrag = ShaderArchive.histogram_fs;
        return HistogramRenderable;
    }(Rendering.Renderable));
    var ToUintConverterRenderable = (function (_super) {
        __extends(ToUintConverterRenderable, _super);
        function ToUintConverterRenderable() {
            return _super.call(this, 'ImgProc.FloatToUintConverter') || this;
        }
        ToUintConverterRenderable.prototype.CreateRenderItems = function (geoRepo) {
            var shaderParams = {
                vertexShader: ToUintConverterRenderable.shaderVert,
                fragmentShader: ToUintConverterRenderable.shaderFrag
            };
            return [
                MeshHelper.CreateShaderMesh(this.name, geoRepo.GetScreenPlane(), shaderParams)
            ];
        };
        ToUintConverterRenderable.prototype.GetUniformFulfillments = function () {
            return [
                new Rendering.UniformFulfillment('t_srcImg', function (uni, ctx) { return uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0; }),
                new Rendering.UniformFulfillment('u_invSrcImgSize', function (uni, ctx) { return uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0; })
            ];
        };
        ToUintConverterRenderable.prototype.OnUpdatingUniform = function () {
        };
        ToUintConverterRenderable.shaderVert = ShaderArchive.posteffect_vs;
        ToUintConverterRenderable.shaderFrag = ShaderArchive.color_tl + ShaderArchive.uintconvert_fs_part;
        return ToUintConverterRenderable;
    }(Rendering.Renderable));
    var HistogramResources = (function () {
        function HistogramResources() {
        }
        return HistogramResources;
    }());
    var Histogram = (function () {
        function Histogram(geoRepo) {
            if (typeof Histogram.sharedResources === 'undefined')
                this.InitStaticResources(geoRepo);
        }
        Histogram.prototype.Calculate = function (renderer, camera, src, dst) {
            Histogram.sharedResources.passHistogram.Render(renderer, camera, src, dst);
            var dstRawDataSize = dst.width * dst.height * 4;
            var dstData = new Uint8Array(dstRawDataSize);
            Histogram.sharedResources.passToUint.Render(renderer, camera, dst, Histogram.sharedResources.uintTex);
            renderer.readRenderTargetPixels(Histogram.sharedResources.uintTex, 0, 0, Histogram.texSize, Histogram.texSize, dstData);
            return Histogram.PostProcessHistogram(dstData);
        };
        Histogram.prototype.InitStaticResources = function (geoRepo) {
            Histogram.sharedResources = new HistogramResources();
            var renHistogram = new HistogramRenderable();
            Histogram.sharedResources.passHistogram = new Rendering.ScreenPass(renHistogram, geoRepo);
            var renToUintConverter = new ToUintConverterRenderable();
            Histogram.sharedResources.passToUint = new Rendering.ScreenPass(renToUintConverter, geoRepo);
            var options = {
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                stencilBuffer: false,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.NearestFilter,
                minFilter: THREE.NearestFilter
            };
            Histogram.sharedResources.uintTex = new THREE.WebGLRenderTarget(Histogram.texSize, Histogram.texSize, options);
        };
        Histogram.PostProcessHistogram = function (rawData) {
            var result = new Array(rawData.length >> 2);
            var dataView = new DataView(rawData.buffer);
            for (var idx = 0; idx < result.length; ++idx)
                result[idx] = dataView.getUint32(idx << 2, true) & 0xFFFFFF;
            var sumSamples = result.reduce(function (sum, val) { return val + sum; });
            if (sumSamples === 0) {
                result[0] = 1;
                sumSamples = 1;
            }
            var normalFactor = 1 / sumSamples;
            return result.map(function (val) { return val * normalFactor; });
        };
        Histogram.FindIndex = function (data, percentage) {
            percentage = Math.max(Math.min(percentage, 1), 0);
            var sum = 0;
            var index = data.findIndex(function (val) { return (sum += val) >= percentage - 1e-6; });
            return index >= 0 ? index : data.length - 1;
        };
        Histogram.texSize = 16;
        Histogram.numBuckets = Histogram.texSize * Histogram.texSize;
        Histogram.sampleWindowSize = 128;
        Histogram.numSamples = Histogram.sampleWindowSize * Histogram.sampleWindowSize;
        Histogram.bucketSize = 8;
        return Histogram;
    }());
    ImgProc.Histogram = Histogram;
})(ImgProc || (ImgProc = {}));
var Rendering;
(function (Rendering) {
    var CubeMapPass = (function (_super) {
        __extends(CubeMapPass, _super);
        function CubeMapPass(renderables, geoRepo) {
            return _super.call(this, renderables, geoRepo) || this;
        }
        CubeMapPass.prototype.Render = function (renderer, cubeCamera) {
            var context = new Rendering.DrawContext();
            context.renderer = renderer;
            this.renderables.forEach(function (item) { return item.UpdateUniforms(context); });
            cubeCamera.updateCubeMap(renderer, this.scene);
        };
        return CubeMapPass;
    }(Rendering.Pass));
    Rendering.CubeMapPass = CubeMapPass;
})(Rendering || (Rendering = {}));
var Noise;
(function (Noise) {
    var RandomNumber = (function () {
        function RandomNumber(seed) {
            if (typeof seed === 'undefined')
                seed = Date.now();
            this.lastVal = Math.abs(Math.round(seed));
            this.multiplier = 1103515245;
            this.increment = 12345;
            this.modulus = 0x7FFFFFFF;
        }
        RandomNumber.prototype.Generate = function () {
            var newVal = Math.round((this.multiplier * this.lastVal + this.increment) % this.modulus);
            this.lastVal = (newVal & 0x7FFFFFFF);
            return newVal / this.modulus;
        };
        RandomNumber.prototype.Clone = function () {
            return new RandomNumber(this.lastVal);
        };
        return RandomNumber;
    }());
    Noise.RandomNumber = RandomNumber;
})(Noise || (Noise = {}));
var Noise;
(function (Noise) {
    var GradientTexture = (function () {
        function GradientTexture(rng) {
            this.rng = rng;
            this.noisePerm = new Uint8Array(256);
            for (var i = 0; i < 256; i++)
                this.noisePerm[i] = i;
            this.Repermute(this.noisePerm);
            this.gradientData = GradientTexture.GenerateGradientData(this.noisePerm);
            this.texture = new THREE.DataTexture(this.gradientData, 4096, 4096, THREE.RGBAFormat, THREE.UnsignedShort4444Type);
            this.texture.unpackAlignment = 4;
            this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;
            this.texture.generateMipmaps = false;
            this.texture.needsUpdate = true;
        }
        GradientTexture.prototype.GetTexture = function () {
            return this.texture;
        };
        GradientTexture.prototype.Regenerate = function () {
            this.Repermute(this.noisePerm);
            this.UpdateTexture(GradientTexture.GenerateGradientData(this.noisePerm));
        };
        GradientTexture.prototype.Repermute = function (noisePerm) {
            for (var i = 0; i < 256; i++) {
                var swappedIndex = Math.floor(this.rng.Generate() * 256);
                var tmpVal = noisePerm[i];
                noisePerm[i] = noisePerm[swappedIndex];
                noisePerm[swappedIndex] = tmpVal;
            }
        };
        GradientTexture.EvalGradient = function (noise, result) {
            noise &= 0x0F;
            var u = (noise < 8 || noise == 12 || noise == 13 ? 1 : 2);
            var v = (noise < 4 || noise == 12 || noise == 13 ? 2 : 3);
            u = ((noise & 1) ? -u : u);
            v = ((noise & 2) ? -v : v);
            result.set((Math.abs(u) == 1 ? (u > 0 ? 1 : -1) : 0) + 1, (Math.abs(u) == 2 ? (u > 0 ? 1 : -1) : 0) + (Math.abs(v) == 2 ? (v > 0 ? 1 : -1) : 0) + 1, (Math.abs(v) == 3 ? (v > 0 ? 1 : -1) : 0) + 1);
        };
        GradientTexture.GenerateGradientData = function (noisePerm) {
            var tmpGradient = new THREE.Vector3(0, 0, 0);
            var precompGradient3D = new Uint16Array(256 * 256 * 256);
            for (var iz = 0; iz < 256; iz++) {
                var blockX = (iz & 0x0F);
                var blockY = iz >> 4;
                for (var iy = 0; iy < 256; iy++) {
                    for (var ix = 0; ix < 256; ix++) {
                        var indexBase = ((4095 - blockY * 256 - iy) * 4096 + (blockX * 256 + ix));
                        var hashedIndex = ix;
                        hashedIndex = ((noisePerm[hashedIndex] + iy) & 0xFF);
                        hashedIndex = ((noisePerm[hashedIndex] + iz) & 0xFF);
                        GradientTexture.EvalGradient(noisePerm[hashedIndex], tmpGradient);
                        precompGradient3D[indexBase] = (tmpGradient.z << 12) + (tmpGradient.y << 8) + (tmpGradient.x << 4);
                    }
                }
            }
            return precompGradient3D;
        };
        GradientTexture.prototype.UpdateTexture = function (data) {
            this.gradientData.set(data);
            this.texture.needsUpdate = true;
        };
        return GradientTexture;
    }());
    Noise.GradientTexture = GradientTexture;
})(Noise || (Noise = {}));
var Noise;
(function (Noise) {
    var IncrementalCounter = (function () {
        function IncrementalCounter(nStep, hasFinished) {
            this.nStep = Math.floor(nStep);
            if (this.nStep < 1)
                throw new Error("#step must be >= 1");
            this.currStep = (hasFinished === undefined ? 0 : nStep);
        }
        IncrementalCounter.prototype.HasFinished = function () {
            return this.currStep === this.nStep;
        };
        IncrementalCounter.prototype.GetCurrentCount = function () {
            return this.currStep;
        };
        IncrementalCounter.prototype.Step = function () {
            return this.currStep = Math.min(this.currStep + 1, this.nStep);
        };
        IncrementalCounter.prototype.Reset = function () {
            this.currStep = 0;
        };
        return IncrementalCounter;
    }());
    var FBMType;
    (function (FBMType) {
        FBMType[FBMType["BasicAndTerrain"] = 1] = "BasicAndTerrain";
        FBMType[FBMType["ClousAnim"] = 2] = "ClousAnim";
        FBMType[FBMType["MilkyWay"] = 3] = "MilkyWay";
    })(FBMType = Noise.FBMType || (Noise.FBMType = {}));
    var FBMTextureParam = (function () {
        function FBMTextureParam() {
            this.resolution = 512;
            this.type = FBMType.BasicAndTerrain;
            this.numIncreDraw = 16;
            this.displace1 = new THREE.Vector3(1.68, 54.38, 3.14);
            this.displace2 = new THREE.Vector3(1.68, 54.38, 3.14);
            this.freqScaler = 1;
            this.rng = new Noise.RandomNumber();
        }
        FBMTextureParam.prototype.Clone = function () {
            var result = new FBMTextureParam();
            result.resolution = this.resolution;
            result.type = this.type;
            result.numIncreDraw = this.numIncreDraw;
            result.displace1 = this.displace1.clone();
            result.displace2 = this.displace2.clone();
            result.freqScaler = this.freqScaler;
            result.rng = this.rng.Clone();
            return result;
        };
        return FBMTextureParam;
    }());
    Noise.FBMTextureParam = FBMTextureParam;
    var FBMTextureRenderable = (function (_super) {
        __extends(FBMTextureRenderable, _super);
        function FBMTextureRenderable(param, drawCounter, texGradient) {
            var _this = _super.call(this, 'Noise.FBMTexture') || this;
            _this.param = param;
            _this.drawCounter = drawCounter;
            _this.texGradient = texGradient;
            return _this;
        }
        FBMTextureRenderable.prototype.CreateRenderItems = function (geoRepo) {
            var params = {
                defines: { 'FBM_GEN_TYPE': this.param.type },
                vertexShader: FBMTextureRenderable.shaderVert,
                fragmentShader: FBMTextureRenderable.shaderFrag,
                side: THREE.BackSide
            };
            var mesh = MeshHelper.CreateShaderMesh(this.name, geoRepo.GetCube(), params);
            return [mesh];
        };
        FBMTextureRenderable.prototype.GetUniformFulfillments = function () {
            var _this = this;
            return [
                new Rendering.UniformFulfillment('t_gradients', function (uni) { return uni.value = _this.texGradient.GetTexture(); }),
                new Rendering.UniformFulfillment('u_currGridCell', function (uni) { return uni.value = _this.GetGridCellCoord(_this.drawCounter.GetCurrentCount()); }),
                new Rendering.UniformFulfillment('u_displace1', function (uni) { return uni.value = _this.param.displace1; }),
                new Rendering.UniformFulfillment('u_displace2', function (uni) { return uni.value = _this.param.displace2; }),
                new Rendering.UniformFulfillment('u_freqScaler', function (uni) { return uni.value = _this.param.freqScaler; })
            ];
        };
        FBMTextureRenderable.prototype.OnUpdatingUniform = function () {
        };
        FBMTextureRenderable.prototype.GetGridCellCoord = function (index) {
            var result = new THREE.Vector4();
            var root = Math.round(Math.sqrt(this.param.numIncreDraw));
            var log = Math.round(Math.log2(root));
            result.x = (index & (root - 1));
            result.y = result.x + 1;
            result.z = (index >> log);
            result.w = result.z + 1;
            result.multiplyScalar(this.param.resolution / root);
            return result;
        };
        FBMTextureRenderable.shaderVert = ShaderArchive.fbm_vs;
        FBMTextureRenderable.shaderFrag = ShaderArchive.color_tl + ShaderArchive.fbm_fs;
        return FBMTextureRenderable;
    }(Rendering.Renderable));
    var FBMTexture = (function () {
        function FBMTexture(param, geoRepo, texGradient) {
            this.param = param.Clone();
            this.texGradient = (typeof texGradient === 'undefined' ? new Noise.GradientTexture(this.param.rng) : texGradient);
            this.CreateCubeCamera();
            this.drawCounter = new IncrementalCounter(this.param.numIncreDraw);
            this.lastDrawStamp = 0;
            var renderable = new FBMTextureRenderable(this.param, this.drawCounter, this.texGradient);
            this.pass = new Rendering.CubeMapPass([renderable], geoRepo);
        }
        FBMTexture.prototype.Regenerate = function (renderer) {
            this.drawCounter.Reset();
            this.UpdateFrame(renderer);
        };
        FBMTexture.prototype.UpdateFrame = function (renderer) {
            if (this.drawCounter.HasFinished())
                return;
            var currStamp = Rendering.Manager.instance.GetFrameCount();
            if (currStamp === this.lastDrawStamp) {
                console.log('warning: multiple invocations of FBMTexture.UpdateFrame() in a frame');
                return;
            }
            this.lastDrawStamp = currStamp;
            this.pass.Render(renderer, this.cubeCamera);
            this.drawCounter.Step();
        };
        FBMTexture.prototype.SetDisplace = function (index, vec) {
            (index === 0 ? this.param.displace1 : this.param.displace2).copy(vec);
        };
        FBMTexture.prototype.GetDisplace = function (index) {
            return (index === 0 ? this.param.displace1 : this.param.displace2).clone();
        };
        FBMTexture.prototype.GetTexture = function () {
            return this.cubeCamera.renderTarget.texture;
        };
        FBMTexture.prototype.GetGradient = function () {
            return this.texGradient;
        };
        FBMTexture.prototype.IsReady = function () {
            return this.drawCounter.HasFinished();
        };
        FBMTexture.prototype.CreateCubeCamera = function () {
            this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.param.resolution);
            var renderTargetOptions = {
                depthBuffer: false,
                stencilBuffer: false,
                format: THREE.RGBAFormat,
                type: THREE.UnsignedByteType,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            };
            this.cubeCamera.renderTarget = new THREE.WebGLRenderTargetCube(this.param.resolution, this.param.resolution, renderTargetOptions);
        };
        return FBMTexture;
    }());
    Noise.FBMTexture = FBMTexture;
})(Noise || (Noise = {}));
var Noise;
(function (Noise) {
    var AnimatedFBMTextureParam = (function () {
        function AnimatedFBMTextureParam() {
            this.resolution = 512;
            this.type = Noise.FBMType.BasicAndTerrain;
            this.numIncreDraw = 16;
            this.displace = new THREE.Vector3(1.68, 54.38, 3.14);
            this.freqScaler = 1;
            this.step = new THREE.Vector3(0.03, -0.03, 0.03);
            this.keyFrameLength = 5;
        }
        AnimatedFBMTextureParam.prototype.Clone = function () {
            var result = new AnimatedFBMTextureParam();
            result.resolution = this.resolution;
            result.type = this.type;
            result.numIncreDraw = this.numIncreDraw;
            result.displace = this.displace.clone();
            result.freqScaler = this.freqScaler;
            result.step = this.step.clone();
            result.keyFrameLength = this.keyFrameLength;
            return result;
        };
        return AnimatedFBMTextureParam;
    }());
    Noise.AnimatedFBMTextureParam = AnimatedFBMTextureParam;
    var AnimatedCubeTexture = (function () {
        function AnimatedCubeTexture() {
        }
        return AnimatedCubeTexture;
    }());
    Noise.AnimatedCubeTexture = AnimatedCubeTexture;
    var AnimatedFBMTexture = (function () {
        function AnimatedFBMTexture(param, geoRepo, texGradient) {
            this.param = param.Clone();
            var fbmParams = AnimatedFBMTexture.BuildFBMParamList(param);
            this.texFront = new Noise.FBMTexture(fbmParams[0], geoRepo, texGradient);
            this.texBack = new Noise.FBMTexture(fbmParams[1], geoRepo, texGradient);
            this.lastUpdateTime = new Date().getTime();
            this.numStep = 2;
            this.blendFactor = 0;
        }
        AnimatedFBMTexture.prototype.UpdateFrame = function (renderer) {
            var texToUpdate;
            if ((texToUpdate = this.GetFirstNotReady()) !== undefined)
                texToUpdate.UpdateFrame(renderer);
            else if (this.ShouldSwap()) {
                this.SwapBuffers();
                var displace = this.param.displace.clone();
                var step = this.param.step.clone().multiplyScalar(this.numStep);
                this.texBack.SetDisplace(0, this.texFront.GetDisplace(1));
                this.texBack.SetDisplace(1, displace.add(step));
                this.texBack.Regenerate(renderer);
            }
            var newUpdateTime = new Date().getTime();
            if (this.IsReady()) {
                var deltaTime = newUpdateTime - this.lastUpdateTime;
                this.blendFactor = Math.min(this.blendFactor + deltaTime / this.param.keyFrameLength * 1e-3, 1);
            }
            this.lastUpdateTime = new Date().getTime();
        };
        AnimatedFBMTexture.prototype.IsReady = function () {
            return this.texFront.IsReady();
        };
        AnimatedFBMTexture.prototype.GetFrontTexture = function () {
            return this.texFront.GetTexture();
        };
        AnimatedFBMTexture.prototype.GetBlendingFactor = function () {
            return this.blendFactor;
        };
        AnimatedFBMTexture.prototype.GetFirstNotReady = function () {
            return [this.texFront, this.texBack].find(function (tex) { return !tex.IsReady(); });
        };
        AnimatedFBMTexture.prototype.ShouldSwap = function () {
            return this.texFront.IsReady()
                && this.texBack.IsReady()
                && this.blendFactor === 1;
        };
        AnimatedFBMTexture.prototype.SwapBuffers = function () {
            var tmp = this.texFront;
            this.texFront = this.texBack;
            this.texBack = tmp;
            this.numStep += this.blendFactor;
            this.blendFactor = 0;
        };
        AnimatedFBMTexture.BuildFBMParamList = function (animParam) {
            var temp = new Noise.FBMTextureParam();
            temp.resolution = animParam.resolution;
            temp.type = animParam.type;
            temp.numIncreDraw = animParam.numIncreDraw;
            temp.displace1 = animParam.displace.clone();
            temp.displace2 = animParam.displace.clone().add(animParam.step);
            temp.freqScaler = animParam.freqScaler;
            var result = Array(2);
            result[0] = temp.Clone();
            temp.displace1.copy(temp.displace2);
            temp.displace2.add(animParam.step);
            result[1] = temp.Clone();
            return result;
        };
        return AnimatedFBMTexture;
    }());
    Noise.AnimatedFBMTexture = AnimatedFBMTexture;
})(Noise || (Noise = {}));
var Rendering;
(function (Rendering) {
    var SimplePass = (function (_super) {
        __extends(SimplePass, _super);
        function SimplePass(renderables, geoRepo) {
            return _super.call(this, renderables, geoRepo) || this;
        }
        SimplePass.prototype.RenderToBuffer = function (canvas, camera, target) {
            this.RenderWithContext({
                renderer: canvas,
                camera: camera,
                dstBuffer: target
            });
        };
        SimplePass.prototype.RenderToScreen = function (canvas, camera, src) {
            this.RenderWithContext({
                renderer: canvas,
                camera: camera,
                srcBuffer: src
            });
        };
        return SimplePass;
    }(Rendering.Pass));
    Rendering.SimplePass = SimplePass;
})(Rendering || (Rendering = {}));
var Rendering;
(function (Rendering) {
    var BufferRepo = (function () {
        function BufferRepo(width, height) {
            this.CreateColorBuffers(width, height);
            this.CreateHistogramBuffer();
        }
        BufferRepo.prototype.Resize = function (width, height) {
            this.color.setSize(width, height);
            this.colorOne16th.setSize(width >> 2, height >> 2);
        };
        BufferRepo.prototype.CreateColorBuffers = function (width, height) {
            var options = {
                format: THREE.RGBAFormat,
                type: Util.GetPlatformFloatType(),
                stencilBuffer: false,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.NearestFilter,
                minFilter: THREE.NearestFilter
            };
            this.color = new THREE.WebGLRenderTarget(width, height, options);
            this.colorOne16th = new THREE.WebGLRenderTarget(width >> 2, height >> 2, options);
        };
        BufferRepo.prototype.CreateHistogramBuffer = function () {
            var options = {
                format: THREE.RGBAFormat,
                type: Util.GetPlatformFloatType(),
                stencilBuffer: false,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                magFilter: THREE.NearestFilter,
                minFilter: THREE.NearestFilter
            };
            this.histogram = new THREE.WebGLRenderTarget(ImgProc.Histogram.texSize, ImgProc.Histogram.texSize, options);
        };
        return BufferRepo;
    }());
    var Engine = (function () {
        function Engine(data) {
            this.data = data;
            Engine.EnableExtensions(this.data.canvas, Engine.extensions);
            this.SetupRenderBuffers();
            this.SetupTextures();
            this.SetupRenderPasses();
            this.downScaler = new ImgProc.DownScaler(this.data.geometryRepo);
            this.histogram = new ImgProc.Histogram(this.data.geometryRepo);
            this.exposure = new Rendering.Exposure();
        }
        Engine.prototype.Render = function () {
            this.UpdateTextureGenerators();
            this.RenderColorBuffer();
            this.UpdateEV();
            this.RenderFinalScreen();
        };
        Engine.prototype.OnResize = function (width, height) {
            this.bufferRepo.Resize(width, height);
        };
        Engine.prototype.SetupRenderBuffers = function () {
            var domElem = this.data.canvas.domElement;
            this.bufferRepo = new BufferRepo(domElem.width, domElem.height);
        };
        Engine.prototype.SetupTextures = function () {
            var paramFBM = new Noise.FBMTextureParam();
            paramFBM.rng = new Noise.RandomNumber(this.data.rngSeed);
            paramFBM.type = Noise.FBMType.BasicAndTerrain;
            paramFBM.freqScaler = 1.6;
            paramFBM.resolution = Engine.DetermineNoiseTexSize();
            this.texFBM = new Noise.FBMTexture(paramFBM, this.data.geometryRepo);
            paramFBM.type = Noise.FBMType.MilkyWay;
            paramFBM.displace1 = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(10);
            paramFBM.freqScaler = 2.6;
            this.texMilkyWay = new Noise.FBMTexture(paramFBM, this.data.geometryRepo, this.texFBM.GetGradient());
            var paramAnimFBM = new Noise.AnimatedFBMTextureParam();
            paramAnimFBM.resolution = paramFBM.resolution;
            paramAnimFBM.numIncreDraw = 64;
            paramAnimFBM.type = Noise.FBMType.ClousAnim;
            paramAnimFBM.freqScaler = 4;
            this.texFBMAnim = new Noise.AnimatedFBMTexture(paramAnimFBM, this.data.geometryRepo, this.texFBM.GetGradient());
        };
        Engine.prototype.SetupRenderPasses = function () {
            var data = this.data;
            this.passColor = new Rendering.SimplePass([
                new Astro.MilkyWay(data.paramMilkyWay, this.texMilkyWay.GetTexture()),
                new Astro.Sun(data.paramSun),
                new Astro.Earth(data.paramEarth, data.paramSun, { fbm: this.texFBM.GetTexture(), cloud: this.texFBMAnim })
            ], data.geometryRepo);
            this.passPost = new Rendering.SimplePass([new PostEffect.Renderable(data.paramPostEffect)], data.geometryRepo);
        };
        Engine.prototype.UpdateTextureGenerators = function () {
            var canvas = this.data.canvas;
            if (!this.texFBM.IsReady())
                this.texFBM.UpdateFrame(canvas);
            else if (!this.texMilkyWay.IsReady())
                this.texMilkyWay.UpdateFrame(canvas);
            else
                this.texFBMAnim.UpdateFrame(canvas);
        };
        Engine.prototype.RenderColorBuffer = function () {
            var canvas = this.data.canvas;
            var colorBuf = this.bufferRepo.color;
            canvas.clearTarget(colorBuf, true, true, false);
            this.passColor.RenderToBuffer(canvas, this.data.camera, colorBuf);
        };
        Engine.prototype.UpdateEV = function () {
            var camera = this.data.camera;
            var canvas = this.data.canvas;
            var colorBufDownSampled = this.bufferRepo.colorOne16th;
            this.exposure.UpdateFrame();
            this.data.paramPostEffect.ev = this.data.paramPostEffect.autoExposure ? this.exposure.GetCurrentEV() : 0.0;
            if (Rendering.Manager.instance.GetFrameCount() % 12 === 0) {
                this.downScaler.Calculate(canvas, camera, this.bufferRepo.color, colorBufDownSampled);
                canvas.clearTarget(this.bufferRepo.histogram, true, true, false);
                var histogramData = this.histogram.Calculate(canvas, camera, colorBufDownSampled, this.bufferRepo.histogram);
                this.exposure.SetTarget(Rendering.Exposure.CalculateEV(histogramData));
            }
        };
        Engine.prototype.RenderFinalScreen = function () {
            this.passPost.RenderToScreen(this.data.canvas, this.data.camera, this.bufferRepo.color);
        };
        Engine.EnableExtensions = function (canvas, extensions) {
            var extNotSupported = extensions.filter(function (item) { return canvas.context.getExtension(item) === null; });
            if (extNotSupported.length > 0)
                throw new Error(['WebGL extensions \'', extNotSupported.join('\', \''), '\' are not supported by the browser'].join(''));
        };
        Engine.DetermineNoiseTexSize = function () {
            return Util.IsOnMobile() ? 512 : 1024;
        };
        Engine.extensions = [
            'OES_standard_derivatives',
            'OES_texture_half_float',
            'OES_texture_half_float_linear',
            'OES_texture_float',
            'OES_texture_float_linear'
        ];
        return Engine;
    }());
    Rendering.Engine = Engine;
})(Rendering || (Rendering = {}));
var Rendering;
(function (Rendering) {
    var Exposure = (function () {
        function Exposure() {
            this.minEV = -2;
            this.maxEV = 2;
            this.adjustSpeed = 0.02;
            this.currentEV = 0;
            this.targetEV = 0;
        }
        Exposure.prototype.UpdateFrame = function () {
            var absDeltaEV = Math.abs(this.targetEV - this.currentEV);
            absDeltaEV = Math.min(absDeltaEV, this.adjustSpeed);
            if (absDeltaEV >= 1e-6)
                this.currentEV += absDeltaEV * (this.targetEV > this.currentEV ? 1 : -1);
        };
        Exposure.prototype.SetTarget = function (target) {
            this.targetEV = Math.min(Math.max(target, this.minEV), this.maxEV);
        };
        Exposure.prototype.GetCurrentEV = function () {
            return this.currentEV;
        };
        Exposure.CalculateEV = function (histogram) {
            var minPercentage = 0.8;
            var maxPercentage = 0.98;
            var indexMin = ImgProc.Histogram.FindIndex(histogram, minPercentage);
            var indexMax = ImgProc.Histogram.FindIndex(histogram, maxPercentage);
            var indexMean = indexMin;
            if (indexMin !== indexMax) {
                var histFocus = histogram.slice(indexMin, indexMax + 1);
                var normalFactor_1 = 1 / histFocus.reduce(function (sum, val, idx) { return val + sum; });
                histFocus.forEach(function (val, idx, arr) { return arr[idx] = val * normalFactor_1; });
                var sumOfWeight = histFocus.reduce(function (sum, val, idx) { return Math.pow(2.0, indexMin + idx) + sum; });
                var sumOfTotal = histFocus.reduce(function (sum, val, idx) { return val * Math.pow(2.0, indexMin + idx) + sum; });
                indexMean += Math.log2(sumOfTotal / sumOfWeight);
            }
            return -(indexMean - ImgProc.Histogram.numBuckets * 0.5)
                / ImgProc.Histogram.bucketSize
                * Math.log10(2)
                * 0.5;
        };
        return Exposure;
    }());
    Rendering.Exposure = Exposure;
})(Rendering || (Rendering = {}));
var PostEffect;
(function (PostEffect) {
    var Param = (function () {
        function Param() {
            this.ev = -0.7;
            this.autoExposure = true;
        }
        Param.prototype.Copy = function (other) {
            this.ev = other.ev;
            this.autoExposure = other.autoExposure;
        };
        return Param;
    }());
    PostEffect.Param = Param;
    var Renderable = (function (_super) {
        __extends(Renderable, _super);
        function Renderable(param) {
            var _this = _super.call(this, 'PostEffect') || this;
            _this.param = param;
            return _this;
        }
        Renderable.prototype.CreateRenderItems = function (geoRepo) {
            var mesh = MeshHelper.CreateShaderMesh(this.name, geoRepo.GetScreenPlane(), { vertexShader: PostEffect.Renderable.shaderVert, fragmentShader: PostEffect.Renderable.shaderFrag });
            return [mesh];
        };
        Renderable.prototype.GetUniformFulfillments = function () {
            var _this = this;
            return [
                new Rendering.UniformFulfillment('u_random', function (uni) { return uni.value = new THREE.Vector2(Math.random(), Math.random()).multiplyScalar(5); }),
                new Rendering.UniformFulfillment('t_color', function (uni, ctx) { return uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0; }),
                new Rendering.UniformFulfillment('u_invImgSize', function (uni, ctx) { return uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0; }),
                new Rendering.UniformFulfillment('u_exposure', function (uni) { return uni.value = Math.pow(10, _this.param.ev); })
            ];
        };
        Renderable.prototype.OnUpdatingUniform = function () {
        };
        Renderable.shaderVert = ShaderArchive.posteffect_vs;
        Renderable.shaderFrag = ShaderArchive.color_tl + ShaderArchive.posteffect_fs_part;
        return Renderable;
    }(Rendering.Renderable));
    PostEffect.Renderable = Renderable;
})(PostEffect || (PostEffect = {}));
var Rendering;
(function (Rendering) {
    var Manager = (function () {
        function Manager() {
            this.frameCount = 0;
            this.renderTasks = [];
            this.BookNextFrame();
        }
        Manager.prototype.GetFrameCount = function () {
            return this.frameCount;
        };
        Manager.prototype.RegisterTask = function (newTask) {
            this.renderTasks.push(newTask);
        };
        Manager.prototype.Render = function () {
            this.renderTasks.forEach(function (func) { return func(); });
            ++this.frameCount;
            this.BookNextFrame();
        };
        Manager.prototype.BookNextFrame = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.Render(); });
        };
        Manager.instance = new Manager();
        return Manager;
    }());
    Rendering.Manager = Manager;
})(Rendering || (Rendering = {}));
var Util;
(function (Util) {
    var Delegate = (function () {
        function Delegate() {
            this.funcList = [];
        }
        Delegate.prototype.Add = function (func) {
            this.funcList.push(func);
        };
        Delegate.prototype.Invoke = function () {
            this.funcList.forEach(function (func) { return func(); });
        };
        Delegate.prototype.Clear = function () {
            this.funcList = [];
        };
        Delegate.prototype.IsEmpty = function () {
            return this.funcList.length === 0;
        };
        Delegate.prototype.Clone = function () {
            return Object.create(this.funcList);
        };
        return Delegate;
    }());
    Util.Delegate = Delegate;
    var DelegateSet = (function () {
        function DelegateSet() {
            this.delegates = {};
            this.dummy;
        }
        DelegateSet.prototype.Get = function (index) {
            var delegates = this.delegates;
            if (typeof delegates[index] === 'undefined')
                delegates[index] = new Delegate();
            return delegates[index];
        };
        DelegateSet.prototype.Add = function (index, cb) {
            this.Get(index).Add(cb);
        };
        DelegateSet.prototype.Invoke = function (index) {
            if (typeof this.delegates[index] !== 'undefined')
                this.delegates[index].Invoke();
        };
        DelegateSet.prototype.IsEmpty = function (index) {
            return (typeof this.delegates[index] === 'undefined') || this.delegates[index].IsEmpty();
        };
        DelegateSet.prototype.Clone = function () {
            var _this = this;
            var newInst = new DelegateSet();
            Object.keys(this.delegates)
                .map(function (val) { return parseInt(val); })
                .forEach(function (key) { return newInst.delegates[key] = _this.delegates[key].Clone(); });
            return newInst;
        };
        return DelegateSet;
    }());
    Util.DelegateSet = DelegateSet;
})(Util || (Util = {}));
var UI;
(function (UI) {
    function ShowGlobalBlocker() {
        $('#blocker').css('visibility', 'visible');
    }
    UI.ShowGlobalBlocker = ShowGlobalBlocker;
    function HideGlobalBlocker() {
        $('#blocker').css('visibility', 'hidden');
    }
    UI.HideGlobalBlocker = HideGlobalBlocker;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var ConfigCallbackType;
    (function (ConfigCallbackType) {
        ConfigCallbackType[ConfigCallbackType["ResetToDefaults"] = 0] = "ResetToDefaults";
        ConfigCallbackType[ConfigCallbackType["ResetCamera"] = 1] = "ResetCamera";
        ConfigCallbackType[ConfigCallbackType["ShowStatsMeter"] = 2] = "ShowStatsMeter";
        ConfigCallbackType[ConfigCallbackType["HideStatsMeter"] = 3] = "HideStatsMeter";
    })(ConfigCallbackType = UI.ConfigCallbackType || (UI.ConfigCallbackType = {}));
    var GeneralOptions = (function () {
        function GeneralOptions() {
            this.isStatsMeterVisible = true;
        }
        GeneralOptions.prototype.Copy = function (other) {
            this.isStatsMeterVisible = other.isStatsMeterVisible;
        };
        return GeneralOptions;
    }());
    var ConfigTranslationLayer = (function () {
        function ConfigTranslationLayer(config) {
            this.config = config;
            this.ReadAndSync();
        }
        ConfigTranslationLayer.prototype.ReadAndSync = function () {
            var config = this.config;
            this.temperature = config.paramSun.temperature.GetTemperature();
            this.axialTilt = Math.floor(Util.ConvertToDegrees(config.paramEarth.axialTilt));
            this.rotateSpeed = Math.floor(config.paramEarth.selfRotSpeed / 0.001);
            this.WriteBack();
        };
        ConfigTranslationLayer.prototype.WriteBack = function () {
            var config = this.config;
            config.paramSun.temperature.SetTemperature(this.temperature);
            config.paramEarth.axialTilt = Util.ConvertToRadians(this.axialTilt);
            config.paramEarth.selfRotSpeed = this.rotateSpeed * 0.001;
        };
        return ConfigTranslationLayer;
    }());
    var Configure = (function () {
        function Configure(configData) {
            var _this = this;
            this.data = configData;
            this.optGeneral = new GeneralOptions();
            this.translation = new ConfigTranslationLayer(this.data);
            this.data.delegates.Add(ConfigCallbackType.ResetToDefaults, function () { return _this.ResetToDefaults(); });
            Configure.CheckDelegates(this.data.delegates);
            this.SetupControls(configData, this.translation);
        }
        Configure.CheckDelegates = function (delegates) {
            var funcCheckDelegate = function (cbType) {
                if (delegates.IsEmpty(cbType))
                    throw new Error('Delegate type=' + cbType + ' cannot be empty');
            };
            funcCheckDelegate(ConfigCallbackType.ResetToDefaults);
            funcCheckDelegate(ConfigCallbackType.ResetCamera);
            funcCheckDelegate(ConfigCallbackType.ShowStatsMeter);
            funcCheckDelegate(ConfigCallbackType.HideStatsMeter);
        };
        Configure.prototype.SetupControls = function (configData, translation) {
            var gui = new dat.GUI();
            this.gui = gui;
            this.Hide();
            this.OverrideCloseButton(this.gui.domElement);
            this.ResetToDefaults;
            Configure.SetupFolderGeneral(gui, configData, this.optGeneral);
            Configure.SetupFolderSun(gui, configData, translation);
            Configure.SetupFolderEarth(gui, configData, translation);
            Configure.SetupFolderMilkyWay(gui, configData, translation);
            Configure.SetupFolderCamera(gui, configData, translation);
            translation.WriteBack();
        };
        Configure.SetupFolderGeneral = function (gui, data, optGeneral) {
            var folderGeneral = gui.addFolder('General');
            var proxy = {
                resetToDefaults: function () { return data.delegates.Invoke(ConfigCallbackType.ResetToDefaults); },
                onVisibilityChanges: function (isVisible) { return data.delegates.Invoke(isVisible ? ConfigCallbackType.ShowStatsMeter : ConfigCallbackType.HideStatsMeter); }
            };
            folderGeneral.add(proxy, 'resetToDefaults')
                .name('Reset to Default');
            folderGeneral.add(optGeneral, 'isStatsMeterVisible')
                .name('Stats Meter')
                .onChange(proxy.onVisibilityChanges);
            folderGeneral.open();
        };
        Configure.SetupFolderSun = function (gui, data, translation) {
            var updateTranslation = function () { return translation.WriteBack(); };
            var folderSun = gui.addFolder('Sun');
            folderSun.add(translation, 'temperature', 1000, 13000)
                .name('Temperature')
                .step(100)
                .onChange(updateTranslation);
            folderSun.open();
        };
        Configure.SetupFolderEarth = function (gui, data, translation) {
            var updateTranslation = function () { return translation.WriteBack(); };
            var folderEarth = gui.addFolder('Earth');
            folderEarth.add(translation, 'axialTilt', 0, 90)
                .name('Axial Tilt')
                .step(1)
                .onChange(updateTranslation);
            folderEarth.add(data.paramEarth, 'heightOcean', 0.1, 0.8)
                .name('Ocean Level')
                .step(0.01);
            folderEarth.add(data.paramEarth, 'cloudAmount', -1, 1)
                .name('Cloud Amount')
                .step(0.01);
            folderEarth.add(data.paramEarth, 'cloudHeight', 2000, 5000)
                .name('Cloud Height')
                .step(200);
            folderEarth.add(translation, 'rotateSpeed', -2, 2)
                .name('Self Rotation')
                .step(1)
                .onChange(updateTranslation);
            folderEarth.open();
        };
        Configure.SetupFolderMilkyWay = function (gui, data, translation) {
            var folderMilkyWay = gui.addFolder('Milky Way');
            folderMilkyWay.add(data.paramMilkyWay, 'distToCenter', 4, 12)
                .name('Distance')
                .step(0.01);
            folderMilkyWay.add(data.paramMilkyWay, 'angleToOrbit', -90, 90)
                .name('Angle To Orbit')
                .step(0.1);
            folderMilkyWay.add(data.paramMilkyWay, 'gasDensity', 0, 10)
                .name('Gas Density');
            folderMilkyWay.open();
        };
        Configure.SetupFolderCamera = function (gui, data, translation) {
            var folderPostEffect = gui.addFolder('Camera');
            var proxy = { resetCamera: function () { return data.delegates.Invoke(ConfigCallbackType.ResetCamera); } };
            folderPostEffect.add(data.paramPostEffect, 'autoExposure')
                .name('Auto Exposure');
            folderPostEffect.add(proxy, 'resetCamera')
                .name('Reset Camera');
            folderPostEffect.open();
        };
        Configure.prototype.OverrideCloseButton = function (domElement) {
            var _this = this;
            $(domElement).children('.close-button').on('click', function () { return _this.Hide(); });
        };
        Configure.prototype.ResetToDefaults = function () {
            var data = this.data;
            data.paramEarth.Copy(new Astro.EarthParam());
            data.paramSun.Copy(new Astro.SunParam());
            data.paramMilkyWay.Copy(new Astro.MilkyWayParam());
            data.paramPostEffect.Copy(new PostEffect.Param());
            this.optGeneral.Copy(new GeneralOptions());
            this.UpdateDisplay();
        };
        Configure.prototype.UpdateDisplay = function () {
            this.translation.ReadAndSync();
            this.gui.updateDisplay();
        };
        Configure.prototype.Show = function () {
            this.gui.open();
            $(this.gui.domElement).css('visibility', 'visible');
        };
        Configure.prototype.Hide = function () {
            $(this.gui.domElement).css('visibility', 'hidden');
            this.gui.close();
        };
        Configure.prototype.Update = function () {
        };
        return Configure;
    }());
    UI.Configure = Configure;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Info = (function () {
        function Info() {
            var _this = this;
            $(Info.elemIdButton).on('click', function () { return _this.Hide(); });
        }
        Info.prototype.Show = function () {
            UI.ShowGlobalBlocker();
            $(Info.elemIdWidget).css('visibility', 'visible');
        };
        Info.prototype.Hide = function () {
            $(Info.elemIdWidget).css('visibility', 'hidden');
            UI.HideGlobalBlocker();
        };
        Info.prototype.Update = function () {
        };
        Info.elemIdWidget = '#info';
        Info.elemIdButton = '#info #btn_close';
        return Info;
    }());
    UI.Info = Info;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Screenshot = (function () {
        function Screenshot(funcGetEncodedImg) {
            this.funcGetEncodedImg = funcGetEncodedImg;
        }
        Screenshot.prototype.Show = function () {
            var encodedImg = this.funcGetEncodedImg();
            if (Util.IsPageOnServer())
                Screenshot.CreateWindowWithExternalPage(encodedImg);
            else
                Screenshot.CreateWindowWithBlankPage(encodedImg);
        };
        Screenshot.prototype.Hide = function () {
        };
        Screenshot.prototype.Update = function () {
        };
        Screenshot.CreateWindowWithExternalPage = function (encodedImg) {
            var newWin = window.open('screenshot.html');
            if (newWin !== null)
                newWin.opener = { screenshot: encodedImg };
        };
        Screenshot.CreateWindowWithBlankPage = function (encodedImg) {
            var newWin = window.open('about:blank', 'Screenshot');
            if (newWin != null) {
                newWin.document.write('Now you can save the image below.<br><img src="');
                newWin.document.write(encodedImg);
                newWin.document.write('">');
            }
        };
        return Screenshot;
    }());
    UI.Screenshot = Screenshot;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Share = (function () {
        function Share(funcGetSharedURL) {
            var _this = this;
            this.funcGetSharedURL = funcGetSharedURL;
            $(Share.elemIdButton).on('click', function () { return _this.Hide(); });
        }
        Share.prototype.Show = function () {
            var sharedURL = this.funcGetSharedURL();
            window.history.replaceState('new sharable URL', 'Procedural Earth', sharedURL);
            UI.ShowGlobalBlocker();
            var textField = $(Share.elemIdTextField).val(sharedURL);
            $(Share.elemIdWidget).css('visibility', 'visible');
            this.SelectAndCopyFrom(textField);
        };
        Share.prototype.Hide = function () {
            $(Share.elemIdWidget).css('visibility', 'hidden');
            UI.HideGlobalBlocker();
        };
        Share.prototype.Update = function () {
        };
        Share.prototype.SelectAndCopyFrom = function (elem) {
            elem.select();
            try {
                document.execCommand('copy');
            }
            catch (_a) {
                console.warn('Failed to exec command "copy"');
            }
        };
        Share.elemIdWidget = '#share';
        Share.elemIdTextField = '#shared_url';
        Share.elemIdButton = '#share #btn_close';
        return Share;
    }());
    UI.Share = Share;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var StatsMeter = (function () {
        function StatsMeter() {
            this.isVisible = true;
            this.impl = new Stats();
            this.impl.showPanel(0);
            this.impl.dom.style.position = "absolute";
            this.impl.dom.style.left = "0px";
            this.impl.dom.style.top = "0px";
            this.impl.dom.style.zIndex = "50";
            this.SetVisibility(true);
        }
        StatsMeter.prototype.GetElement = function () {
            return this.impl.dom;
        };
        StatsMeter.prototype.ToggleVisibility = function () {
            this.SetVisibility(!this.isVisible);
        };
        StatsMeter.prototype.Show = function () {
            this.SetVisibility(true);
        };
        StatsMeter.prototype.Hide = function () {
            this.SetVisibility(false);
        };
        StatsMeter.prototype.Update = function () {
            this.impl.update();
        };
        StatsMeter.prototype.SetVisibility = function (isVisible) {
            this.isVisible = isVisible;
            this.impl.dom.style.visibility = (isVisible ? "visible" : "hidden");
        };
        return StatsMeter;
    }());
    UI.StatsMeter = StatsMeter;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var Overlay = (function () {
        function Overlay() {
            this.buttons = [
                { type: 0, elemId: Overlay.elemIdButtonInfo, isVisible: false },
                { type: 1, elemId: Overlay.elemIdButtonConfig, isVisible: false },
                { type: 2, elemId: Overlay.elemIdButtonShare, isVisible: false },
                { type: 3, elemId: Overlay.elemIdButtonScreenshot, isVisible: false }
            ];
            this.widgets = new Array(5);
            this.SetupMsgBoxMargins();
            this.SetupButtonEvents();
        }
        Overlay.prototype.Show = function () {
            $(Overlay.elemIdButtonTray).css('visibility', 'visible');
        };
        Overlay.prototype.Hide = function () {
            $(Overlay.elemIdButtonTray).css('visibility', 'hidden');
        };
        Overlay.prototype.Update = function () {
            this.widgets.forEach(function (widget) {
                if (typeof widget !== 'undefined')
                    widget.Update();
            });
        };
        Overlay.prototype.OnKeyPressed = function (keyEvent) {
            var KEY_ESC = 27;
            var KEY_RETURN = 13;
            if (keyEvent.keyCode == KEY_ESC || keyEvent.keyCode == KEY_RETURN)
                this.HideWidgets([2, 0]);
            return true;
        };
        Overlay.prototype.SetButtonVisibility = function (types, isVisible) {
            var _this = this;
            types.forEach(function (type) {
                var button = _this.buttons.find(function (button) { return button.type === type; });
                if (typeof button !== 'undefined')
                    button.isVisible = isVisible;
            });
            this.RefreshButtons();
        };
        Overlay.prototype.ActivateWidgetInfo = function () {
            if (typeof this.widgets[0] === 'undefined')
                this.widgets[0] = new UI.Info();
        };
        Overlay.prototype.ActivateWidgetConfig = function (data) {
            var _this = this;
            if (typeof this.widgets[1] === 'undefined') {
                data.delegates.Add(UI.ConfigCallbackType.ShowStatsMeter, function () { return _this.ShowWidgets([4]); });
                data.delegates.Add(UI.ConfigCallbackType.HideStatsMeter, function () { return _this.HideWidgets([4]); });
                this.widgets[1] = new UI.Configure(data);
            }
        };
        Overlay.prototype.ActivateWidgetShare = function (funcGetSharedURL) {
            if (typeof this.widgets[2] === 'undefined')
                this.widgets[2] = new UI.Share(funcGetSharedURL);
        };
        Overlay.prototype.ActivateWidgetScreenshot = function (funcGetEncodedImg) {
            if (typeof this.widgets[3] === 'undefined')
                this.widgets[3] = new UI.Screenshot(funcGetEncodedImg);
        };
        Overlay.prototype.ActivateWidgetStatsMeter = function (rootElem) {
            if (typeof this.widgets[4] === 'undefined') {
                var widget = new UI.StatsMeter();
                this.widgets[4] = widget;
                if (typeof rootElem !== 'undefined')
                    rootElem.appendChild(widget.GetElement());
            }
        };
        Overlay.prototype.ShowWidgets = function (types) {
            var _this = this;
            types.forEach(function (type) {
                var widget = _this.widgets[type];
                if (typeof widget !== 'undefined')
                    widget.Show();
            });
        };
        Overlay.prototype.HideWidgets = function (types) {
            var _this = this;
            types.forEach(function (type) {
                var widget = _this.widgets[type];
                if (typeof widget !== 'undefined')
                    widget.Hide();
            });
        };
        Overlay.prototype.SetupButtonEvents = function () {
            var _this = this;
            var funcShowWidget = function (type) {
                return function () { return _this.ShowWidgets([type]); };
            };
            this.buttons.forEach(function (button) { return $(button.elemId).on('click', funcShowWidget(button.type)); });
        };
        Overlay.prototype.SetupMsgBoxMargins = function () {
            $('.modal').each(function (idx, domElem) {
                var elem = $(domElem);
                elem.css('margin-top', -(parseInt(elem.css('height')) >> 1));
                elem.css('margin-left', -(parseInt(elem.css('width')) >> 1));
            });
        };
        Overlay.prototype.RefreshButtons = function () {
            this.buttons.forEach(function (button) {
                var domElem = $(button.elemId);
                domElem.css('float', button.isVisible ? 'right' : 'left');
                domElem.css('visibility', button.isVisible ? 'visible' : 'hidden');
            });
        };
        Overlay.elemIdButtonTray = '#overlay.button_list';
        Overlay.elemIdButtonInfo = '#btn_info';
        Overlay.elemIdButtonConfig = '#btn_config';
        Overlay.elemIdButtonShare = '#btn_share';
        Overlay.elemIdButtonScreenshot = '#btn_screenshot';
        return Overlay;
    }());
    UI.Overlay = Overlay;
})(UI || (UI = {}));
var Util;
(function (Util) {
    var EXPORT_DATA_SIZE = (10 << 3);
    function IsParamStringValid(str) {
        var length = str.length;
        if (length != EXPORT_DATA_SIZE)
            return false;
        for (var i = 0; i < length; ++i) {
            var charCode = str.charCodeAt(i);
            if (!(charCode >= 0x30 && charCode <= 0x39) && !(charCode >= 0x41 && charCode <= 0x46) && !(charCode >= 0x61 && charCode <= 0x66))
                return false;
        }
        return true;
    }
    Util.IsParamStringValid = IsParamStringValid;
    function ConvertBufferToString(buffer) {
        var ubyteView = new Uint8Array(buffer);
        var strArray = [];
        ubyteView.forEach(function (val) { return strArray.push(val < 16 ? '0' + val.toString(16) : val.toString(16)); });
        return strArray.join('');
    }
    function ConvertStringToBuffer(str) {
        if (!IsParamStringValid(str))
            throw new Error('Failed to parse data from previously exported parameters.');
        var result = new ArrayBuffer(EXPORT_DATA_SIZE);
        var ubyteView = new Uint8Array(result);
        for (var i = 0; i < (EXPORT_DATA_SIZE >> 1); ++i)
            ubyteView[i] = parseInt(str.substr(i << 1, 2), 16);
        return result;
    }
    function SerializeParam(data) {
        var buffer = new ArrayBuffer(10 << 2);
        var view = new DataView(buffer);
        view.setUint32(0 << 2, data.rngSeed, true);
        view.setUint32(1 << 2, data.paramSun.temperature.GetTemperature(), true);
        view.setFloat32(2 << 2, data.paramEarth.heightOcean, true);
        view.setFloat32(3 << 2, data.paramEarth.cloudAmount, true);
        view.setFloat32(4 << 2, data.paramEarth.cloudHeight, true);
        view.setFloat32(5 << 2, data.paramEarth.axialTilt, true);
        view.setFloat32(6 << 2, data.paramEarth.selfRotSpeed, true);
        view.setFloat32(7 << 2, data.paramMilkyWay.distToCenter, true);
        view.setFloat32(8 << 2, data.paramMilkyWay.gasDensity, true);
        view.setFloat32(9 << 2, data.paramMilkyWay.angleToOrbit, true);
        return ConvertBufferToString(buffer);
    }
    Util.SerializeParam = SerializeParam;
    function DeserializeParam(str) {
        var buffer = ConvertStringToBuffer(str);
        var view = new DataView(buffer);
        var result = {
            rngSeed: Date.now(),
            paramSun: new Astro.SunParam(),
            paramEarth: new Astro.EarthParam(),
            paramMilkyWay: new Astro.MilkyWayParam()
        };
        result.rngSeed = view.getUint32(0 << 2, true);
        result.paramSun.temperature.SetTemperature(view.getUint32(1 << 2, true));
        result.paramEarth.heightOcean = view.getFloat32(2 << 2, true);
        result.paramEarth.cloudAmount = view.getFloat32(3 << 2, true);
        result.paramEarth.cloudHeight = view.getFloat32(4 << 2, true);
        result.paramEarth.axialTilt = view.getFloat32(5 << 2, true);
        result.paramEarth.selfRotSpeed = view.getFloat32(6 << 2, true);
        result.paramMilkyWay.distToCenter = view.getFloat32(7 << 2, true);
        result.paramMilkyWay.gasDensity = view.getFloat32(8 << 2, true);
        result.paramMilkyWay.angleToOrbit = view.getFloat32(9 << 2, true);
        return result;
    }
    Util.DeserializeParam = DeserializeParam;
})(Util || (Util = {}));
function TryAndCatch(funcTask, funcErr) {
    return function () {
        try {
            funcTask();
        }
        catch (e) {
            funcErr(e);
        }
    };
}
var ControlType;
(function (ControlType) {
    ControlType[ControlType["Orbit"] = 0] = "Orbit";
    ControlType[ControlType["Trackball"] = 1] = "Trackball";
})(ControlType || (ControlType = {}));
var Application = (function () {
    function Application(rootNode, controlType) {
        var _this = this;
        var init = function () {
            _this.SetupCamera();
            var exportData = Application.ExtractParamFromURL(window.location.href);
            _this.SetupRenderer(rootNode, exportData);
            _this.SetupController(controlType);
            _this.SetupEventHandlers();
            _this.SetupUI(rootNode);
        };
        TryAndCatch(init, Application.OnError)();
    }
    Application.prototype.StartRendering = function () {
        var _this = this;
        var callback = TryAndCatch(function () { return _this.Render(); }, Application.OnError);
        Rendering.Manager.instance.RegisterTask(callback);
    };
    Application.prototype.SetupCamera = function () {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(-61.53412641991374, -57.18090403544923, 70.033829519573);
        this.camera.up.set(-0.1561075070494867, 0.8278637450097441, 0.5387690283797024);
    };
    Application.prototype.SetupRenderer = function (rootNode, exportData) {
        this.canvas = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.canvas.autoClear = false;
        this.canvas.setSize(window.innerWidth, window.innerHeight);
        this.canvas.sortObjects = false;
        rootNode.appendChild(this.canvas.domElement);
        var rngSeed;
        var paramSun;
        var paramEarth;
        var paramMilkyWay;
        if (typeof exportData !== 'undefined') {
            rngSeed = exportData.rngSeed;
            paramSun = exportData.paramSun;
            paramEarth = exportData.paramEarth;
            paramMilkyWay = exportData.paramMilkyWay;
        }
        else {
            rngSeed = Math.round(Math.random() * 0x7FFFFFFF);
            paramSun = new Astro.SunParam();
            paramEarth = new Astro.EarthParam();
            paramMilkyWay = new Astro.MilkyWayParam();
        }
        this.renderEngineData = {
            camera: this.camera,
            canvas: this.canvas,
            paramEarth: paramEarth,
            paramSun: paramSun,
            paramMilkyWay: paramMilkyWay,
            paramPostEffect: new PostEffect.Param(),
            geometryRepo: new Resource.GeometryRepo(),
            rngSeed: rngSeed
        };
        this.renderEngine = new Rendering.Engine(this.renderEngineData);
    };
    Application.prototype.SetupController = function (controlType) {
        var control;
        if (controlType == ControlType.Orbit) {
            control = new THREE.OrbitControls(this.camera, this.canvas.domElement);
            control.zoomSpeed = 0.5;
            control.rotateSpeed = 0.5;
            control.enableDamping = true;
            control.dampingFactor = 0.15;
        }
        else
            control = new THREE.TrackballControls(this.camera, this.canvas.domElement);
        control.minDistance = 30;
        control.maxDistance = 1000;
        this.control = control;
    };
    Application.prototype.SetupEventHandlers = function () {
        this.SetupResizeHandler();
        this.SetupKeyHandler();
    };
    Application.prototype.SetupResizeHandler = function () {
        var _this = this;
        var handler = function () {
            _this.camera.aspect = window.innerWidth / window.innerHeight;
            _this.camera.updateProjectionMatrix();
            _this.canvas.setSize(window.innerWidth, window.innerHeight);
            _this.renderEngine.OnResize(window.innerWidth, window.innerHeight);
            if (_this.control instanceof THREE.TrackballControls)
                _this.control.handleResize();
        };
        window.onresize = handler;
        handler();
    };
    Application.prototype.SetupKeyHandler = function () {
        var _this = this;
        document.body.onkeydown = function (keyEvent) { return _this.uiOverlay.OnKeyPressed(keyEvent); };
    };
    Application.prototype.SetupUI = function (rootNode) {
        var _this = this;
        this.uiOverlay = new UI.Overlay();
        var renderData = this.renderEngineData;
        var delegates = new Util.DelegateSet();
        delegates.Add(UI.ConfigCallbackType.ResetCamera, function () { return _this.control.reset(); });
        this.uiOverlay.ActivateWidgetConfig({
            paramEarth: renderData.paramEarth,
            paramSun: renderData.paramSun,
            paramMilkyWay: renderData.paramMilkyWay,
            paramPostEffect: renderData.paramPostEffect,
            delegates: delegates
        });
        this.uiOverlay.ActivateWidgetShare(function () { return Application.GetSharableURL(_this.renderEngineData); });
        this.uiOverlay.ActivateWidgetScreenshot(function () { return Application.GetEncodedCanvasImg(_this.canvas.domElement); });
        this.uiOverlay.ActivateWidgetStatsMeter(rootNode);
        this.uiOverlay.ActivateWidgetInfo();
        var enableList = [0, 1, 3, 4];
        if (!Util.IsOnMobile())
            enableList.push(2);
        this.uiOverlay.SetButtonVisibility(enableList, true);
    };
    Application.prototype.Render = function () {
        this.uiOverlay.Update();
        this.control.update();
        this.camera.updateMatrixWorld(true);
        this.canvas.clear();
        this.renderEngine.Render();
    };
    Application.OnError = function (error) {
        $('#error #detail').html(error.toString());
        $('#error').css('visibility', 'visible');
        throw error;
    };
    Application.ExtractParamFromURL = function (url) {
        var parsedURL = url.split('?');
        var strParam = parsedURL.length > 1 ? parsedURL[1] : '';
        if (Util.IsParamStringValid(strParam))
            return Util.DeserializeParam(strParam);
        else if (strParam.length > 0)
            alert('It seems you got here from a shared link. Unfortunately the link is broken. You will now have a freshly generated Earth.');
        return undefined;
    };
    Application.GetSharableURL = function (renderData) {
        var url = window.location.href.split('?')[0];
        var encodedParam = Util.SerializeParam({
            rngSeed: renderData.rngSeed,
            paramSun: renderData.paramSun,
            paramEarth: renderData.paramEarth,
            paramMilkyWay: renderData.paramMilkyWay
        });
        return [url, '?', encodedParam].join('');
    };
    Application.GetEncodedCanvasImg = function (canvasElem) {
        return canvasElem.toDataURL('image/png');
    };
    return Application;
}());
var app;
$(document.body).ready(function () {
    app = new Application(document.body, ControlType.Trackball);
    app.StartRendering();
});
