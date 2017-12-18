

varying vec3	v_color;
varying vec3	v_worldPosition;	// world-space position (normalized)



void main(void) {
#ifdef USE_COLOR
	v_color = color;
#endif  // USE_COLOR

	vec4 worldPos = modelMatrix * vec4(position, 1.0);
	v_worldPosition = worldPos.xyz / worldPos.w;

	vec4 transformed = projectionMatrix * viewMatrix * worldPos;
	transformed.z = transformed.w;  // always inside the frustrum

	gl_Position = transformed;
	gl_PointSize = 1.0;
}

