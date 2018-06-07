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

/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="Renderable.ts" />



namespace Rendering {



export class Pass {
	protected renderables: RenderableList;
	protected scene: THREE.Scene;


	constructor(renderables: RenderableList, geoRepo: Resource.GeometryRepo) {
		this.scene = new THREE.Scene();
		this.renderables = renderables;
		this.renderables.forEach(
			(item) => item.GetRenderItems(geoRepo).forEach( (obj) => this.scene.add(obj) )
		);
	}

	protected RenderWithContext(drawCtx: DrawContext) : void {
		this.renderables.forEach( (item) => item.UpdateUniforms(drawCtx) );
		drawCtx.renderer.render(this.scene, drawCtx.camera, drawCtx.dstBuffer);
	}
}



}  // namespace Rendering

