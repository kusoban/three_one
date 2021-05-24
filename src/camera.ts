import {PerspectiveCamera} from 'three'

export const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);