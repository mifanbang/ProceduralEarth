/**
 * This file is a part of ProceduralEarth.
 *
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017-2018 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Generated/ShaderArchive.ts" />
/// <reference path="../Helper/MeshHelper.ts" />
/// <reference path="../Rendering/Renderable.ts" />
/// <reference path="../Rendering/Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="../Util/UnitConv.ts" />



namespace Astro {



class LocalArmStars extends THREE.Points {
	public static readonly numStars: number = 5e4;


	constructor() {
		super(LocalArmStars.CreateGeometry(), LocalArmStars.CreateMaterial());
	}

	private static CreateGeometry() : THREE.Geometry {
		let geometry = new THREE.Geometry();

		geometry.vertices = new Array<THREE.Vector3>(LocalArmStars.numStars);
		for (let i = 0; i < LocalArmStars.numStars; ++i)
			geometry.vertices[i] = LocalArmStars.CreateSamplePosition(Math.random(), Math.random()).multiplyScalar(1e16);

		geometry.colors = new Array<THREE.Color>(LocalArmStars.numStars);
		for (let i = 0; i < LocalArmStars.numStars; ++i)
			geometry.colors[i] = LocalArmStars.CreateSampleColor(Math.random(), Math.random());

		return geometry;
	}

	private static CreateMaterial() : THREE.Material {
		let material = new THREE.ShaderMaterial( {
			name: 'LocalArmStars',
			vertexShader: ShaderArchive.star_vs,
			fragmentShader: ShaderArchive.vertexcolor_fs,
			vertexColors: THREE.VertexColors
		} );

		return material;
	}

	// (x, y) is in [0, 1]^2
	private static CreateSamplePosition(x: number, y: number) : THREE.Vector3 {
		let phi = x * Math.PI * 2;  // phi: [0, 2*PI]
		let theta = Math.acos(y * 2 - 1);  // theta: [0, PI]

		return new THREE.Vector3(
			Math.sin(theta) * Math.cos(phi),
			Math.sin(theta) * Math.sin(phi),
			Math.cos(theta)
		);
	}

	// (x, y) is in [0, 1]^2
	private static CreateSampleColor(x: number, y: number) : THREE.Color {
		// REF: http://www.jstor.org/stable/40710095 (P.104 for magnitude, P.115 for color)
		// REF: https://en.wikipedia.org/wiki/Apparent_magnitude
		const probType = [0.12, 0.43, 0.55, 0.65, 0.93, 1];  // order: BAFGKM, individual probabilities: [0.12, 0.31, 0.12, 0.10, 0.28, 0.07]
		const probBrightness = [0.0004, 0.0020, 0.0077, 0.0272, 0.0925, 0.3072, 1];  // m = 0~6, idv prob: [0.0004, 0.0016, 0.0057, 0.0195, 0.0653, 0.2146, 0.6928] 

		// REF: http://www.vendian.org/mncharity/dir3/starcolor/
		const stellarColors: Array<THREE.Color> = [
			new THREE.Color(0.410, 0.530, 1),  // B
			new THREE.Color(0.599, 0.687, 1),  // A
			new THREE.Color(0.941, 0.932, 1),  // F
			new THREE.Color(1, 0.908, 0.828),  // G
			new THREE.Color(1, 0.652, 0.364),  // K
			new THREE.Color(1, 0.612, 0.160)  // M
		];

		let GreaterEqual = (target: number) => ( (val: number) : boolean => val >= target );
		let GetTypeIndex = (val: number) : number => probType.findIndex( GreaterEqual(val) );
		let GetBrightnessIndex = (val: number) : number => probBrightness.findIndex( GreaterEqual(val) );

		let type = GetTypeIndex(x);
		let brightness = Math.pow(2.512, -GetBrightnessIndex(y));  // dLg=100^(0.2*dM) => 100^0.2=2.512
		return stellarColors[type].clone().multiplyScalar(brightness);
	}
}



// just for the Milky Way on the Celestial Sphere, not necessarily a sphere
class MilkyWaySphere extends THREE.Mesh {
	private static readonly shaderVert: string = ShaderArchive.background_vs;
	private static readonly shaderFrag: string = ShaderArchive.color_tl + ShaderArchive.milkyway_fs;


	constructor(geoRepo: Resource.GeometryRepo) {
		let mesh = MeshHelper.CreateShaderMesh(
			'MilkyWaySphere',
			geoRepo.GetScreenPlane(),
			{ vertexShader: MilkyWaySphere.shaderVert, fragmentShader: MilkyWaySphere.shaderFrag }
		);
		super(<THREE.Geometry>mesh.geometry, mesh.material);
		this.frustumCulled = false;
	}
}



export class MilkyWayParam {
	public distToCenter: number = 8.0;  // unic: kpc
	public rhoZero: number = 1e-3;
	public gasDensity: number = 7;
	public angleToOrbit: number = 60;  // unit: deg


	Clone() : MilkyWayParam {
		let result = new MilkyWayParam();
		result.distToCenter = this.distToCenter;
		result.rhoZero = this.rhoZero;
		result.gasDensity = this.gasDensity;
		result.angleToOrbit = this.angleToOrbit;
		return result;
	}

	Copy(other: MilkyWayParam) : void {
		this.distToCenter = other.distToCenter;
		this.rhoZero = other.rhoZero;
		this.gasDensity = other.gasDensity;
		this.angleToOrbit = other.angleToOrbit;
	}
}



export class MilkyWay extends Rendering.Renderable {
	private param: MilkyWayParam;
	private texFBM: THREE.CubeTexture;


	constructor(param: MilkyWayParam, texFBM: THREE.CubeTexture) {
		super('MilkyWay');

		this.param = param;
		this.texFBM = texFBM;
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		return [
			new MilkyWaySphere(geoRepo),
			new LocalArmStars()
		];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		return [
			new Rendering.UniformFulfillment('t_noise',				(uni) => uni.value = this.texFBM ),
			new Rendering.UniformFulfillment('u_inverseProjView',	(uni, ctx) => {
				let matPV = ctx.camera.projectionMatrix.clone()
					.multiply(ctx.camera.matrixWorldInverse)
					.multiply( new THREE.Matrix4().makeRotationX(Util.ConvertToRadians(this.param.angleToOrbit)) );
				uni.value = new THREE.Matrix4().getInverse(matPV);
			} ),
			// handle the angle between orbits of Earth and the Sun
			new Rendering.UniformFulfillment('u_galacticCamPos',	(uni, ctx) => uni.value = new THREE.Vector3()
				.setFromMatrixPosition(ctx.camera.matrixWorld)
				.applyMatrix4( new THREE.Matrix4().makeRotationX(Util.ConvertToRadians(-this.param.angleToOrbit)) )
			),
			new Rendering.UniformFulfillment('u_distToGalacticCenter',	(uni) => uni.value = this.param.distToCenter ),
			new Rendering.UniformFulfillment('u_rhoZero',			(uni) => uni.value = this.param.rhoZero ),
			new Rendering.UniformFulfillment('u_densityGas',		(uni) => uni.value = this.param.gasDensity )
		];
	}

	protected OnUpdatingUniform() : void {
	}
}



}  // namespace Astro


