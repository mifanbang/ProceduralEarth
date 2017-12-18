/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace Util {



export const unitLength: number = 250e3;  // 250'000 meters to 1 OpenGL unit Length


export function ConvertToRadians(degree: number) : number {
	return degree / 180 * Math.PI;
}


export function ConvertToDegrees(radian: number) : number {
	return radian / Math.PI * 180;
}


export function ConvertToMeters(unit: number) : number {
	return unit * unitLength;
}


export function ConvertToUnits(meter: number) : number {
	return meter / unitLength;
}



}  // namespace Util

