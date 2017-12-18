/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */


namespace UI {



export interface UIBase {
	Show() : void;
	Hide() : void;
	Update() : void;
}


export function ShowGlobalBlocker() : void {
	$('#blocker').css('visibility', 'visible');
}

export function HideGlobalBlocker() : void {
	$('#blocker').css('visibility', 'hidden');
}



}  // namespace UI

