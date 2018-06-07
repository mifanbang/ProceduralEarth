/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="Rendering/Engine.ts" />
/// <reference path="Resource/GeometryRepo.ts" />
/// <reference path="UI/Overlay.ts" />
/// <reference path="Util/ParamSerializer.ts" />



function TryAndCatch(funcTask: () => void, funcErr: (err: Error) => void) {
	return () => {
		try {
			funcTask();
		}
		catch (e) {
			funcErr(e);
		}
	};
}



enum ControlType {
	Orbit,
	Trackball
}



class Application {
	private camera: THREE.PerspectiveCamera;
	private canvas: THREE.WebGLRenderer;

	private renderEngineData: Rendering.EngineData;
	private renderEngine: Rendering.Engine;
	private control: THREE.OrbitControls | THREE.TrackballControls;
	private uiOverlay: UI.Overlay;


	constructor(rootNode: HTMLElement, controlType: ControlType) {
		let init = () => {
			this.SetupCamera();

			let exportData = Application.ExtractParamFromURL(window.location.href);
			this.SetupRenderer(rootNode, exportData);

			this.SetupController(controlType);

			this.SetupEventHandlers();
			this.SetupUI(rootNode);
		};

		TryAndCatch(init, Application.OnError)();
	}

	StartRendering() : void {
		let callback = TryAndCatch( () => this.Render(), Application.OnError );
		Rendering.Manager.instance.RegisterTask(callback);
	}

	private SetupCamera() : void {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
		this.camera.position.set(-61.53412641991374, -57.18090403544923, 70.033829519573)
		this.camera.up.set(-0.1561075070494867, 0.8278637450097441, 0.5387690283797024);
	}

	private SetupRenderer(rootNode: HTMLElement, exportData?: Util.ExportableData) : void {
		this.canvas = new THREE.WebGLRenderer( {
			antialias: true,
			preserveDrawingBuffer: true  // for screenshot
		} );
		this.canvas.autoClear = false;
		this.canvas.setSize(window.innerWidth, window.innerHeight);
		this.canvas.sortObjects = false;

		rootNode.appendChild(this.canvas.domElement);

		let rngSeed: number;
		let paramSun: Astro.SunParam;
		let paramEarth: Astro.EarthParam;
		let paramMilkyWay: Astro.MilkyWayParam;
		if (typeof exportData !== 'undefined') {
			rngSeed = exportData.rngSeed;
			paramSun = exportData.paramSun;
			paramEarth = exportData.paramEarth;
			paramMilkyWay = exportData.paramMilkyWay;
		}
		else {
			rngSeed = Math.round(Math.random() * 0x7FFFFFFF);
			paramSun = new Astro.SunParam();
			paramEarth = new Astro.EarthParam();
			paramMilkyWay = new Astro.MilkyWayParam();
		}

		this.renderEngineData = {
			camera: this.camera,
			canvas: this.canvas,
			paramEarth: paramEarth,
			paramSun: paramSun,
			paramMilkyWay: paramMilkyWay,
			paramPostEffect: new PostEffect.Param(),
			geometryRepo: new Resource.GeometryRepo(),
			rngSeed: rngSeed
		};
		this.renderEngine = new Rendering.Engine(this.renderEngineData);
	}

	private SetupController(controlType: ControlType) : void {
		let control: THREE.OrbitControls | THREE.TrackballControls;
		if (controlType == ControlType.Orbit) {
			control = new THREE.OrbitControls(this.camera, this.canvas.domElement);
			control.zoomSpeed = 0.5;
			control.rotateSpeed = 0.5;
			control.enableDamping = true;
			control.dampingFactor = 0.15;
		}
		else
			control = new THREE.TrackballControls(this.camera, this.canvas.domElement);

		// common properties
		control.minDistance = 30;
		control.maxDistance = 1000;
		this.control = control;
	}

	private SetupEventHandlers() : void {
		this.SetupResizeHandler();
		this.SetupKeyHandler();
	}

	private SetupResizeHandler() : void {
		let handler = () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			this.canvas.setSize(window.innerWidth, window.innerHeight);
			this.renderEngine.OnResize(window.innerWidth, window.innerHeight);

			if (this.control instanceof THREE.TrackballControls)
				this.control.handleResize();
		};
		window.onresize = handler;
		handler();
	}

	private SetupKeyHandler() : void {
		document.body.onkeydown = (keyEvent: KeyboardEvent) : boolean => this.uiOverlay.OnKeyPressed(keyEvent);
	}

	private SetupUI(rootNode: HTMLElement) : void {
		this.uiOverlay = new UI.Overlay();

		// activation
		let renderData = this.renderEngineData;
		let delegates = new Util.DelegateSet<UI.ConfigCallbackType>();
		delegates.Add(UI.ConfigCallbackType.ResetCamera, () => this.control.reset() );
		this.uiOverlay.ActivateWidgetConfig( {
			paramEarth: renderData.paramEarth,
			paramSun: renderData.paramSun,
			paramMilkyWay: renderData.paramMilkyWay,
			paramPostEffect: renderData.paramPostEffect,
			delegates: delegates
		} );
		this.uiOverlay.ActivateWidgetShare( () => Application.GetSharableURL(this.renderEngineData) );
		this.uiOverlay.ActivateWidgetScreenshot( () => Application.GetEncodedCanvasImg(this.canvas.domElement) );
		this.uiOverlay.ActivateWidgetStatsMeter(rootNode);
		this.uiOverlay.ActivateWidgetInfo();

		// enable individual buttons
		let enableList = [UI.OverlayType.Info, UI.OverlayType.Config, UI.OverlayType.Screenshot, UI.OverlayType.StatsMeter];
		if (!Util.IsOnMobile())
			enableList.push(UI.OverlayType.Share);
		this.uiOverlay.SetButtonVisibility(enableList, true);
	}

	private Render() : void {
		this.uiOverlay.Update();
		this.control.zoomSpeed = this.camera.position.distanceTo(this.control.target) / 300.0;
		this.control.update();
		this.camera.updateMatrixWorld(true);

		this.canvas.clear();
		this.renderEngine.Render();
	}

	private static OnError(error: Error) : void {
		$('#error #detail').html(error.toString());
		$('#error').css('visibility', 'visible');
		throw error;
	}

	private static ExtractParamFromURL(url: string) : Util.ExportableData | undefined {
		let parsedURL = url.split('?');
		let strParam = parsedURL.length > 1 ? parsedURL[1] : '';
		if (Util.IsParamStringValid(strParam))
			return Util.DeserializeParam(strParam);
		else if (strParam.length > 0)
			alert('It seems you got here from a shared link. Unfortunately the link is broken. You will now have a freshly generated Earth.');

		return undefined;
	}

	private static GetSharableURL(renderData: Rendering.EngineData) : string {
		let url = window.location.href.split('?')[0];
		let encodedParam = Util.SerializeParam( {
			rngSeed: renderData.rngSeed,
			paramSun: renderData.paramSun,
			paramEarth: renderData.paramEarth,
			paramMilkyWay: renderData.paramMilkyWay
		} );
		return [url, '?', encodedParam].join('');
	}

	private static GetEncodedCanvasImg(canvasElem: HTMLCanvasElement) : string {
		return canvasElem.toDataURL('image/png');
	}
}



// globals
let app : Application;


// entry point
$(document.body).ready( function () : void {
	app = new Application(document.body, ControlType.Trackball);
	app.StartRendering();
} );


