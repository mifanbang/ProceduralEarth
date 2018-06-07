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



export class Info implements UIBase {
	private static readonly elemIdWidget: string = '#info';
	private static readonly elemIdButton: string = '#info #btn_close';


	constructor() {
		$(Info.elemIdButton).on('click', () => this.Hide() );
	}

	Show() : void {
		ShowGlobalBlocker();
		$(Info.elemIdWidget).css('visibility', 'visible');
	}

	Hide() : void {
		$(Info.elemIdWidget).css('visibility', 'hidden');
		HideGlobalBlocker();
	}

	Update() : void {
	}
}



}  // namespace UI

