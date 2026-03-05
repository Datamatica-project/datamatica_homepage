원의 크기 (반경)  
 float dx = (vUv.x - 0.5) / 0.45; // 0.45 → 클수록 원이 커짐
float dy = (vUv.y - 0.18) / 0.45; // 동일

핵심 빛 퍼짐 (중심부 강도)
float core = smoothstep(1.0, 0.0, horizon); // 1.0 → 클수록 core 영역 넓어짐
core = pow(core, 4.0); // 4.0 → 클수록 중심 집중, 작을수록 넓게 퍼짐

외곽 빛 퍼짐 (헤일로)
float wide = smoothstep(2.2, 0.0, horizon); // 2.2 → 클수록 외곽 빛 더 넓게
wide = pow(wide, 2.0); // 2.0 → 작을수록 넓게 퍼짐

밝기 비율
float glow = core _ 1.4 + wide _ 0.4; // core/wide 계수로 상대 밝기 조절
