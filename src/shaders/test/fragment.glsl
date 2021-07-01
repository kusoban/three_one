precision mediump float;
varying float distance;

void main() { 
	gl_FragColor = vec4(distance * 1.5,  distance * .3, distance * 5.3 + .7,  1.0);
	// gl_FragColor = vec4(.9, .3, .7,  1.0);
}