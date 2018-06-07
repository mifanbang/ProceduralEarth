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

/// <reference path="UIBase.ts" />


namespace UI {



export class Share implements UIBase {
	private funcGetSharedURL: () => string;

	private static readonly elemIdWidget: string = '#share';
	private static readonly elemIdTextField: string = '#shared_url';
	private static readonly elemIdButton: string = '#share #btn_close';


	constructor(funcGetSharedURL: () => string) {
		this.funcGetSharedURL = funcGetSharedURL;
		$(Share.elemIdButton).on('click', () => this.Hide() );
	}

	Show() : void {
		let sharedURL = this.funcGetSharedURL();
		window.history.replaceState('new sharable URL', 'Procedural Earth', sharedURL);

		ShowGlobalBlocker();
		let textField = $(Share.elemIdTextField).val(sharedURL);
		$(Share.elemIdWidget).css('visibility', 'visible');  // must set visible before .select() so the copy command can work
		this.SelectAndCopyFrom(textField);
	}

	Hide() : void {
		$(Share.elemIdWidget).css('visibility', 'hidden');
		HideGlobalBlocker();
	}

	Update() : void {
	}

	private SelectAndCopyFrom(elem: JQuery<HTMLElement>) : void {
		elem.select();

		try {
			document.execCommand('copy');
		}
		catch {
			console.warn('Failed to exec command "copy"');
		}
	}
}



}  // namespace UI

