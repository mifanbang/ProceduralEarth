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

/// <reference path="../Rendering/Engine.ts" />


namespace Util {



export interface ExportableData {
	rngSeed: number;
	paramSun: Astro.SunParam;
	paramEarth: Astro.EarthParam;
	paramMilkyWay: Astro.MilkyWayParam;
}


// order MUST NOT change in the future
const enum ExportDataField {
	Seed,

	Sun_Temperature,

	Earth_OceanHeight,
	Earth_CloudAmount,
	Earth_CloudHeight,
	Earth_AxialTilt,
	Earth_SelfRotSpeed,

	MilkyWay_DistToCenter,
	MilkyWay_GasDensity,
	MilkyWay_AngleToOrbit,

	Max  // must not be used
}

const EXPORT_DATA_SIZE = (ExportDataField.Max << 3);



export function IsParamStringValid(str: string) : boolean {
	let length = str.length;

	// length check
	if (length != EXPORT_DATA_SIZE)  // *4 for using float; *2 for using two digits for one byte
		return false;

	// character check
	for (let i = 0; i < length; ++i) {
		let charCode = str.charCodeAt(i);
		if (!(charCode >= 0x30 && charCode <= 0x39) && !(charCode >= 0x41 && charCode <= 0x46) && !(charCode >= 0x61 && charCode <= 0x66))
			return false;
	}

	return true;
}


function ConvertBufferToString(buffer: ArrayBuffer) : string {
	let ubyteView = new Uint8Array(buffer);

	let strArray: Array<string> = [];
	ubyteView.forEach( (val) => strArray.push(val < 16 ? '0' + val.toString(16) : val.toString(16)) );
	return strArray.join('');
}


function ConvertStringToBuffer(str: string) : ArrayBuffer {
	if (!IsParamStringValid(str))
		throw new Error('Failed to parse data from previously exported parameters.');

	let result = new ArrayBuffer(EXPORT_DATA_SIZE);
	let ubyteView = new Uint8Array(result); 
	for (let i = 0; i < (EXPORT_DATA_SIZE >> 1); ++i)
		ubyteView[i] = parseInt(str.substr(i << 1, 2), 16);
	return result;
}


export function SerializeParam(data: ExportableData) : string {
	let buffer = new ArrayBuffer(ExportDataField.Max << 2);
	let view = new DataView(buffer);

	// destination is always in little-endian
	// some fields does not use float32 since it will truncate needed bits
	view.setUint32(ExportDataField.Seed << 2, data.rngSeed, true);
	view.setUint32(ExportDataField.Sun_Temperature << 2,	data.paramSun.temperature.GetTemperature(), true);
	view.setFloat32(ExportDataField.Earth_OceanHeight << 2,	data.paramEarth.heightOcean, true);
	view.setFloat32(ExportDataField.Earth_CloudAmount << 2,	data.paramEarth.cloudAmount, true);
	view.setFloat32(ExportDataField.Earth_CloudHeight << 2,	data.paramEarth.cloudHeight, true);
	view.setFloat32(ExportDataField.Earth_AxialTilt << 2,	data.paramEarth.axialTilt, true);
	view.setFloat32(ExportDataField.Earth_SelfRotSpeed << 2,	data.paramEarth.selfRotSpeed, true);
	view.setFloat32(ExportDataField.MilkyWay_DistToCenter << 2,	data.paramMilkyWay.distToCenter, true);
	view.setFloat32(ExportDataField.MilkyWay_GasDensity << 2,	data.paramMilkyWay.gasDensity, true);
	view.setFloat32(ExportDataField.MilkyWay_AngleToOrbit << 2,	data.paramMilkyWay.angleToOrbit, true);

	return ConvertBufferToString(buffer);
}


// $only part of
export function DeserializeParam(str: string) : ExportableData {
	let buffer = ConvertStringToBuffer(str);
	let view = new DataView(buffer);
	let result = {
		rngSeed: Date.now(),
		paramSun: new Astro.SunParam(),
		paramEarth: new Astro.EarthParam(),
		paramMilkyWay: new Astro.MilkyWayParam()
	};

	// source is always in little-endian
	result.rngSeed = view.getUint32(ExportDataField.Seed << 2, true);
	result.paramSun.temperature.SetTemperature(view.getUint32(ExportDataField.Sun_Temperature << 2, true));
	result.paramEarth.heightOcean	= view.getFloat32(ExportDataField.Earth_OceanHeight << 2, true);
	result.paramEarth.cloudAmount	= view.getFloat32(ExportDataField.Earth_CloudAmount << 2, true);
	result.paramEarth.cloudHeight	= view.getFloat32(ExportDataField.Earth_CloudHeight << 2, true);
	result.paramEarth.axialTilt		= view.getFloat32(ExportDataField.Earth_AxialTilt << 2, true);
	result.paramEarth.selfRotSpeed	= view.getFloat32(ExportDataField.Earth_SelfRotSpeed << 2, true);
	result.paramMilkyWay.distToCenter	= view.getFloat32(ExportDataField.MilkyWay_DistToCenter << 2, true);
	result.paramMilkyWay.gasDensity		= view.getFloat32(ExportDataField.MilkyWay_GasDensity << 2, true);
	result.paramMilkyWay.angleToOrbit	= view.getFloat32(ExportDataField.MilkyWay_AngleToOrbit << 2, true);

	return result;
}



}  // namespace Util

