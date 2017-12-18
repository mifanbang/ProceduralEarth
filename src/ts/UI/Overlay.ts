/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="UIBase.ts" />
/// <reference path="Config.ts" />
/// <reference path="Info.ts" />
/// <reference path="Screenshot.ts" />
/// <reference path="Share.ts" />
/// <reference path="StatsMeter.ts" />


namespace UI {



export const enum OverlayType {
	Info,
	Config,
	Share,
	Screenshot,
	StatsMeter,

	Max  // should never be used
}



interface OverlayButton {
	type: OverlayType;
	elemId: string;  // CSS specifier, i.e. must starts with character '#'
	isVisible: boolean;
}



export class Overlay implements UIBase {
	private widgets: Array<UIBase>;
	private buttons: Array<OverlayButton>;

	private static readonly elemIdButtonTray: string = '#overlay.button_list';
	private static readonly elemIdButtonInfo: string = '#btn_info';
	private static readonly elemIdButtonConfig: string = '#btn_config';
	private static readonly elemIdButtonShare: string = '#btn_share';
	private static readonly elemIdButtonScreenshot: string = '#btn_screenshot';


	constructor() {
		// all invisible by default
		this.buttons = [
			{ type: OverlayType.Info,		elemId: Overlay.elemIdButtonInfo,	isVisible: false },
			{ type: OverlayType.Config,		elemId: Overlay.elemIdButtonConfig,	isVisible: false },
			{ type: OverlayType.Share,		elemId: Overlay.elemIdButtonShare,	isVisible: false },
			{ type: OverlayType.Screenshot,	elemId: Overlay.elemIdButtonScreenshot,	isVisible: false }
		];
		this.widgets = new Array<UIBase>(OverlayType.Max);

		this.SetupMsgBoxMargins();
		this.SetupButtonEvents();
	}

	Show() : void {
		$(Overlay.elemIdButtonTray).css('visibility', 'visible');
	}

	Hide() : void {
		$(Overlay.elemIdButtonTray).css('visibility', 'hidden');
	}

	// should be called per frame
	Update() : void {
		this.widgets.forEach( (widget) => {
			if (typeof widget !== 'undefined')
				widget.Update();
		} );
	}

	OnKeyPressed(keyEvent: KeyboardEvent) : boolean {
		const KEY_ESC: number = 27;
		const KEY_RETURN: number = 13;

		if (keyEvent.keyCode == KEY_ESC || keyEvent.keyCode == KEY_RETURN)
			this.HideWidgets([OverlayType.Share, OverlayType.Info]);

		return true;
	}

	SetButtonVisibility(types: Array<OverlayType>, isVisible: boolean) : void {
		types.forEach( (type) => {
			let button = this.buttons.find( (button) => button.type === type );
			if (typeof button !== 'undefined')
				button.isVisible = isVisible;
		} );
		this.RefreshButtons();
	}

	ActivateWidgetInfo() : void {
		if (typeof this.widgets[OverlayType.Info] === 'undefined')
			this.widgets[OverlayType.Info] = new UI.Info();
	}

	ActivateWidgetConfig(data: ConfigureData) : void {
		if (typeof this.widgets[OverlayType.Config] === 'undefined') {
			data.delegates.Add(ConfigCallbackType.ShowStatsMeter, () => this.ShowWidgets([OverlayType.StatsMeter]) );
			data.delegates.Add(ConfigCallbackType.HideStatsMeter, () => this.HideWidgets([OverlayType.StatsMeter]) );

			this.widgets[OverlayType.Config] = new UI.Configure(data);
		}
	}

	ActivateWidgetShare(funcGetSharedURL: () => string) : void {
		if (typeof this.widgets[OverlayType.Share] === 'undefined')
			this.widgets[OverlayType.Share] = new UI.Share(funcGetSharedURL);
	}

	ActivateWidgetScreenshot(funcGetEncodedImg: () => string) : void {
		if (typeof this.widgets[OverlayType.Screenshot] === 'undefined')
			this.widgets[OverlayType.Screenshot] = new UI.Screenshot(funcGetEncodedImg);
	}

	ActivateWidgetStatsMeter(rootElem?: HTMLElement) : void {
		if (typeof this.widgets[OverlayType.StatsMeter] === 'undefined') {
			let widget = new UI.StatsMeter();
			this.widgets[OverlayType.StatsMeter] = widget;
			if (typeof rootElem !== 'undefined')
				rootElem.appendChild(widget.GetElement());
		}
	}

	private ShowWidgets(types: Array<OverlayType>) : void {
		types.forEach( (type) => {
			let widget = this.widgets[type];
			if (typeof widget !== 'undefined')
				widget.Show();
		 } );
	}

	private HideWidgets(types: Array<OverlayType>) : void {
		types.forEach( (type) => {
			let widget = this.widgets[type];
			if (typeof widget !== 'undefined')
				widget.Hide();
		 } );
	}

	private SetupButtonEvents() : void {
		let funcShowWidget = (type: OverlayType) => {
			return () => this.ShowWidgets([type]);
		}
		this.buttons.forEach( (button) => $(button.elemId).on('click', funcShowWidget(button.type) ) );
	}

	private SetupMsgBoxMargins() : void {
		$('.modal').each( (idx, domElem) => {
			let elem = $(domElem);
			elem.css('margin-top', -(parseInt(elem.css('height')) >> 1));
			elem.css('margin-left', -(parseInt(elem.css('width')) >> 1));
		} );
	}

	private RefreshButtons() : void {
		this.buttons.forEach( (button) => {
			let domElem = $(button.elemId);
			domElem.css('float', button.isVisible ? 'right' : 'left');
			domElem.css('visibility', button.isVisible ? 'visible' : 'hidden');
		} );
	}
}



}  // namespace UI

