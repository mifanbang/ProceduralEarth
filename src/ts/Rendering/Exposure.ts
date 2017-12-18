/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Rendering {



export class Exposure {
	private minEV: number = -2;
	private maxEV: number = 2;
	private adjustSpeed: number = 0.02;

	private currentEV: number = 0;
	private targetEV: number = 0;


	UpdateFrame() : void {
		let absDeltaEV = Math.abs(this.targetEV - this.currentEV);
		absDeltaEV = Math.min(absDeltaEV, this.adjustSpeed);
		if (absDeltaEV >= 1e-6)
			this.currentEV += absDeltaEV * (this.targetEV > this.currentEV ? 1 : -1);
	}

	SetTarget(target: number) : void {
		this.targetEV = Math.min(Math.max(target, this.minEV), this.maxEV);
	}

	GetCurrentEV() : number {
		return this.currentEV;
	}

	static CalculateEV(histogram: Float32Array) : number {
		const minPercentage = 0.8;
		const maxPercentage = 0.98;

		let indexMin = ImgProc.Histogram.FindIndex(histogram, minPercentage);
		let indexMax = ImgProc.Histogram.FindIndex(histogram, maxPercentage);

		let indexMean = indexMin;
		if (indexMin !== indexMax) {
			let histFocus = histogram.slice(indexMin, indexMax + 1);  // +1 to incl. indexMax
			let normalFactor = 1 / histFocus.reduce( (sum, val, idx) => val + sum );
			histFocus.forEach( (val, idx, arr) => arr[idx] = val * normalFactor );  // normalization

			// averaging
			let sumOfWeight = histFocus.reduce( (sum, val, idx) => Math.pow(2.0, indexMin + idx) + sum );
			let sumOfTotal = histFocus.reduce( (sum, val, idx) => val * Math.pow(2.0, indexMin + idx) + sum );
			indexMean += Math.log2(sumOfTotal / sumOfWeight);
		}

		return -(indexMean - ImgProc.Histogram.numBuckets * 0.5)  // negativate to compensate
			/ ImgProc.Histogram.bucketSize
			* Math.log10(2)  // EV value is 10-based
			* 0.5;  // a non-physically-based scaler
	}
}



}  // namespace Renderong

