

uniform mat4	modelMatrix;



vec3 CalcBumpNormal(vec3 modelNPos, float fbm, float scaler) {
	vec3 dPos_dX = dFdx(modelNPos);
	vec3 dPos_dY = dFdy(modelNPos);

	mat3 tan2obj = mat3(normalize(dPos_dX), normalize(dPos_dY), modelNPos);
	float tan_bumpNormal_x = -dFdx(fbm) / length(dPos_dX) * scaler;
	float tan_bumpNormal_y = -dFdy(fbm) / length(dPos_dY) * scaler;
	vec3 tan_bumpNormal = vec3(tan_bumpNormal_x, tan_bumpNormal_y, sqrt(1.0-tan_bumpNormal_x*tan_bumpNormal_x+tan_bumpNormal_y*tan_bumpNormal_y));
	vec4 bumpNormal = modelMatrix * vec4(tan2obj * normalize(tan_bumpNormal), 0.0);

	return normalize(bumpNormal.xyz);
}

