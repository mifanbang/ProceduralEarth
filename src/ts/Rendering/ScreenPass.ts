/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="Pass.ts" />



namespace Rendering {



export class ScreenPass extends Pass {

	constructor(renderable: Rendering.Renderable, geoRepo: Resource.GeometryRepo) {
		super([ renderable ], geoRepo);
	}

	Render(canvas: THREE.WebGLRenderer, camera: THREE.Camera, src: THREE.WebGLRenderTarget, target: THREE.WebGLRenderTarget) : void {
		this.RenderWithContext( {
			renderer: canvas,
			camera: camera,
			srcBuffer: src,
			dstBuffer: target
		} );		
	}
}



}  // namespace Rendering

