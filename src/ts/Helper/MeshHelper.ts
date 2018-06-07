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

/// <reference path="../Rendering/Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />



class MeshHelper {

	private static CreateMaterial(name: string, shaderParams: THREE.ShaderMaterialParameters) : THREE.ShaderMaterial {
		let paramsCopy: THREE.ShaderMaterialParameters = Object.create(shaderParams);

		// validation
		if (typeof paramsCopy.vertexShader === 'undefined' || typeof paramsCopy.fragmentShader === 'undefined')
			throw new Error(['shader "', name, '" has undefined source code'].join(''));

		// overwrite some properties
		let uniformNames = Rendering.ExtractUniformNames(<string>paramsCopy.vertexShader + paramsCopy.fragmentShader);  // cast. we checked.
		paramsCopy.uniforms = Rendering.BuildUniformSkeleton(uniformNames);
		paramsCopy.name = name;

		let material = new THREE.ShaderMaterial(paramsCopy);
		material.extensions.derivatives = true;  // always enable derivative

		return material;
	}

	static CreateShaderMesh(name: string, geometry: THREE.Geometry, shaderParams: THREE.ShaderMaterialParameters) : THREE.Mesh {
		let material = MeshHelper.CreateMaterial(name, shaderParams);
		let mesh = new THREE.Mesh(geometry, material);
		mesh.frustumCulled = false;  // always disable frustum culling
		return mesh;
	}

	static CreateShaderPoints(name: string, geometry: THREE.BufferGeometry, shaderParams: THREE.ShaderMaterialParameters) : THREE.Points {
		let material = MeshHelper.CreateMaterial(name, shaderParams);
		let mesh = new THREE.Points(geometry, material);
		mesh.frustumCulled = false;  // always disable frustum culling
		return mesh;
	}
}

