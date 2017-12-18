/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Generated/AirMassData.ts" />



namespace Astro {



export class OpticalDepthTexture extends THREE.DataTexture {
	public static readonly texSize: number = AirMassData.texSize;


	constructor(param: AtmosphericParam) {
		let rawData = OpticalDepthTexture.EvalOpticalDepth(AirMassData.texData, param.betaRayleigh);

		super(rawData, OpticalDepthTexture.texSize, OpticalDepthTexture.texSize, THREE.RGBFormat, THREE.FloatType);
		this.wrapS = THREE.ClampToEdgeWrapping;
		this.wrapT = THREE.ClampToEdgeWrapping;
		this.magFilter = THREE.LinearFilter;
		this.minFilter = THREE.LinearFilter;
		this.generateMipmaps = false;
		this.needsUpdate = true;
	}

	private static EvalOpticalDepth(airmass: Float32Array, betaRayleigh: THREE.Vector3) : Float32Array {
		let result = new Float32Array(airmass.length);

		let opticalDepth = new THREE.Vector3();
		let numTexel = OpticalDepthTexture.texSize * OpticalDepthTexture.texSize;
		for (let i = 0; i < numTexel; ++i) {
			opticalDepth.copy(betaRayleigh);
			opticalDepth.multiplyScalar(-airmass[i * 3]);  // not exactly "optical depth" because we pre-negate it
			result[i * 3] = opticalDepth.x;
			result[i * 3 + 1] = opticalDepth.y;
			result[i * 3 + 2] = opticalDepth.z;
		}

		return result;
	}
}



}  // namespace Astro

