/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Generated/ShaderArchive.ts" />
/// <reference path="../Helper/MeshHelper.ts" />
/// <reference path="../Rendering/ScreenPass.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />



namespace ImgProc {



class HistogramRenderable extends Rendering.Renderable {
	private static readonly shaderVert: string = ShaderArchive.color_tl + ShaderArchive.histogram_vs_part;
	private static readonly shaderFrag: string = ShaderArchive.histogram_fs;


	constructor() {
		super('ImgProc.Histogram');
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let shaderParams = {
			transparent: true,  // only to enable blending
			vertexShader: HistogramRenderable.shaderVert,
			fragmentShader: HistogramRenderable.shaderFrag,
			defines: {
				'BUCKET_SIZE': Histogram.bucketSize + 1e-7,  // add an epsilon to force THREE.js treat it as float
				'OUTPUT_SIZE': Histogram.texSize + 1e-1
			}
		}
		let points = MeshHelper.CreateShaderPoints(this.name, HistogramRenderable.CreateGPGPUVertices(), shaderParams);

		// can only be set this way :\
		points.material.blending = THREE.AdditiveBlending;
		points.material.depthTest = false;
		return [ points ];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		return [
			new Rendering.UniformFulfillment('t_color',		(uni, ctx) => uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0 ),
			new Rendering.UniformFulfillment('u_invImgSize',(uni, ctx) => uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0)
		];
	}

	protected OnUpdatingUniform() : void {
	}

	private static CreateGPGPUVertices() : THREE.BufferGeometry {
		// vertex position format: (u, v, 0), where (u, v) is of [-sampleWindowSize/2, sampleWindowSize/2)^2 for sampling color buffer
		// TODO: must use at least 3 channels because THREE.js will try to calculate bounding sphere anyway...
		let dataVertices = new Float32Array(Histogram.numSamples * 3);
		let linearIdx = 0;
		for (let i = 0; i < Histogram.sampleWindowSize; ++i) {
			for (let j = 0; j < Histogram.sampleWindowSize; ++j) {
				dataVertices[linearIdx]		= j - Histogram.sampleWindowSize / 2;  // map to [-sampleWindowSize/2, sampleWindowSize/2)
				dataVertices[linearIdx + 1]	= i - Histogram.sampleWindowSize / 2;
				linearIdx += 3;
			}
		}

		let geo = new THREE.BufferGeometry();
		geo.addAttribute('position', new THREE.BufferAttribute(dataVertices, 3));
		return geo;
	}
}



class ToUintConverterRenderable extends Rendering.Renderable {
	private static readonly shaderVert: string = ShaderArchive.posteffect_vs;
	private static readonly shaderFrag: string = ShaderArchive.color_tl + ShaderArchive.uintconvert_fs_part;


	constructor() {
		super('ImgProc.FloatToUintConverter');
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let shaderParams = {
			vertexShader: ToUintConverterRenderable.shaderVert,
			fragmentShader: ToUintConverterRenderable.shaderFrag
		}
		return [
			MeshHelper.CreateShaderMesh(this.name, geoRepo.GetScreenPlane(), shaderParams)
		];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		return [
			new Rendering.UniformFulfillment('t_srcImg',		(uni, ctx) => uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0 ),
			new Rendering.UniformFulfillment('u_invSrcImgSize',	(uni, ctx) => uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0)
		];
	}

	protected OnUpdatingUniform() : void {
	}
}



class HistogramResources {
	public passHistogram: Rendering.ScreenPass;
	public passToUint: Rendering.ScreenPass;

	// because iPhone cannot read half-float textures, we have to render to a uint texture before reading its content
	public uintTex: THREE.WebGLRenderTarget;
}



export class Histogram {
	private static sharedResources: HistogramResources;

	public static readonly texSize: number = 16;  // size of the histogram texture
	public static readonly numBuckets: number = Histogram.texSize * Histogram.texSize;
	public static readonly sampleWindowSize: number = 128;  // size of the sampling area in color buffer
	public static readonly numSamples: number = Histogram.sampleWindowSize * Histogram.sampleWindowSize;
	public static readonly bucketSize: number = 8;  // each buck is 2^(1/bucketSize) wide


	constructor(geoRepo: Resource.GeometryRepo) {
		if (typeof Histogram.sharedResources === 'undefined')
			this.InitStaticResources(geoRepo);
	}

	Calculate(renderer: THREE.WebGLRenderer, camera: THREE.Camera, src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget) : Float32Array {
		// GPU compute
		Histogram.sharedResources.passHistogram.Render(renderer, camera, src, dst);

		// read dst
		let dstRawDataSize = dst.width * dst.height * 4;
		let dstData = new Uint8Array(dstRawDataSize);
		Histogram.sharedResources.passToUint.Render(renderer, camera, dst, Histogram.sharedResources.uintTex);
		renderer.readRenderTargetPixels(Histogram.sharedResources.uintTex, 0, 0, Histogram.texSize, Histogram.texSize, dstData);

		return Histogram.PostProcessHistogram(dstData);
	}

	private InitStaticResources(geoRepo: Resource.GeometryRepo) : void {
		Histogram.sharedResources = new HistogramResources();

		let renHistogram = new HistogramRenderable();
		Histogram.sharedResources.passHistogram = new Rendering.ScreenPass(renHistogram, geoRepo);

		let renToUintConverter = new ToUintConverterRenderable();
		Histogram.sharedResources.passToUint = new Rendering.ScreenPass(renToUintConverter, geoRepo);

		let options: THREE.WebGLRenderTargetOptions = {
			format: THREE.RGBAFormat,
			type: THREE.UnsignedByteType,
			stencilBuffer: false,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			magFilter: THREE.NearestFilter,
			minFilter: THREE.NearestFilter
		};
		Histogram.sharedResources.uintTex = new THREE.WebGLRenderTarget(Histogram.texSize, Histogram.texSize, options);
	}

	static PostProcessHistogram(rawData: Uint8Array) : Float32Array {
		let result = new Float32Array(rawData.length >> 2);
		result.forEach( (val, idx, arr) => {
			arr[idx] = rawData[idx << 2]
				| (rawData[(idx << 2) + 1] << 8)
				| (rawData[(idx << 2) + 2] << 16);
		} );

		let sumSamples = result.reduce( (sum, val) => val + sum );  // for normalization
		if (sumSamples === 0) {
			// when no presence of valid samples, we fake the histogram with only one sample in the first bucket
			result[0] = 1;
			sumSamples = 1;
		}

		let normalFactor = 1 / sumSamples;
		return result.map( (val) => val * normalFactor );
	}
/*
	private static ConvertHalfArrayToFloat(halfArr: Uint16Array) : Float32Array {
		let result = new Float32Array(halfArr.length);
		halfArr.forEach( (val, idx) => {
			let sign = (val >> 15);
			let expo = (val >> 10 & 0x1F);  // 5 bits
			let mantissa = (val & 0x3FF);  // 10 bits
			result[idx] = (sign === 0 ? 1 : -1) * Math.pow(2, expo - 15) * (1 + mantissa / 0x400);  // bias = 2^(expo_bits - 1) - 1
		} );
		return result;
	}
*/
	static FindIndex(data: Float32Array, percentage: number) : number {
		percentage = Math.max(Math.min(percentage, 1) , 0);  // clamp

		let sum = 0;
		let index = data.findIndex( (val) => (sum += val) >= percentage - 1e-6 );
		return index >= 0 ? index : data.length - 1;  // when $index is -1, the histogram may not be correctly normalized
	}
}



}  // namespace Renderong

