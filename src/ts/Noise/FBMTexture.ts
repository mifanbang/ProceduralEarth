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

/// <reference path="../Rendering/CubeMapPass.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="GradientTexture.ts" />



namespace Noise {



class IncrementalCounter {
	private nStep: number;
	private currStep: number;


	constructor(nStep: number, hasFinished?: boolean) {
		this.nStep = Math.floor(nStep);
		if (this.nStep < 1)
			throw new Error("#step must be >= 1");
		this.currStep = (hasFinished === undefined ? 0 : nStep);
	}

	HasFinished() : boolean {
		return this.currStep === this.nStep;
	}

	GetCurrentCount() : number {
		return this.currStep;
	}

	Step() : number {
		return this.currStep = Math.min(this.currStep + 1, this.nStep);
	}

	Reset() : void {
		this.currStep = 0;
	}
}



export enum FBMType {
	BasicAndTerrain = 1,
	ClousAnim,
	MilkyWay
}



export class FBMTextureParam {
	public resolution: number = 512;
	public type: FBMType = FBMType.BasicAndTerrain;
	public numIncreDraw: number = 16;  // must be 2^even_num
	public displace1: THREE.Vector3 = new THREE.Vector3(1.68, 54.38, 3.14);
	public displace2: THREE.Vector3 = new THREE.Vector3(1.68, 54.38, 3.14);
	public freqScaler: number = 1;
	public rng: RandomNumber = new RandomNumber();


	Clone() : FBMTextureParam {
		let result = new FBMTextureParam();
		result.resolution = this.resolution;
		result.type = this.type;
		result.numIncreDraw = this.numIncreDraw;
		result.displace1 = this.displace1.clone();
		result.displace2 = this.displace2.clone();
		result.freqScaler = this.freqScaler;
		result.rng = this.rng.Clone();
		return result;
	}
}



class FBMTextureRenderable extends Rendering.Renderable {
	// all immutable
	private param: FBMTextureParam;
	private drawCounter: IncrementalCounter;
	private texGradient: GradientTexture;
	private texPrevFbm: FBMTexture | undefined;

	private static readonly shaderVert: string = ShaderArchive.fbm_vs;
	private static readonly shaderFrag: string = ShaderArchive.color_tl + ShaderArchive.fbm_fs;


	constructor(param: FBMTextureParam, drawCounter: IncrementalCounter, texGradient: GradientTexture) {
		super('Noise.FBMTexture');

		this.param = param;
		this.drawCounter = drawCounter;
		this.texGradient = texGradient;
		this.texPrevFbm = undefined;
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let params = {
			defines: { 'FBM_GEN_TYPE': this.param.type },
			vertexShader: FBMTextureRenderable.shaderVert,
			fragmentShader: FBMTextureRenderable.shaderFrag,
			side: THREE.BackSide  // camera is inside the cube
		};
		let mesh = MeshHelper.CreateShaderMesh(this.name, geoRepo.GetCube(), params);
		return [ mesh ];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		// For cloud textures, 't_prevFbm' should be bound to an existing cubemap
		// from the beginning or Chrome will issue errors stating that the
		// identical texture array is bound to both input and output at the same
		// time. This browser behavior is not observed on Firefox.
		return [
			new Rendering.UniformFulfillment('t_gradients',		(uni) => uni.value = this.texGradient.GetTexture() ),
			new Rendering.UniformFulfillment('t_prevFbm',		(uni) => uni.value = this.texPrevFbm ? this.texPrevFbm.GetTexture() : undefined ),
			new Rendering.UniformFulfillment('u_usePrevFbm',	(uni) => uni.value = this.texPrevFbm ? this.texPrevFbm.IsReady() : false ),
			new Rendering.UniformFulfillment('u_currGridCell',	(uni) => uni.value = this.GetGridCellCoord(this.drawCounter.GetCurrentCount()) ),
			new Rendering.UniformFulfillment('u_displace1',		(uni) => uni.value = this.param.displace1 ),
			new Rendering.UniformFulfillment('u_displace2',		(uni) => uni.value = this.param.displace2 ),
			new Rendering.UniformFulfillment('u_freqScaler',	(uni) => uni.value = this.param.freqScaler )
		];
	}

