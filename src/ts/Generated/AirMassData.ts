

declare var __airMassData: Array<number>;
class AirMassData {
	public static readonly texSize = 256;
	public static readonly texData = new Float32Array(__airMassData);
}

namespace Astro {
	export class AtmosphericParam {
		// all units in meters
		public readonly thickness: number = 100000;
		public readonly planetRadius: number = 6371000;
		public readonly maxAngle: number = 1.74682773867577;

		public readonly betaRayleigh = new THREE.Vector3(0.0000058,0.0000135,0.0000331);
	}
}  // namespace Astro
