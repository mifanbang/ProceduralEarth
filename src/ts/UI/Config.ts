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

/// <reference path="../Astro/Earth.ts" />
/// <reference path="../Astro/MilkyWay.ts" />
/// <reference path="../Astro/Sun.ts" />
/// <reference path="../Helper/ColorHelper.ts" />
/// <reference path="../Rendering/PostEffect.ts" />
/// <reference path="../Util/Delegate.ts" />
/// <reference path="../Util/Platform.ts" />
/// <reference path="../Util/UnitConv.ts" />
/// <reference path="UIBase.ts" />



namespace UI {



export enum ConfigCallbackType {
	ResetToDefaults,
	ResetCamera,
	ShowStatsMeter,
	HideStatsMeter
}


class GeneralOptions {
	public isStatsMeterVisible: boolean = true;

	Copy(other: GeneralOptions) : void {
		this.isStatsMeterVisible = other.isStatsMeterVisible;
	}
}


export interface ConfigureData {
	paramEarth: Astro.EarthParam;
	paramSun: Astro.SunParam;
	paramMilkyWay: Astro.MilkyWayParam;
	paramPostEffect: PostEffect.Param;
	delegates: Util.DelegateSet<ConfigCallbackType>;
}



class ConfigTranslationLayer {
	private config: ConfigureData;

	// Sun
	public temperature: number;
	// Earth
	public axialTilt: number;
	public rotateSpeed: number;


	constructor(config: ConfigureData) {
		this.config = config;
		this.ReadAndSync();
	}

	ReadAndSync() : void {
		let config = this.config;
		this.temperature = config.paramSun.temperature.GetTemperature();
		this.axialTilt = Math.floor(Util.ConvertToDegrees(config.paramEarth.axialTilt));
		this.rotateSpeed = Math.floor(config.paramEarth.selfRotSpeed / 0.001);

		this.WriteBack();  // to avoid out-of-sync due to Math.floor() calls
	}

	WriteBack() : void {
		let config = this.config;

		config.paramSun.temperature.SetTemperature(this.temperature);
		config.paramEarth.axialTilt = Util.ConvertToRadians(this.axialTilt);
		config.paramEarth.selfRotSpeed = this.rotateSpeed * 0.001;
	}
}



export class Configure implements UIBase {
	private data: ConfigureData;
	private optGeneral: GeneralOptions;
	private translation: ConfigTranslationLayer;
	private gui: dat.GUI;


	constructor(configData: ConfigureData) {
		this.data = configData;
		this.optGeneral = new GeneralOptions();
		this.translation = new ConfigTranslationLayer(this.data);
		this.data.delegates.Add(ConfigCallbackType.ResetToDefaults, () => this.ResetToDefaults() );
		Configure.CheckDelegates(this.data.delegates);

		this.SetupControls(configData, this.translation);
	}

	// delegate integrity check
	private static CheckDelegates(delegates: Util.DelegateSet<ConfigCallbackType>) : void {
		let funcCheckDelegate = (cbType: ConfigCallbackType) : void => {
			if (delegates.IsEmpty(cbType))
				throw new Error('Delegate type=' + cbType + ' cannot be empty');
		};
		funcCheckDelegate(ConfigCallbackType.ResetToDefaults);
		funcCheckDelegate(ConfigCallbackType.ResetCamera);
		funcCheckDelegate(ConfigCallbackType.ShowStatsMeter);
		funcCheckDelegate(ConfigCallbackType.HideStatsMeter);
	}

	private SetupControls(configData: ConfigureData, translation: ConfigTranslationLayer) : void {
		let gui = new dat.GUI();

		this.gui = gui;
		this.Hide();
		this.OverrideCloseButton(this.gui.domElement);
		this.ResetToDefaults;  // silence compiler for thinking it as an unused function

		Configure.SetupFolderGeneral(gui, configData, this.optGeneral);
		Configure.SetupFolderSun(gui, configData, translation);
		Configure.SetupFolderEarth(gui, configData, translation);
		Configure.SetupFolderMilkyWay(gui, configData, translation);
		Configure.SetupFolderCamera(gui, configData, translation);

		translation.WriteBack();  // to avoid out-of-sync due to .step() calls
	}

