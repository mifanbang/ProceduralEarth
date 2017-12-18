
// required macros:
//   - MESH_TYPE:	type of the mesh


#define TYPE_SURFACE	0
#define TYPE_ATMOSPHERE	1
#define TYPE_CLOUD		2

#ifndef MESH_TYPE
	#define MESH_TYPE	TYPE_SURFACE
#endif


uniform float	u_radius;
uniform float	u_radiusAtmo;
uniform float	u_radiusCloud;

varying vec3	v_modelPosition;	// model-space position
varying vec3	v_worldPosition;	// world-space position (normalized)
varying vec3	v_worldNormal;		// world-space normal (normalized)



void main(void) {

#if MESH_TYPE == TYPE_SURFACE
	float radius = u_radius;

#elif MESH_TYPE == TYPE_ATMOSPHERE
	float radius = u_radiusAtmo;

#elif MESH_TYPE == TYPE_CLOUD
	float radius = u_radiusCloud;

#else
	#error MESH_TYPE isinvalid
#endif  // MESH_TYPE

	gl_Position = modelMatrix * vec4(position * radius, 1.0);
	v_worldPosition = gl_Position.xyz / gl_Position.w;
	v_modelPosition = position * radius;
	v_worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;

	gl_Position = projectionMatrix * viewMatrix * gl_Position;
}

