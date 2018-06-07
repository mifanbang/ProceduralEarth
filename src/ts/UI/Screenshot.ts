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

/// <reference path="../Util/Platform.ts" />
/// <reference path="UIBase.ts" />


namespace UI {



export class Screenshot implements UIBase {
	private funcGetEncodedImg: () => string;


	constructor(funcGetEncodedImg: () => string) {
		this.funcGetEncodedImg = funcGetEncodedImg;
	}

	Show() : void {
		let encodedImg = this.funcGetEncodedImg();

		// Firefox for iOS blocks access to the child window if the URL opened is about:blank.
		// therefore if the page is hosted on a server, use a dedicated page for showing screenshots
		if (Util.IsPageOnServer()) 
			Screenshot.CreateWindowWithExternalPage(encodedImg);
		else
			Screenshot.CreateWindowWithBlankPage(encodedImg);
	}

	Hide() : void {
	}

	Update() : void {
	}

	private static CreateWindowWithExternalPage(encodedImg: string) : void {
		let newWin = window.open('screenshot.html');
		if (newWin !== null)
			newWin.opener = { screenshot: encodedImg };  // HACK: using window.opener to communicate with the child window
	}

	private static CreateWindowWithBlankPage(encodedImg: string) : void {
		let newWin = window.open('about:blank', 'Screenshot');
		if (newWin != null) {
			newWin.document.write('Now you can save the image below.<br><img src="');
			newWin.document.write(encodedImg);
			newWin.document.write('">');
		}
	}
}



}  // namespace UI

