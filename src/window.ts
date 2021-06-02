import {canvas} from './modules/renderer'

interface webkitDocument extends Document {
	webkitFullscreenElement: any;
	webkitExitFullscreen: any;
}

window.addEventListener('dblclick', () => {
	const fullscreenElement = document.fullscreenElement || (<webkitDocument>document).webkitFullscreenElement;

	if (!fullscreenElement) {
		if (canvas.requestFullscreen) canvas.requestFullscreen()
		else if (canvas.webkitRequestFullScreen) {
			canvas.webkitRequestFullScreen()
		}
	} else {
		if (document.exitFullscreen) document.exitFullscreen()
		else if ((<webkitDocument>document).webkitExitFullscreen) {
			(<webkitDocument>document).webkitExitFullscreen()
		}
	}
})