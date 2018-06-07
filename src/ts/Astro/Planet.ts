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



namespace Astro {



// mapped to the macro 'MESH_TYPE' in shaders
export enum PlanetMeshType {
	Surface = 0,
	Atmosphere = 1,
	Cloud = 2
}



abstract class AtmosphereMeshBase extends THREE.Mesh {
	private static readonly shaderVert: string = ShaderArchive.planet_vs;


	constructor(type: PlanetMeshType, geometry: THREE.Geometry, fragShader: string) {
		super();

		this.SetupMesh(type, geometry, fragShader);
		this.SetupShader(<THREE.ShaderMaterial>this.material);  // cast
		this.frustumCulled = false;
	}

	private SetupMesh(type: PlanetMeshType, geometry: THREE.Geometry, fragShader: string) : void {
		this.geometry = geometry;

		let uniformNames = Rendering.ExtractUniformNames(AtmosphereMeshBase.shaderVert + fragShader);
		let material = new THREE.ShaderMaterial( {
			name: 'AtmosphereMesh',
			defines: { 'MESH_TYPE': type },
			transparent: true,
			uniforms: Rendering.BuildUniformSkeleton(uniformNames),
			vertexShader: AtmosphereMeshBase.shaderVert,
			fragmentShader: fragShader
		} );
		this.material = material;
	}

	protected abstract SetupShader(shaderMat: THREE.ShaderMaterial) : void;
}



export class TransmittanceMesh extends AtmosphereMeshBase {
	private static readonly shaderFrag: string = 
		  ShaderArchive.color_tl
		+ ShaderArchive.scattering_tl
		+ ShaderArchive.atmotransmittance_fs_part;


	constructor(geometry: THREE.Geometry) {
		super(PlanetMeshType.Atmosphere, geometry, TransmittanceMesh.shaderFrag);
	}

	protected SetupShader(shaderMat: THREE.ShaderMaterial) : void {
		shaderMat.blending = THREE.MultiplyBlending;
		shaderMat.depthTest = false;
	}
}



export class ScatteringMesh extends AtmosphereMeshBase {
	private static readonly shaderFrag: string =
		  ShaderArchive.color_tl
		+ ShaderArchive.scattering_tl
		+ ShaderArchive.cloud_tl
		+ ShaderArchive.atmoscattering_fs_part;


	constructor(geometry: THREE.Geometry) {
		super(PlanetMeshType.Atmosphere, geometry, ScatteringMesh.shaderFrag);
	}

	protected SetupShader(shaderMat: THREE.ShaderMaterial) : void {
		shaderMat.blending = THREE.AdditiveBlending;
		shaderMat.depthTest = false;
	}
}



export class CloudMesh extends AtmosphereMeshBase {
	private static readonly shaderFrag: string =
		  ShaderArchive.brdf_tl
		+ ShaderArchive.color_tl
  		+ ShaderArchive.normal_tl
		+ ShaderArchive.scattering_tl
		+ ShaderArchive.cloud_tl
		+ ShaderArchive.cloud_fs_part;


	constructor(geometry: THREE.Geometry) {
		super(PlanetMeshType.Cloud, geometry, CloudMesh.shaderFrag);
	}

	protected SetupShader(shaderMat: THREE.ShaderMaterial) : void {
		shaderMat.extensions.derivatives = true;
		shaderMat.depthTest = false;
	}
}



}  // namespace Astro

