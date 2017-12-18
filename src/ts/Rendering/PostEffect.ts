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
/// <reference path="../Rendering/Renderable.ts" />
/// <reference path="../Rendering/Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />



namespace PostEffect {



export class Param {
	public ev: number = -0.7;
	public autoExposure: boolean = true;


	Copy(other: Param) : void {
		this.ev = other.ev;
		this.autoExposure = other.autoExposure;
	}
}



export class Renderable extends Rendering.Renderable {
	private param: Param;

	private static readonly shaderVert: string = ShaderArchive.posteffect_vs;
	private static readonly shaderFrag: string = ShaderArchive.color_tl + ShaderArchive.posteffect_fs_part;


	constructor(param: Param) {
		super('PostEffect');

		this.param = param;
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let mesh = MeshHelper.CreateShaderMesh(
			this.name,
			geoRepo.GetScreenPlane(),
			{ vertexShader: PostEffect.Renderable.shaderVert, fragmentShader: PostEffect.Renderable.shaderFrag }
		);
		return [ mesh ];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		return [
			new Rendering.UniformFulfillment('u_random',	(uni) => uni.value = new THREE.Vector2(Math.random(), Math.random()).multiplyScalar(5) ),
			new Rendering.UniformFulfillment('t_color',		(uni, ctx) => uni.value = ctx.srcBuffer ? ctx.srcBuffer.texture : 0 ),
			new Rendering.UniformFulfillment('u_invImgSize',(uni, ctx) => uni.value = ctx.srcBuffer ? new THREE.Vector2(1 / ctx.srcBuffer.width, 1 / ctx.srcBuffer.height) : 0 ),
			new Rendering.UniformFulfillment('u_exposure',	(uni) => uni.value = Math.pow(10, this.param.ev) )
		];
	}

	protected OnUpdatingUniform() : void {
	}
}



}  // namespace PostEffect

