import { MeshMatcapMaterial } from 'three';
import { acid, orange, green } from './textures'

export const orangeMatcap = new MeshMatcapMaterial({
	matcap: orange,
});

export const acidMaterial = new MeshMatcapMaterial({
	matcap: acid,
});

export const greenMaterial = new MeshMatcapMaterial({
	matcap: green,
});