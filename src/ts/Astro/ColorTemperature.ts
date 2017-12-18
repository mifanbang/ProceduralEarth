/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Helper/ColorHelper.ts" />


namespace Astro {



export class ColorTemperature {
	private temperature: number = 6000;  // unit: Kelvin
	private color: THREE.Color = new THREE.Color(1, 1, 1);
	private power: number = 10;


	constructor(temperature: number) {
		this.SetTemperature(temperature);
	}

	SetTemperature(temperature: number) {
		this.temperature = temperature;

		let colorLumi = ColorHelper.EvalColorAndLumi(temperature);
		this.power = ColorTemperature.ConvertLuminanceToPower(colorLumi.lumi);
		this.color.setRGB(colorLumi.color.r, colorLumi.color.g, colorLumi.color.b);
	}

	GetTemperature() : number {
		return this.temperature;
	}

	GetPremultipliedColor() : THREE.Color {
		return this.color.clone().multiplyScalar(this.power);
	}

	private static ConvertLuminanceToPower(lumi: number) : number {
		return Math.pow(lumi / 1.5e5, 1 / 5) * 9.8 + 0.2;  // non-physically based transform
	}
}



}  // namespace Astro

