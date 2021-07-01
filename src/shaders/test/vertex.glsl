uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
varying float distance;
void main() 
{
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	modelPosition.z  = sin(modelPosition.x * uFrequency.x + uTime) - .5;
	modelPosition.y  += sin(modelPosition.y * uFrequency.y + uTime) * 0.05;

	distance = modelPosition.z;
	 
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;
	
	gl_Position = projectedPosition;
}