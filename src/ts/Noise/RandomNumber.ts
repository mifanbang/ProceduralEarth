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


namespace Noise {



// a linear congruential generator
export class RandomNumber {
	private multiplier: number;
	private increment: number;
	private modulus: number;
	private lastVal: number;


	constructor(seed?: number) {
		if (typeof seed === 'undefined')
			seed = Date.now();
		this.lastVal = Math.abs(Math.round(seed));

		// REF: https://en.wikipedia.org/wiki/Linear_congruential_generator
		// use the glibc paramters
		this.multiplier = 1103515245;
		this.increment = 12345;
		this.modulus = 0x7FFFFFFF;  // operator << will result a signed int32 so don't use (1<<31)-1
	}

	// range [0, 1)
	Generate() : number {
		let newVal = Math.round((this.multiplier * this.lastVal + this.increment) % this.modulus);
		this.lastVal = (newVal & 0x7FFFFFFF);
		return newVal / this.modulus;
	}

	Clone() : RandomNumber {
		return new RandomNumber(this.lastVal);
	}
}



}  // namespace Noise

