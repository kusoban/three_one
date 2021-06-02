import { MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial } from 'three';
import { acid, orange, green } from '../textures'

export const standard = new MeshStandardMaterial({
	color: 'yellow',
})

export const orangeMatcap = new MeshMatcapMaterial({
	matcap: orange,
});

export const acidMaterial = new MeshMatcapMaterial({
	matcap: acid,
});

export const greenMaterial = new MeshMatcapMaterial({
	matcap: green,
});