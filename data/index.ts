export interface ProjectItem {
  id: string;
  title: string;
  description: string; // 카드용 짧은 설명
  overview: string;    // 상세 페이지 개요
  image: string;       // 대표 이미지
  images: string[];    // 상세 갤러리 이미지
  technologies: string[];
  results: string[];
}

export interface SkillDataItem {
  id: string;
  title: string;
  description: string; // <br /> 포함, 메인 홈 카드용
  overview: string;    // 사업 페이지 기술 설명 영역용
  imageSrc: string;
  projects: ProjectItem[];
}

// 기술 데이터
export const skillData: SkillDataItem[] = [
  {
    id: "autonomous",
    title: "자율주행 관제",
    description: "센서·AI 기반의<br /> 안전하고 지능적인 주행 기술.",
    overview:
      "LiDAR, 카메라, RADAR 등 다양한 센서 데이터를 융합하여 자율주행 환경을 구축합니다. 실시간 모니터링 및 경로 최적화 솔루션을 제공합니다.",
    imageSrc: "/business/AM.png",
    projects: [
      {
        id: "hd-map",
        title: "HD MAP 구축",
        description: "LiDAR 기반 고정밀 3D 지도 생성 및 갱신 시스템",
        overview:
          "LiDAR 포인트 클라우드 데이터를 처리하여 자율주행에 필요한 정밀도의 3D 공간 정보를 생성합니다. 실시간 갱신 파이프라인과 글로벌 표준 포맷(OpenDRIVE)을 지원합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["LiDAR", "Potree", "Cesium", "PDAL", "Three.js"],
        results: [
          "경로 생성 정확도 ±10cm 달성",
          "실시간 포인트 클라우드 처리 파이프라인 구축",
          "OpenDRIVE 표준 포맷 출력 지원",
        ],
      },
      {
        id: "vehicle-monitoring",
        title: "차량 관제 시스템",
        description: "자율주행 차량의 실시간 위치·상태 모니터링 플랫폼",
        overview:
          "다수의 자율주행 차량을 동시에 관제하는 웹 기반 통합 모니터링 플랫폼입니다. 실시간 GPS 위치, 센서 상태, 이상 감지 알림을 제공합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["WebSocket", "React", "Mapbox GL", "Node.js", "MQTT"],
        results: [
          "차량 50대 동시 실시간 관제 구현",
          "이상 상황 감지 후 알림 발송까지 1초 이내",
          "24/7 무중단 운영 시스템 구축",
        ],
      },
      {
        id: "traffic-analysis",
        title: "교통 데이터 분석",
        description: "도심 교통 흐름 분석 및 이상 감지 AI 솔루션",
        overview:
          "도심 CCTV 및 센서 데이터를 실시간으로 수집·분석하여 교통 혼잡, 사고, 불법 주정차 등 이상 상황을 자동 감지하는 AI 솔루션입니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["YOLO", "OpenCV", "Python", "Kafka", "Elasticsearch"],
        results: [
          "교통 이상 감지 정확도 94% 달성",
          "실시간 처리 지연 500ms 이하",
          "도심 교통 흐름 예측 모델 구축",
        ],
      },
    ],
  },
  {
    id: "ai-data",
    title: "인공지능 데이터 구축",
    description: "AI 학습을 위한<br /> 고품질 데이터 구축 솔루션.",
    overview:
      "이미지·음성·텍스트·LiDAR 등 다양한 데이터 타입을 처리하는 자체 Auto Annotation 플랫폼으로 고품질 AI 학습 데이터를 효율적으로 구축합니다.",
    imageSrc: "/business/Labeling.png",
    projects: [
      {
        id: "image-labeling",
        title: "이미지 데이터 라벨링",
        description: "자율주행·의료·제조 분야 고정밀 이미지 어노테이션",
        overview:
          "자체 개발한 Auto Annotation 엔진을 탑재한 Matica STEP 플랫폼으로 이미지·비디오 데이터의 고정밀 라벨링을 수행합니다. 바운딩 박스, 폴리곤, 세그멘테이션 등 다양한 어노테이션 유형을 지원합니다.",
        image: "/business/Labeling.png",
        images: ["/business/Labeling.png", "/business/Labeling.png"],
        technologies: ["Matica STEP", "Auto Annotation", "COCO", "Pascal VOC", "Python"],
        results: [
          "NIA 재현 데이터 사업 15억 규모 수행",
          "어노테이션 작업 속도 기존 대비 3배 향상",
          "데이터 품질 검수 자동화율 80% 달성",
        ],
      },
      {
        id: "voice-dataset",
        title: "음성 데이터 구축",
        description: "다국어 음성 인식 학습용 데이터셋 수집 및 가공",
        overview:
          "한국어·영어·중국어 등 다국어 음성 데이터를 수집, 전사, 품질 검수하여 STT/TTS 모델 학습에 최적화된 데이터셋을 구축합니다.",
        image: "/business/Labeling.png",
        images: ["/business/Labeling.png", "/business/Labeling.png"],
        technologies: ["WebRTC", "FFmpeg", "Whisper", "Python", "AWS S3"],
        results: [
          "다국어 음성 데이터 100만 문장 구축",
          "전사 정확도 99% 이상 품질 보증",
          "노이즈 필터링 자동화 파이프라인 구축",
        ],
      },
      {
        id: "synthetic-data",
        title: "재현 데이터(Synthetic Data)",
        description: "실제 수집이 어려운 환경을 위한 고품질 합성 데이터 생성",
        overview:
          "실제 데이터 수집이 어렵거나 개인정보 이슈가 있는 상황에서 통계적 유효성을 보장하는 고품질 합성 데이터를 생성합니다. GAN 기반 이미지 합성 및 통계 기반 테이블 데이터 생성을 지원합니다.",
        image: "/business/Labeling.png",
        images: ["/business/Labeling.png", "/business/Labeling.png"],
        technologies: ["GAN", "VAE", "SDV", "Python", "PyTorch"],
        results: [
          "합성 데이터 유효성 검증 지표 달성",
          "개인정보 보호 규정 준수 데이터 생성",
          "실제 데이터 대비 모델 성능 95% 유지",
        ],
      },
    ],
  },
  {
    id: "smart-safety",
    title: "스마트 안전 관리 시스템",
    description: "IoT 센서 기반 실시간<br /> 위험 감지 및 대응 플랫폼.",
    overview:
      "IoT 센서와 AI를 결합하여 시설물 및 생활 환경의 위험 요소를 실시간으로 감지하고 즉각 대응할 수 있는 통합 안전 관리 솔루션을 제공합니다.",
    imageSrc: "/business/Safty.png",
    projects: [
      {
        id: "smart-senior-center",
        title: "스마트 경로당 시스템",
        description: "IoT 기반 고령자 안전 모니터링 및 화상회의 통합 플랫폼",
        overview:
          "당진시 187개 경로당에 스마트화상회의시스템과 IoT 안전관리시스템을 구축한 사업입니다. 고령자의 안전한 생활 환경을 조성하고 디지털 소외를 해소하는 것을 목표로 합니다.",
        image: "/business/Safty.png",
        images: ["/business/Safty.png", "/business/Safty.png"],
        technologies: ["IoT", "Raspberry Pi", "WebRTC", "React", "Node.js"],
        results: [
          "당진시 187개소 경로당 구축 완료",
          "실시간 화상회의 및 안전 모니터링 통합",
          "고령자 디지털 접근성 대폭 향상",
        ],
      },
      {
        id: "disaster-detection",
        title: "재난 감지 플랫폼",
        description: "AI 기반 화재·침수 등 재난 조기 감지 및 알림 시스템",
        overview:
          "CCTV 영상과 IoT 센서 데이터를 AI로 분석하여 화재, 침수, 가스 누출 등 재난 상황을 조기에 감지하고 관계자에게 즉각 알림을 발송하는 시스템입니다.",
        image: "/business/Safty.png",
        images: ["/business/Safty.png", "/business/Safty.png"],
        technologies: ["YOLO", "TensorFlow", "IoT", "Firebase", "Python"],
        results: [
          "재난 감지 정확도 96% 달성",
          "감지 후 알림 발송 3초 이내",
          "오탐률 2% 이하 달성",
        ],
      },
      {
        id: "smart-cctv",
        title: "스마트 CCTV 관제",
        description: "딥페이크·이상행동 감지 AI 연동 영상 관제 솔루션",
        overview:
          "기존 CCTV 인프라에 AI를 결합하여 딥페이크 콘텐츠, 이상 행동, 불법 침입 등을 자동으로 감지하는 지능형 영상 관제 솔루션입니다.",
        image: "/business/Safty.png",
        images: ["/business/Safty.png", "/business/Safty.png"],
        technologies: ["DeepFake Detection", "OpenCV", "YOLO", "React", "FFmpeg"],
        results: [
          "딥페이크 감지 정확도 92% 달성",
          "이상 행동 감지 실시간 처리 구현",
          "기존 CCTV 시스템 연동 지원",
        ],
      },
    ],
  },
  {
    id: "healthcare",
    title: "스마트 헬스케어 플랫폼",
    description: "지속 가능한 건강 관리와<br /> 데이터 기반 의료 솔루션.",
    overview:
      "웨어러블 기기 데이터와 AI를 연결하여 개인 맞춤형 건강 관리 서비스를 제공합니다. 실시간 생체 데이터 분석으로 예방적 의료를 실현합니다.",
    imageSrc: "/business/AM.png",
    projects: [
      {
        id: "smart-ring",
        title: "스마트링 데이터 플랫폼",
        description: "웨어러블 생체 데이터 수집·분석·시각화 솔루션",
        overview:
          "스마트링 등 웨어러블 기기에서 수집된 심박수, 혈중 산소, 수면 패턴 데이터를 실시간으로 수집·분석하여 개인 건강 이상 징후를 조기에 감지하는 플랫폼입니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["BLE", "Python", "TensorFlow Lite", "React Native", "InfluxDB"],
        results: [
          "실시간 생체 데이터 수집 지연 100ms 이하",
          "이상 심박 감지 정확도 91% 달성",
          "24시간 연속 모니터링 시스템 구현",
        ],
      },
      {
        id: "remote-health",
        title: "원격 건강 모니터링",
        description: "고령자·만성질환자 대상 실시간 건강 지표 모니터링",
        overview:
          "독거 고령자 및 만성질환자를 대상으로 IoT 기기를 통해 혈압, 혈당 등 건강 지표를 원격으로 수집하고 의료진과 보호자에게 실시간 공유하는 시스템입니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["IoT", "HL7 FHIR", "React", "Node.js", "AWS"],
        results: [
          "고령자 건강 이상 조기 감지율 향상",
          "의료진 원격 모니터링 대시보드 구축",
          "보호자 앱 실시간 알림 시스템 운영",
        ],
      },
      {
        id: "medical-data",
        title: "의료 데이터 구축",
        description: "임상·의료 영상 AI 학습용 데이터셋 구축 및 관리",
        overview:
          "CT, MRI, X-Ray 등 의료 영상 데이터에 전문 의료진의 판독 결과를 기반으로 정밀 어노테이션을 수행하여 의료 AI 모델 학습용 데이터셋을 구축합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["DICOM", "ITK-SNAP", "Python", "MONAI", "PACS"],
        results: [
          "의료 영상 어노테이션 10만 건 이상 구축",
          "의료진 검수 기반 품질 보증 체계 운영",
          "DICOM 표준 포맷 완전 지원",
        ],
      },
    ],
  },
  {
    id: "digital-twin",
    title: "디지털 트윈",
    description: "현실을 복제한 가상 시뮬레이션<br /> 기반 예측 시스템.",
    overview:
      "현실 환경을 가상 공간에 정밀 복제하여 시뮬레이션·예측·최적화를 수행합니다. 도시·산업·농업 등 다양한 분야에 적용 가능합니다.",
    imageSrc: "/business/AM.png",
    projects: [
      {
        id: "smart-city-twin",
        title: "스마트 시티 트윈",
        description: "도시 인프라 디지털 복제 및 교통·에너지 최적화",
        overview:
          "도시의 도로, 건물, 교통 인프라를 3D로 복제한 디지털 트윈을 구축하여 교통 흐름 시뮬레이션, 에너지 소비 최적화, 재난 대응 시나리오 훈련에 활용합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["Cesium", "Three.js", "CityGML", "Unity", "Python"],
        results: [
          "도심 3D 디지털 트윈 구축 완료",
          "교통 시뮬레이션 기반 체증 구간 15% 감소",
          "재난 대응 시나리오 20종 구현",
        ],
      },
      {
        id: "farm-automation",
        title: "농업 자동화 시뮬레이션",
        description: "스마트 빌리지 수확 자동화 가상 검증 플랫폼",
        overview:
          "농촌 환경을 디지털로 복제하여 이앙기, 트랙터, 콤바인 등 농기계의 자율주행 경로를 가상으로 검증하는 플랫폼입니다. 실제 배포 전 안전성을 시뮬레이션으로 검증합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["ROS2", "Gazebo", "Unity", "Python", "HD Map"],
        results: [
          "농기계 자율주행 경로 시뮬레이션 구현",
          "실제 배포 전 충돌·오작동 사전 검증",
          "작업 자동화 효율 40% 향상",
        ],
      },
      {
        id: "factory-twin",
        title: "산업 설비 트윈",
        description: "제조 공정 디지털 복제 기반 예지 보전 솔루션",
        overview:
          "제조 설비의 센서 데이터를 실시간으로 수집하여 디지털 트윈에 반영하고, AI로 고장을 사전 예측하여 유지보수 비용을 절감하는 예지 보전 솔루션입니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["OPC-UA", "InfluxDB", "TensorFlow", "Three.js", "Grafana"],
        results: [
          "설비 고장 예측 정확도 89% 달성",
          "예방 정비로 설비 다운타임 30% 감소",
          "유지보수 비용 25% 절감",
        ],
      },
    ],
  },
  {
    id: "hd-map",
    title: "고정밀 지도",
    description: "정밀 3D 공간 데이터로<br /> 자율주행의 정확도를 완성합니다.",
    overview:
      "LiDAR·GPS·카메라 센서를 융합해 자율주행에 필요한 정밀도의 3D 공간 정보를 구축합니다. 실시간 갱신과 글로벌 표준 포맷을 지원합니다.",
    imageSrc: "/business/AM.png",
    projects: [
      {
        id: "urban-hdmap",
        title: "도심 HD MAP 구축",
        description: "도심 도로망 고정밀 3D 지도 생성 및 갱신 서비스",
        overview:
          "MMS(Mobile Mapping System) 차량으로 도심 도로를 주행하며 LiDAR·카메라 데이터를 수집, cm급 정밀도의 3D 지도를 생성하고 정기 갱신하는 서비스입니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["LiDAR", "MMS", "SLAM", "OpenDRIVE", "PDAL"],
        results: [
          "도심 도로망 500km 이상 구축",
          "위치 정확도 ±5cm 달성",
          "분기별 자동 갱신 파이프라인 운영",
        ],
      },
      {
        id: "indoor-map",
        title: "실내 정밀 지도",
        description: "공항·터미널 등 실내 공간 내비게이션용 정밀 지도",
        overview:
          "GPS 신호가 없는 실내 공간에서 LiDAR SLAM 기술로 공항, 대형 터미널, 쇼핑몰 등의 실내 정밀 지도를 구축하여 실내 내비게이션 및 로봇 자율주행에 활용합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["LiDAR SLAM", "IndoorGML", "BLE Beacon", "React", "Mapbox"],
        results: [
          "실내 위치 정확도 ±30cm 달성",
          "대형 공간 3D 모델링 자동화",
          "실내 내비게이션 서비스 연동",
        ],
      },
      {
        id: "farm-map",
        title: "농촌 지형 매핑",
        description: "스마트 빌리지 자율주행 농기계용 농경지 정밀 지도",
        overview:
          "드론과 LiDAR를 이용해 농경지의 지형·식생·경계를 정밀 측량하고, 자율주행 농기계가 활용 가능한 고정밀 3D 지도를 생성합니다.",
        image: "/business/AM.png",
        images: ["/business/AM.png", "/business/AM.png"],
        technologies: ["Drone LiDAR", "Agisoft Metashape", "QGIS", "ROS2", "Python"],
        results: [
          "농경지 지형 정밀도 ±10cm 달성",
          "드론 기반 자동 측량 파이프라인 구축",
          "자율주행 농기계 경로 생성 연동",
        ],
      },
    ],
  },
];
