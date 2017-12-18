/**
 * ProceduralEarth - WebGL-based renderer to procedurally generate Earths
 * https://debug.tw/proc_earth
 *
 * Copyright (C) 2017 Mifan Bang <https://debug.tw>
 *
 * Licensed under the MIT License.
 */

/// <reference path="../Generated/ShaderArchive.ts" />
/// <reference path="../Rendering/Renderable.ts" />
/// <reference path="../Rendering/Uniform.ts" />
/// <reference path="../Resource/GeometryRepo.ts" />
/// <reference path="../Util/Platform.ts" />
/// <reference path="../Util/UnitConv.ts" />
/// <reference path="ColorTemperature.ts" />



namespace Astro {



export class SunParam {
	public position: THREE.Vector3 = new THREE.Vector3(0, 0, Util.ConvertToUnits(149.6e9));
	public temperature: ColorTemperature = new ColorTemperature(6000);


	Copy(other: SunParam) {
		this.position.copy(other.position);
		this.temperature.SetTemperature(other.temperature.GetTemperature());
	}
};



export class Sun extends Rendering.Renderable {
	private param: SunParam;

	public static readonly radiusToDistRatio: number = 4.65e-3;  // radius (of Sun) to distance ratio (tangent)

	private static readonly shaderVert: string = ShaderArchive.star_vs;
	private static readonly shaderFrag: string = ShaderArchive.sun_fs;


	constructor(param: SunParam) {
		super('Sun');

		this.param = param;
	}

	protected CreateRenderItems(geoRepo: Resource.GeometryRepo) : Rendering.RenderItemList {
		let params: THREE.ShaderMaterialParameters = {
			defines: { 'ON_MOBILE': Util.IsOnMobile() ? 1 : 0 },
			transparent: true,
			vertexShader: Sun.shaderVert,
			fragmentShader: Sun.shaderFrag
		};
		let mesh = MeshHelper.CreateShaderMesh('Sun', geoRepo.GetSphereCoarse(), params);

		let scale = this.param.position.length() * Sun.radiusToDistRatio * 15;  // 15 times of radius to reserve area for corona in the max exposure
		mesh.scale.multiplyScalar(scale);

		return [ mesh ];
	}

	protected GetUniformFulfillments() : Rendering.UniFulList {
		return [
			new Rendering.UniformFulfillment('u_color',			(uni) => uni.value = this.param.temperature.GetPremultipliedColor() ),
			new Rendering.UniformFulfillment('u_surfaceAngle',	(uni) => uni.value = Sun.radiusToDistRatio ),
			new Rendering.UniformFulfillment('u_viewPos',		(uni, ctx) => uni.value = ctx.camera.getWorldPosition() ),
			new Rendering.UniformFulfillment('u_centerPos',		(uni) => uni.value = this.objects[0].position ),
		];
	}

	protected OnUpdatingUniform() : void {
		this.objects[0].position.copy(this.param.position);
	}
}



}  // namespace Astro

