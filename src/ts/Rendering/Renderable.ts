/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />



namespace Rendering {



export type RenderItemList = Array<THREE.Mesh | THREE.Points>;



export abstract class Renderable {
	protected name: string;
	protected objects: RenderItemList;

	private uniBindings: Array<UniformBinding>;


	constructor(name: string) {
		this.name = name;
	}

	GetRenderItems(geoRepo: Resource.GeometryRepo) : RenderItemList {
		if (typeof this.objects === 'undefined' || typeof this.uniBindings === 'undefined')
			this.Init(geoRepo);

		return this.objects;
	}

	UpdateUniforms(drawCtx: DrawContext) : void {
		this.OnUpdatingUniform();
		this.uniBindings.forEach( (binding) => binding.Update(drawCtx) );
	}

	private Init(geoRepo: Resource.GeometryRepo) : void {
		this.objects = this.CreateRenderItems(geoRepo);

		let fulfillments = this.GetUniformFulfillments();
		this.uniBindings = [];
		this.objects.forEach( (obj) => this.uniBindings.push(
			Rendering.CreateBindingOrThrow(this.name, <THREE.ShaderMaterial>obj.material, fulfillments)
		) );
	}

	protected abstract OnUpdatingUniform() : void;
	protected abstract CreateRenderItems(geoRepo: Resource.GeometryRepo) : RenderItemList;
	protected abstract GetUniformFulfillments() : UniFulList;
}



export type RenderableList = Array<Rendering.Renderable>;



}  // namespace Renderong

