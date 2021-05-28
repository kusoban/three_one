import { Mesh } from 'three';

export function animateDonuts (donuts: Mesh[]) {
	donuts.forEach(donut => {
		if (donut.position.y < - 15) return donut.position.y = 15;
		donut.position.y -= .1
		donut.rotation.y -= .02
		donut.rotation.x -= .02

	})

}