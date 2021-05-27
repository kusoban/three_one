import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setOrbitControls (camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
	const orbitControl = new OrbitControls(camera, canvas)
	orbitControl.enableDamping = true;
	orbitControl.update()

	return orbitControl;
}