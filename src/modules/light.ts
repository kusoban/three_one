import { HemisphereLight, Light, PointLight, RectAreaLight, Scene, SpotLight } from 'three';

export function getPointLight () {
	const light = new PointLight(0xffffff,);

	light.position.x = 2
	light.position.y = 3
	light.position.z = 4
	return light;
}

export function getHemiLight () {
	const light = new HemisphereLight('orange', 'red', 2);
	return light;
}

export function getRectLight() {
	const light = new RectAreaLight(0x4e00ff, 1, 30, 20);
	return light;	
}

export function getSpotLight() {
	const light = new SpotLight(0x4e00ff, 4, 500, Math.PI / 11, 1.3, 1)
	return light
}