	protected OnUpdatingUniform() : void {
	}

	SetPrevFBMTex(texPrevFbm: FBMTexture) : void {
		this.texPrevFbm = texPrevFbm;
	}

	private GetGridCellCoord(index: number) : THREE.Vector4 {
		let result = new THREE.Vector4();

		let root = Math.round(Math.sqrt(this.param.numIncreDraw));  // also =#row and =#col
		let log = Math.round(Math.log2(root));

		// x-coord
		result.x = (index & (root-1));
		result.y = result.x + 1;

		// y-coord
		result.z = (index >> log);
		result.w = result.z + 1;

		result.multiplyScalar(this.param.resolution / root);
		return result;
	}
}



export class FBMTexture {
	private texGradient: GradientTexture;
	private param: FBMTextureParam;
	private renderable: FBMTextureRenderable;
	private cubeCamera: THREE.CubeCamera;
	private drawCounter: IncrementalCounter;
	private lastDrawStamp: number;  // time stamp
	private pass: Rendering.CubeMapPass;


	constructor(param: FBMTextureParam, geoRepo: Resource.GeometryRepo, texGradient?: GradientTexture) {
		this.param = param.Clone();
		this.texGradient = (typeof texGradient === 'undefined' ? new GradientTexture(this.param.rng) : texGradient);

		this.CreateCubeCamera();

		this.drawCounter = new IncrementalCounter(this.param.numIncreDraw);
		this.lastDrawStamp = 0;

		this.renderable = new FBMTextureRenderable(this.param, this.drawCounter, this.texGradient);
		this.pass = new Rendering.CubeMapPass([ this.renderable ], geoRepo);
	}

	Regenerate(renderer: THREE.WebGLRenderer) : void {
		this.drawCounter.Reset();

		this.UpdateFrame(renderer);
	}

	UpdateFrame(renderer: THREE.WebGLRenderer) : void {
		if (this.drawCounter.HasFinished())
			return;

		let currStamp = Rendering.Manager.instance.GetFrameCount();
		if (currStamp === this.lastDrawStamp) {
			console.log('warning: multiple invocations of FBMTexture.UpdateFrame() in a frame');
			return;
		}
		this.lastDrawStamp = currStamp;

		this.pass.Render(renderer, this.cubeCamera);
		this.drawCounter.Step();
	}

	SetDisplace(index: 0 | 1, vec: THREE.Vector3) : void {
		(index === 0 ? this.param.displace1 : this.param.displace2).copy(vec);
	}

	GetDisplace(index: 0 | 1) : THREE.Vector3 {
		return (index === 0 ? this.param.displace1 : this.param.displace2).clone();
	}

	SetPrevFBMTex(texPrevFbm: FBMTexture) : void {
		this.renderable.SetPrevFBMTex(texPrevFbm);
	}

	GetTexture() : THREE.CubeTexture {
		return <THREE.CubeTexture>this.cubeCamera.renderTarget.texture;  // cast
	}

	GetGradient() : GradientTexture {
		return this.texGradient;
	}

	IsReady() : boolean {
		return this.drawCounter.HasFinished();
	}

	private CreateCubeCamera() : void {
		this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.param.resolution);

		// HACK: CubeCamera's interface does not accept options, so we re-assign a new one.
		let renderTargetOptions: THREE.WebGLRenderTargetOptions = {
			depthBuffer: false,
			stencilBuffer: false,
			format: THREE.RGBAFormat,
			type: THREE.UnsignedByteType,
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter
		};
		this.cubeCamera.renderTarget = new THREE.WebGLRenderTargetCube(
			this.param.resolution,
			this.param.resolution,
			renderTargetOptions
		);
	}
}



}  // namespace Noise

