/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Resource {



export class GeometryRepo {
	private sphere: THREE.Geometry;
	private sphereCoarse: THREE.Geometry;
	private cube: THREE.Geometry;
	private screenPlane: THREE.Geometry;


	constructor() {
		this.sphere = this.CreateSphere(100);
		this.sphereCoarse = this.CreateSphere(10);
		this.cube = this.CreateCube();
		this.screenPlane = this.CreateScreenPlane();
	}

	GetSphere() : THREE.Geometry {
		return this.sphere;
	}

	GetSphereCoarse() : THREE.Geometry {
		return this.sphereCoarse;
	}

	GetCube() : THREE.Geometry {
		return this.cube;
	}

	GetScreenPlane() : THREE.Geometry {
		return this.screenPlane;
	}

	private CreateSphere(numSegments: number) : THREE.Geometry {
		let sphere = new THREE.SphereGeometry(1, numSegments, numSegments);  // radius = 1
		return sphere;
	}

	private CreateCube() : THREE.Geometry {
		let cube = new THREE.BoxGeometry(1, 1, 1);
		return cube;
	}

	private CreateScreenPlane() : THREE.Geometry {
		let plane = new THREE.PlaneGeometry(2, 2);
		return plane;
	}
}



}  // namespace Resource

