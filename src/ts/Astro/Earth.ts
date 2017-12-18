/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Generated/ShaderArchive.ts" />
/// <reference path="../Rendering/Renderable.ts" />
/// <reference path="../Rendering/Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="../Util/UnitConv.ts" />
/// <reference path="Planet.ts" />
/// <reference path="Scattering.ts" />
/// <reference path="Sun.ts" />



namespace Astro {



// rotation axis, etc.
class Auxiliaries extends THREE.Scene {
	constructor() {
		super();

		this.add(Auxiliaries.CreateRotationAxis());
	}

	private static CreateRotationAxis() : THREE.Object3D {
		let geo = new THREE.BufferGeometry();
		let vertices = new Float32Array( [
			0, 1.2, 0,
			0, -1.2, 0
		] );
		geo.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		return new THREE.LineSegments(geo, new THREE.LineBasicMaterial( { color: 0x60FFFF, linewidth: 1 } ));
	}
}



// REF: "Albedo". https://en.wikipedia.org/wiki/Albedo
export class EarthParam {
	// surface-related
	public heightOcean: number = 0.2;  // less for larger ocean
	public colorLand: THREE.Vector3 = new THREE.Vector3(0.036, 0.064, 0.034).multiplyScalar(2.239);  // sRGB #384937, albedo=0.1
	public colorMountain: THREE.Vector3 = new THREE.Vector3(0.136, 0.117, 0.072).multiplyScalar(1.569);  // sRGB #67604D, albedo=0.17
	public colorOcean: THREE.Vector3 = new THREE.Vector3(0.003, 0.023, 0.068).multiplyScalar(1.915);  // sRGB #132E4B, albedo=0.06

	// cloud-related
	public cloudAmount: number = 0;  // greater fo more clouds
	public cloudHeight: number = 2.4e3;  // unit: m

	// geometry-related
	public radius: number = Util.ConvertToUnits(6371e3);  // in OpenGL unit
	public axialTilt: number = Util.ConvertToRadians(23.5);  // unit: rad
	public selfRotSpeed: number = 0.001;  // unit: rad/frame


	Clone() : EarthParam {
		let result = new EarthParam();
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
	}

	Copy(other: EarthParam) : void {
		this.heightOcean = other.heightOcean;
		this.colorLand.copy(other.colorLand);
		this.colorMountain.copy(other.colorMountain);
		this.colorOcean.copy(other.colorOcean);
		this.cloudAmount = other.cloudAmount;
		this.cloudHeight = other.cloudHeight;
		this.radius = other.radius;
		this.axialTilt = other.axialTilt;
		this.selfRotSpeed = other.selfRotSpeed;
	}
}



export interface EarthTextures {
	fbm: THREE.CubeTexture;
	cloud: Noise.AnimatedCubeTexture;
	opticalDepth?: OpticalDepthTexture;
}



export class Earth extends Rendering.Renderable {
	private param: EarthParam;
	private paramAtmo: AtmosphericParam;
	private paramSun: SunParam;
	private textures: EarthTextures;

	private static readonly shaderVert: string = ShaderArchive.planet_vs;
	private static readonly shaderFrag: string =
		  ShaderArchive.brdf_tl
		+ ShaderArchive.color_tl
  		+ ShaderArchive.normal_tl
		+ ShaderArchive.cloud_tl
		+ ShaderArchive.scattering_tl
		+ ShaderArchive.planet_fs_part
		+ ShaderArchive.earth_fs_part;


	constructor(param: EarthParam, paramSun: SunParam, textures: EarthTextures) {
		super('Earth');

		this.param = param;
		this.paramAtmo = new AtmosphericParam();
		this.paramSun = paramSun;

		this.SetupTextures(textures);
	}

