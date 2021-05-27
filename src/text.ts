import { Font, FontLoader, LoadingManager } from 'three';

const fontManager = new LoadingManager()
const fontLoader = new FontLoader(fontManager)

export const getFont: Promise<Font> = new Promise((res, rej) => {
	fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
		res(font);
	})

})