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



export class CubeMapPass extends Pass {

	constructor(renderables: RenderableList, geoRepo: Resource.GeometryRepo) {
		super(renderables, geoRepo);
	}

	Render(renderer: THREE.WebGLRenderer, cubeCamera: THREE.CubeCamera) : void {
		let context = new DrawContext();
		context.renderer = renderer;

		this.renderables.forEach( (item) => item.UpdateUniforms(context) );
		cubeCamera.updateCubeMap(renderer, this.scene);
	}
}



}  // namespace Rendering

