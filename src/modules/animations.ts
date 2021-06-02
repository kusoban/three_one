import { Mesh } from 'three';

export function animateDonuts (donuts: Mesh[]) {
	donuts.forEach(donut => {
		if (donut.position.y < -250) {
			donut.position.y = 20;
			donut.position.x = (Math.random() - .5) * 30; 
			return
		}
		donut.position.y -= .05
		donut.rotation.y -= .015

	})

}