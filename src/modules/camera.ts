import { OrthographicCamera, PerspectiveCamera } from 'three'
import { size } from './renderer'

export const camera = new PerspectiveCamera(45, size.getRatio(), 0.1, 1000);
