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



export class SimplePass extends Pass {

	constructor(renderables: RenderableList, geoRepo: Resource.GeometryRepo) {
		super(renderables, geoRepo);
	}

	RenderToBuffer(canvas: THREE.WebGLRenderer, camera: THREE.Camera, target: THREE.WebGLRenderTarget) : void {
		this.RenderWithContext( {
			renderer: canvas,
			camera: camera,
			dstBuffer: target
		} );		
	}

	RenderToScreen(canvas: THREE.WebGLRenderer, camera: THREE.Camera, src: THREE.WebGLRenderTarget) : void {
		this.RenderWithContext( {
			renderer: canvas,
			camera: camera,
			srcBuffer: src
		} );		
	}
}



}  // namespace Rendering