	private static SetupFolderGeneral(gui: dat.GUI, data: ConfigureData, optGeneral: GeneralOptions) : void {
		let folderGeneral = gui.addFolder('General');
		let proxy = {
			resetToDefaults: () => data.delegates.Invoke(ConfigCallbackType.ResetToDefaults),
			onVisibilityChanges: (isVisible: boolean) => data.delegates.Invoke(isVisible ? ConfigCallbackType.ShowStatsMeter : ConfigCallbackType.HideStatsMeter)
		};

		folderGeneral.add(proxy, 'resetToDefaults')
			.name('Reset to Default');
		folderGeneral.add(optGeneral, 'isStatsMeterVisible')
			.name('Stats Meter')
			.onChange(proxy.onVisibilityChanges);

		folderGeneral.open();
	}

	private static SetupFolderSun(gui: dat.GUI, data: ConfigureData, translation: ConfigTranslationLayer) : void {
		let updateTranslation = () => translation.WriteBack();
		let folderSun = gui.addFolder('Sun');

		folderSun.add(translation, 'temperature', 1000, 13000)
			.name('Temperature')
			.step(100)
			.onChange(updateTranslation);

		folderSun.open();
	}

	private static SetupFolderEarth(gui: dat.GUI, data: ConfigureData, translation: ConfigTranslationLayer) : void {
		let updateTranslation = () => translation.WriteBack();
		let folderEarth = gui.addFolder('Earth');

		folderEarth.add(translation, 'axialTilt', 0, 90)
			.name('Axial Tilt')
			.step(1)
			.onChange(updateTranslation);
		folderEarth.add(data.paramEarth, 'heightOcean', 0.1, 0.8)
			.name('Ocean Level')
			.step(0.01);
		folderEarth.add(data.paramEarth, 'cloudAmount', -1, 1)
			.name('Cloud Amount')
			.step(0.01);
		folderEarth.add(data.paramEarth, 'cloudHeight', 2000, 5000)
			.name('Cloud Height')
			.step(200);
		folderEarth.add(translation, 'rotateSpeed', -2, 2)
			.name('Self Rotation')
			.step(1)
			.onChange(updateTranslation);

		folderEarth.open();
	}

	private static SetupFolderMilkyWay(gui: dat.GUI, data: ConfigureData, translation: ConfigTranslationLayer) : void {
		let folderMilkyWay = gui.addFolder('Milky Way');

		folderMilkyWay.add(data.paramMilkyWay, 'distToCenter', 4, 12)
			.name('Distance')
			.step(0.01);
		folderMilkyWay.add(data.paramMilkyWay, 'angleToOrbit', -90, 90)
			.name('Angle To Orbit')
			.step(0.1);
		folderMilkyWay.add(data.paramMilkyWay, 'gasDensity', 0, 10)
			.name('Gas Density');

		folderMilkyWay.open();

	}

	private static SetupFolderCamera(gui: dat.GUI, data: ConfigureData, translation: ConfigTranslationLayer) : void {
		let folderPostEffect = gui.addFolder('Camera');
		let proxy = { resetCamera: () => data.delegates.Invoke(ConfigCallbackType.ResetCamera) };

		folderPostEffect.add(data.paramPostEffect, 'evOffset', -2, 2)
			.name('EV')
			.step(0.01);
		folderPostEffect.add(data.paramPostEffect, 'autoExposure')
			.name('Auto Exposure');
		folderPostEffect.add(proxy, 'resetCamera')
			.name('Reset Camera Position');

		folderPostEffect.open();
	}

	// override the event handler of the 'Close Controls' button to call our Hide()
	private OverrideCloseButton(domElement: HTMLElement) : void {
		$(domElement).children('.close-button').on('click', () => this.Hide() );
	}

	private ResetToDefaults() : void {
		let data = this.data;
		data.paramEarth.Copy(new Astro.EarthParam());
		data.paramSun.Copy(new Astro.SunParam());
		data.paramMilkyWay.Copy(new Astro.MilkyWayParam());
		data.paramPostEffect.Copy(new PostEffect.Param());
		this.optGeneral.Copy(new GeneralOptions());

		this.UpdateDisplay();
	}

	private UpdateDisplay() : void {
		this.translation.ReadAndSync();
		this.gui.updateDisplay();
	}

	Show() : void {
		this.gui.open();
		$(this.gui.domElement).css('visibility', 'visible');
	}

	Hide() : void {
		$(this.gui.domElement).css('visibility', 'hidden');
		this.gui.close();
	}

	Update() : void {
	}
}



}  // namespace UI

