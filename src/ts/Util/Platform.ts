/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../../../node_modules/mobile-detect/mobile-detect.d.ts" />



namespace Util {



	export function IsOnMobile() : boolean {
		let mobileDetect = new MobileDetect(window.navigator.userAgent);
		return mobileDetect.mobile() !== null || mobileDetect.tablet() !== null;
	}


	export function GetPlatformFloatType() : THREE.TextureDataType {
		return IsOnMobile() ? THREE.HalfFloatType : THREE.FloatType;
	}


	export function IsPageOnServer() : boolean {
		return window.location.origin.indexOf('http') === 0;
	}



}  // namespace Util

