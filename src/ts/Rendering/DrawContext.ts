/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Rendering {



export class DrawContext {
	public renderer: THREE.WebGLRenderer;
	public camera: THREE.Camera;
	public srcBuffer?: THREE.WebGLRenderTarget;
	public dstBuffer?: THREE.WebGLRenderTarget;
}



}  // namespace Rendering

