

varying vec3	v_modelPosition;



void main(void) {
	gl_Position = vec4(position.xy, 1.0, 1.0);  // maximum of visible depth value (z=1)
	v_modelPosition = gl_Position.xyz;
}

