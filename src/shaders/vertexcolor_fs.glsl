

varying vec3	v_color;


void main(void) {
	gl_FragColor.rgb = v_color;
	gl_FragColor.a = 1.0;
}

