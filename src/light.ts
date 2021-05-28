import { HemisphereLight, PointLight, Scene } from 'three';

export function setPointLight (scene: Scene) {
	const light = new PointLight(0xffffff);

	light.position.x = 2
	light.position.y = 3
	light.position.z = 4

	scene.add(light)
}

export function setHemiLight (scene: Scene) {
	const light = new HemisphereLight('orange', 'red', 2);
	scene.add(light)
}