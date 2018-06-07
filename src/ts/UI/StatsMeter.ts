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



// a wrapper
export class StatsMeter implements UIBase {
	private isVisible: boolean;
	private impl: Stats;


	constructor() {
		this.isVisible = true;

		this.impl = new Stats();
		this.impl.showPanel(0);
		this.impl.dom.style.position = "absolute";
		this.impl.dom.style.left = "0px";
		this.impl.dom.style.top = "0px";
		this.impl.dom.style.zIndex = "50";

		this.SetVisibility(true);
	}

	GetElement() : HTMLElement {
		return this.impl.dom;
	}

	ToggleVisibility() : void {
		this.SetVisibility(!this.isVisible);
	}

	Show() : void {
		this.SetVisibility(true);
	}

	Hide() : void {
		this.SetVisibility(false);
	}

	Update() : void {
		this.impl.update();
	}

	private SetVisibility(isVisible: boolean) : void {
		this.isVisible = isVisible;
		this.impl.dom.style.visibility = (isVisible ? "visible" : "hidden");
	}
}



}  // namespace UI

