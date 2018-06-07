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
/// <reference path="../Rendering/ScreenPass.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />



namespace ImgProc {



class DownScalerRenderable extends Rendering.Renderable {
	private static readonly shaderVert: string = ShaderArchive.posteffect_vs;
	private static readonly shaderFrag: string = ShaderArchive.downscaler_fs;


	constructor() {
		super('ImgProc.DownScaler');
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let shaderParams = {
			vertexShader: DownScalerRenderable.shaderVert,
			fragmentShader: DownScalerRenderable.shaderFrag,
			defines: {
				'SCALER': DownScaler.scaler + 1e-7  // add an epsilon to force THREE.js treat it as float
			}
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



export class DownScaler {
	private static sharedPass: Rendering.ScreenPass;

	public static readonly scaler: number = 4;


	constructor(geoRepo: Resource.GeometryRepo) {
		if (typeof DownScaler.sharedPass === 'undefined')
			this.InitSharedPass(geoRepo);
	}

	Calculate(renderer: THREE.WebGLRenderer, camera: THREE.Camera, src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget) : void {
		DownScaler.sharedPass.Render(renderer, camera, src, dst);
	}

	private InitSharedPass(geoRepo: Resource.GeometryRepo) : void {
		let renderable = new DownScalerRenderable();
		DownScaler.sharedPass = new Rendering.ScreenPass(renderable, geoRepo);
	}
}



}  // namespace Renderong

