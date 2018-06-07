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
/// <reference path="RandomNumber.ts" />



namespace Noise {



export class GradientTexture {
	private noisePerm: Uint8Array;  // permutation of unique integers from 0 to 255
	private gradientData: Uint16Array;  // packed pre-computed gradients
	private texture: THREE.DataTexture;  // texture object holding this.gradientData
	private rng: RandomNumber;


	constructor(rng: RandomNumber) {
		this.rng = rng;

		this.noisePerm = new Uint8Array(256);
		for (let i = 0; i < 256; i++)
			this.noisePerm[i] = i;

		this.Repermute(this.noisePerm);
		this.gradientData = GradientTexture.GenerateGradientData(this.noisePerm);

		this.texture = new THREE.DataTexture(this.gradientData, 4096, 4096, THREE.RGBAFormat, <THREE.TextureDataType><number>THREE.UnsignedShort4444Type);  // cast
		this.texture.unpackAlignment = 4;
		this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
		this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;
		this.texture.generateMipmaps = false;
		this.texture.needsUpdate = true;
	}

	GetTexture() : THREE.DataTexture {
		return this.texture;
	}

	Regenerate() : void {
		this.Repermute(this.noisePerm);
		this.UpdateTexture(GradientTexture.GenerateGradientData(this.noisePerm));
	}

	private Repermute(noisePerm: Uint8Array) : void {
		// randomly re-permute
		for (let i = 0; i < 256; i++) {
			let swappedIndex = Math.floor(this.rng.Generate() * 256);
			let tmpVal = noisePerm[i];
			noisePerm[i] = noisePerm[swappedIndex];
			noisePerm[swappedIndex] = tmpVal;
		}
	}

	// reference to the result object is passed in as an argument instead of being returned due to performance issues on Firefox.
	// Firefox (even Quantium versions) has troubles constructing and destroying Vector3 so rapidly in GenerateGradientData().
	// by optimizing the performance of this function, all browsers will eventually benefit.
	private static EvalGradient(noise: number, result: THREE.Vector3) : void {
		noise &= 0x0F;
		let u = (noise<8 || noise==12 || noise==13 ? 1 : 2);
		let v = (noise<4 || noise==12 || noise==13 ? 2 : 3);

		u = ((noise & 1) ? -u : u);
		v = ((noise & 2) ? -v : v);

		// +1 to make negative elements positive
		result.set(
			(Math.abs(u) == 1 ? (u > 0 ? 1 : -1) : 0) + 1,
			(Math.abs(u) == 2 ? (u > 0 ? 1 : -1) : 0) + (Math.abs(v) == 2 ? (v > 0 ? 1 : -1) : 0) + 1,
			(Math.abs(v) == 3 ? (v > 0 ? 1 : -1) : 0) + 1
		);
	}

	private static GenerateGradientData(noisePerm: Uint8Array) : Uint16Array {
		let tmpGradient = new THREE.Vector3(0, 0, 0);

		// pre-compute the texture of gradients for all (x, y, z) where x, y, and z are in [0, 256).
		// each gradient is of form (l, m, n) where l, m, and n are all integers in [-1, 1].
		// however to avoid negative numbers, before the gradient is written to a texel, each component is added by 1.
		let precompGradient3D = new Uint16Array(256 * 256 * 256);
		for (let iz = 0; iz < 256; iz++) {
			let blockX = (iz & 0x0F);
			let blockY = iz >> 4;
			for (let iy = 0; iy < 256; iy++) {
				for (let ix = 0; ix < 256; ix++) {
					let indexBase = ((4095 - blockY * 256 - iy) * 4096 + (blockX * 256 + ix));

					let hashedIndex = ix;
					hashedIndex = ((noisePerm[hashedIndex] + iy) & 0xFF);
					hashedIndex = ((noisePerm[hashedIndex] + iz) & 0xFF);

					GradientTexture.EvalGradient(noisePerm[hashedIndex], tmpGradient);
					precompGradient3D[indexBase] = (tmpGradient.z << 12) + (tmpGradient.y << 8) + (tmpGradient.x << 4);
				}
			}
		}

		return precompGradient3D;
	}

	private UpdateTexture(data: Uint16Array) : void {
		this.gradientData.set(data);
		this.texture.needsUpdate = true;
	}
}



}  // namespace Noise