	private SetupTextures(textures: EarthTextures) : void {
		this.textures = {
			fbm: textures.fbm,
			cloud: textures.cloud,
			opticalDepth: textures.opticalDepth
		};
		if (typeof this.textures.opticalDepth === 'undefined')
			this.textures.opticalDepth = new OpticalDepthTexture(this.paramAtmo);
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let sphere = geoRepo.GetSphere();

		let surface = MeshHelper.CreateShaderMesh(
			'Earth',
			sphere,
			{ vertexShader: Earth.shaderVert, fragmentShader: Earth.shaderFrag }
		);
		surface.frustumCulled = false;

		return [
			surface,
			new CloudMesh(sphere),
			new TransmittanceMesh(sphere),
			new ScatteringMesh(sphere)
		];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		let param = this.param;
		let paramAtmo = this.paramAtmo;
		let paramSun = this.paramSun;
		let textures = this.textures;

		// to shorten code below....
		let optDepTexCoeffBase = new THREE.Vector2(OpticalDepthTexture.texSize - 1, 0.5).divideScalar(OpticalDepthTexture.texSize);
		let radiusSurface = paramAtmo.planetRadius;
		let radiusAtmo = radiusSurface + paramAtmo.thickness;
		let radiusCloud = radiusSurface + param.cloudHeight;

		return [
			new Rendering.UniformFulfillment('u_viewPos',		(uni, ctx) => uni.value = ctx.camera.getWorldPosition() ),
			new Rendering.UniformFulfillment('u_invModelMat',	(uni) => uni.value = new THREE.Matrix4().getInverse(this.objects[0].matrixWorld) ),
			new Rendering.UniformFulfillment('u_lightColor',	(uni) => uni.value = paramSun.temperature.GetPremultipliedColor() ),
			new Rendering.UniformFulfillment('u_lightDir',		(uni) => uni.value = paramSun.position.clone().normalize().negate() ),

			new Rendering.UniformFulfillment('t_noise',			(uni) => uni.value = textures.fbm ),
			new Rendering.UniformFulfillment('t_animNoise',		(uni) => uni.value = textures.cloud.GetFrontTexture() ),
			new Rendering.UniformFulfillment('u_texBlendTime',	(uni) => uni.value = textures.cloud.GetBlendingFactor() ),
			new Rendering.UniformFulfillment('t_opticalDepth',	(uni) => uni.value = textures.opticalDepth ),
			new Rendering.UniformFulfillment('u_optDepTexCoeff',(uni) => uni.value = new THREE.Vector3(
																			optDepTexCoeffBase.x / this.paramAtmo.maxAngle,
																			optDepTexCoeffBase.x / this.paramAtmo.thickness,
																			optDepTexCoeffBase.y
			) ),

			new Rendering.UniformFulfillment('u_radius',		(uni) => uni.value = param.radius ),
			new Rendering.UniformFulfillment('u_radiusAtmo',	(uni) => uni.value = param.radius / radiusSurface * radiusAtmo ),
			new Rendering.UniformFulfillment('u_radiusCloud',	(uni) => uni.value = param.radius / radiusSurface * radiusCloud ),

			new Rendering.UniformFulfillment('u_heightOcean',	(uni) => uni.value = param.heightOcean ),
			new Rendering.UniformFulfillment('u_cloudAmount',	(uni) => uni.value = param.cloudAmount ),
			new Rendering.UniformFulfillment('u_colorLand',		(uni) => uni.value = param.colorLand ),
			new Rendering.UniformFulfillment('u_colorMountain',	(uni) => uni.value = param.colorMountain ),
			new Rendering.UniformFulfillment('u_colorOcean',	(uni) => uni.value = param.colorOcean ),

			new Rendering.UniformFulfillment('u_planetRadius',	(uni) => uni.value = paramAtmo.planetRadius ),
			new Rendering.UniformFulfillment('u_cloudHeight',	(uni) => uni.value = param.cloudHeight ),  // the bottom of clouds
			new Rendering.UniformFulfillment('u_atmoThickness',	(uni) => uni.value = paramAtmo.thickness ),
		];
	}

	protected OnUpdatingUniform() : void {
		let [meshSurface, ...others] = this.objects;

		meshSurface.rotation.x = this.param.axialTilt;
		meshSurface.rotation.y += this.param.selfRotSpeed;
		meshSurface.updateMatrixWorld(true);
		others.forEach( (obj) => obj.rotation.copy(meshSurface.rotation) );
	}
}



}  // namespace Astro

