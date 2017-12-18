
varying vec3	v_modelPosition;


void main(void) {
	v_modelPosition = position;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
