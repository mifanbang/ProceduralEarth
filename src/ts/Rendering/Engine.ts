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

/// <reference path="../Astro/Earth.ts" />
/// <reference path="../Astro/MilkyWay.ts" />
/// <reference path="../Astro/Sun.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="../Util/Platform.ts" />
/// <reference path="SimplePass.ts" />


namespace Rendering {



class BufferRepo {
	color: THREE.WebGLRenderTarget;
	colorOne16th: THREE.WebGLRenderTarget;  // 1/16 in size
	histogram: THREE.WebGLRenderTarget;


	constructor(width: number, height: number) {
		this.CreateColorBuffers(width, height);
		this.CreateHistogramBuffer();
	}

	Resize(width: number, height: number) : void {
		this.color.setSize(width, height);
		this.colorOne16th.setSize(width >> 2, height >> 2);
	}

	private CreateColorBuffers(width: number, height: number) : void {
		let options: THREE.WebGLRenderTargetOptions = {
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
	}

	private CreateHistogramBuffer() : void {
		// TODO: would really like to have only one channel
		let options: THREE.WebGLRenderTargetOptions = {
			format: THREE.RGBAFormat,
			type: Util.GetPlatformFloatType(),
			stencilBuffer: false,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			magFilter: THREE.NearestFilter,
			minFilter: THREE.NearestFilter
		};

		this.histogram = new THREE.WebGLRenderTarget(ImgProc.Histogram.texSize, ImgProc.Histogram.texSize, options);
	}
}



export interface EngineData {
	canvas: THREE.WebGLRenderer;
	camera: THREE.PerspectiveCamera;

	paramEarth: Astro.EarthParam;
	paramSun: Astro.SunParam;
	paramMilkyWay: Astro.MilkyWayParam;
	paramPostEffect: PostEffect.Param;

	geometryRepo: Resource.GeometryRepo;
	rngSeed: number;
}



// view as in MVC
export class Engine {
	private data: EngineData;

	// shared resources
	private bufferRepo: BufferRepo;
	private texFBM: Noise.FBMTexture;  // for terrain
	private texFBMAnim: Noise.AnimatedFBMTexture;  // for cloud
	private texMilkyWay: Noise.FBMTexture;

	// rendering passes
	private passColor: SimplePass;
	private passPost: SimplePass;

	// image processing helpers
	private downScaler: ImgProc.DownScaler;
	private histogram: ImgProc.Histogram;
	private exposure: Exposure;

	private static readonly extensions: Array<string> = [
		'OES_standard_derivatives',
		'OES_texture_half_float',
		'OES_texture_half_float_linear',
		'OES_texture_float',
		'OES_texture_float_linear'
	];


	constructor(data: EngineData) {
		this.data = data;

		Engine.EnableExtensions(this.data.canvas, Engine.extensions);

		this.SetupRenderBuffers();
		this.SetupTextures();
		this.SetupRenderPasses();

		this.downScaler = new ImgProc.DownScaler(this.data.geometryRepo);
		this.histogram = new ImgProc.Histogram(this.data.geometryRepo);
		this.exposure = new Exposure();
	}

	Render() : void {
		this.UpdateTextureGenerators();
		this.RenderColorBuffer();
		this.UpdateEV();
		this.RenderFinalScreen();
	}

	OnResize(width: number, height: number) : void {
		this.bufferRepo.Resize(width, height);
	}

	private SetupRenderBuffers() : void {
		let domElem = this.data.canvas.domElement;
		this.bufferRepo = new BufferRepo(domElem.width, domElem.height);
	}

	private SetupTextures() : void {
		let paramFBM = new Noise.FBMTextureParam();
		paramFBM.rng = new Noise.RandomNumber(this.data.rngSeed);
		paramFBM.type = Noise.FBMType.BasicAndTerrain;
		paramFBM.freqScaler = 1.6;
		paramFBM.resolution = Engine.DetermineNoiseTexSize();
		this.texFBM = new Noise.FBMTexture(paramFBM, this.data.geometryRepo);

		// reusing $paramFBM
		paramFBM.type = Noise.FBMType.MilkyWay;
		paramFBM.displace1 = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(10);
		paramFBM.freqScaler = 2.6;
		this.texMilkyWay = new Noise.FBMTexture(paramFBM, this.data.geometryRepo, this.texFBM.GetGradient());

		let paramAnimFBM = new Noise.AnimatedFBMTextureParam();
		paramAnimFBM.resolution = paramFBM.resolution;
		paramAnimFBM.numIncreDraw = 64;
		paramAnimFBM.type = Noise.FBMType.ClousAnim;
		paramAnimFBM.freqScaler = 4;
		this.texFBMAnim = new Noise.AnimatedFBMTexture(paramAnimFBM, this.data.geometryRepo, this.texFBM.GetGradient());
	}

	private SetupRenderPasses() : void {
		let data = this.data;

		this.passColor = new SimplePass(
			[
				new Astro.MilkyWay(data.paramMilkyWay, this.texMilkyWay.GetTexture()),
				new Astro.Sun(data.paramSun),
				new Astro.Earth(data.paramEarth, data.paramSun, { fbm: this.texFBM.GetTexture(), cloud: this.texFBMAnim })
			],
			data.geometryRepo
		);

		this.passPost = new SimplePass( [new PostEffect.Renderable(data.paramPostEffect)], data.geometryRepo);
	}

	private UpdateTextureGenerators() : void {
		let canvas = this.data.canvas;

		if (!this.texFBM.IsReady())
			this.texFBM.UpdateFrame(canvas);
		else if (!this.texMilkyWay.IsReady())
			this.texMilkyWay.UpdateFrame(canvas);
		else
			this.texFBMAnim.UpdateFrame(canvas);
	}

	private RenderColorBuffer() : void {
		let canvas = this.data.canvas;
		let colorBuf = this.bufferRepo.color;

		canvas.clearTarget(colorBuf, true, true, false);
		this.passColor.RenderToBuffer(canvas, this.data.camera, colorBuf);
	}

	private UpdateEV() : void {
		let camera = this.data.camera;
		let canvas = this.data.canvas;
		let colorBufDownSampled = this.bufferRepo.colorOne16th;

		this.exposure.UpdateFrame();
		this.data.paramPostEffect.ev = this.data.paramPostEffect.autoExposure ? this.exposure.GetCurrentEV() : 0.0;
		if (Rendering.Manager.instance.GetFrameCount() % 12 === 0) {
			this.downScaler.Calculate(canvas, camera, this.bufferRepo.color, colorBufDownSampled);

			canvas.clearTarget(this.bufferRepo.histogram, true, true, false);
			let histogramData = this.histogram.Calculate(canvas, camera, colorBufDownSampled, this.bufferRepo.histogram);
			this.exposure.SetTarget(Exposure.CalculateEV(histogramData));
		}
	}

	private RenderFinalScreen() : void {
		this.passPost.RenderToScreen(this.data.canvas, this.data.camera, this.bufferRepo.color);
	}

	private static EnableExtensions(canvas: THREE.WebGLRenderer, extensions: Array<string>) : void {
		let extNotSupported = extensions.filter( (item) => canvas.context.getExtension(item) === null );
		if (extNotSupported.length > 0)
			throw new Error(['WebGL extensions \'', extNotSupported.join('\', \''), '\' are not supported by the browser'].join(''));
	}

	private static DetermineNoiseTexSize() : number {
		return Util.IsOnMobile() ? 512 : 1024;
	}
}



}  // namespace Rendering

