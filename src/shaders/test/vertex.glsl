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
	modelPosition.z  = sin(modelPosition.x * uFrequency.x + uTime) * .5;
	modelPosition.x  += sin(modelPosition.y * uFrequency.y + uTime);
	modelPosition.z  += sin(modelPosition.y * uFrequency.y + uTime) * .5;

	distance = modelPosition.z;
	 
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;
	
	gl_Position = projectedPosition;
}