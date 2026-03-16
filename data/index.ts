export interface ProjectItem {
  id: string;
  title: string;
  description: string; // 카드용 짧은 설명
  overview: string; // 상세 페이지 개요
  image: string; // 대표 이미지
  images: string[]; // 상세 갤러리 이미지
  technologies: string[];
  results: string[];
}

export interface SkillDataItem {
  id: string;
  title: string;
  titleEn: string;
  description: string; // <br /> 포함, 메인 홈 카드용
  overview: string; // 사업 페이지 기술 설명 영역용
  imageSrc: string; // 홈 ourBusiness 슬라이더 썸네일
  imageSrcDetail?: string; // 사업 분야 페이지 메인 이미지 (없으면 imageSrc 사용)
  projects: ProjectItem[];
}

// 기술 데이터
export const skillData: SkillDataItem[] = [
  {
    id: "ai-data",
    title: "인공지능 데이터 구축",
    titleEn: "AI Data Construction",
    description: "AI 학습을 위한<br /> 고품질 데이터 구축 솔루션.",
    overview:
      "이미지·음성·텍스트·LiDAR 등 다양한 데이터 타입을 처리하는 자체 Auto Annotation 플랫폼으로 고품질 AI 학습 데이터를 효율적으로 구축합니다.",
    imageSrc: "/business/AIData/thumbnail_home.png",
    imageSrcDetail: "/business/AIData/thumbnail_business.png",
    projects: [
      {
        id: "mmustai-auto-labeling",
        title: "MMustAI 오토 라벨링 플랫폼",
        description: "AI 기반 자동 객체 라벨링 및 합성 데이터 생성 플랫폼",
        overview:
          "이미지 데이터를 업로드하면 AI 모델을 활용해 객체를 자동으로 탐지하고 라벨을 생성하는 오토 라벨링 플랫폼입니다. SAM 기반 세그멘테이션을 통해 객체 Cut-out을 생성하고, 다양한 배경과 데이터 증강을 결합하여 대량의 Synthetic 데이터셋을 자동 생성할 수 있습니다. 웹 기반 인터페이스를 통해 라벨 검수, 수정, 데이터셋 관리 및 AI 학습용 포맷(YOLO/COCO)으로 데이터 내보내기를 지원합니다.",
        image: "/business/project/AI_data/1.png",
        images: [
          "/business/project/AI_data/1.png",
          "/business/project/AI_data/2.png",
          "/business/project/AI_data/3.png",
          "/business/project/AI_data/4.png",
        ],
        technologies: [
          "YOLO",
          "Segment Anything (SAM)",
          "OpenCV.js",
          "React",
          "Canvas",
          "Synthetic Data",
        ],
        results: [
          "AI 기반 자동 객체 탐지 및 라벨 생성 기능 개발",
          "세그멘테이션 기반 Cut-out 객체 라이브러리 구축",
          "Synthetic 데이터 자동 생성 및 데이터 증강 파이프라인 구축",
        ],
      },
    ],
  },
  {
    id: "hd-map",
    title: "고정밀 지도",
    titleEn: "HD Map",
    description: "정밀 3D 공간 데이터로<br /> 자율주행의 정확도를 완성합니다.",
    overview:
      "LiDAR·GPS·카메라 센서를 융합해 자율주행에 필요한 정밀도의 3D 공간 정보를 구축합니다. 실시간 갱신과 글로벌 표준 포맷을 지원합니다.",
    imageSrc: "/business/hdmap/thumbnail_home.png",
    imageSrcDetail: "/business/hdmap/thumbnail_business.png",
    projects: [
      {
        id: "urban-hdmap",
        title: "자율 농작업 3D 경로 생성 지원 서비스",
        description:
          "농지 포인트클라우드 기반 정밀 지도 생성 및 농작업 경로 생성/검증 서비스",
        overview:
          "드론·LiDAR 기반으로 수집한 농지 포인트클라우드 데이터를 처리하여 cm급 정밀도의 농업 HD Map을 구축하고, 농기계 자율 작업을 위한 경로 생성 및 검증 기능을 제공하는 서비스입니다. 포인트클라우드 전처리, 3D 타일 변환, 웹 기반 시각화 및 작업 경로 편집 기능을 통해 농작업 자동화를 지원합니다.",
        image: "/business/project/hdmap/1.png",
        images: [
          "/business/project/hdmap/1.png",
          "/business/project/hdmap/2.png",
          "/business/project/hdmap/3.png",
        ],
        technologies: [
          "LiDAR",
          "Point Cloud",
          "PDAL",
          "Three.js",
          "Cesium",
          "3D Tiles",
        ],
        results: [
          "농지 포인트클라우드 기반 HD Map 구축",
          "농기계 작업 경로 자동 생성 시스템 개발",
          "웹 기반 경로 편집 및 시각화 플랫폼 구축",
        ],
      },
    ],
  },
  {
    id: "smart-safety",
    title: "스마트 안전 관리 시스템",
    titleEn: "Smart Safety System",
    description: "IoT 센서 기반 실시간<br /> 위험 감지 및 대응 플랫폼.",
    overview:
      "IoT 센서와 AI를 결합하여 시설물 및 생활 환경의 위험 요소를 실시간으로 감지하고 즉각 대응할 수 있는 통합 안전 관리 솔루션을 제공합니다.",
    imageSrc: "/business/smartSafty/thumbnail_home.png",
    imageSrcDetail: "/business/smartSafty/thumbnail_business.png",
    projects: [],
  },
  {
    id: "healthcare",
    title: "스마트 헬스케어 플랫폼",
    titleEn: "Smart Healthcare",
    description: "지속 가능한 건강 관리와<br /> 데이터 기반 의료 솔루션.",
    overview:
      "웨어러블 기기 데이터와 AI를 연결하여 개인 맞춤형 건강 관리 서비스를 제공합니다. 실시간 생체 데이터 분석으로 예방적 의료를 실현합니다.",
    imageSrc: "/business/smartHealth/thumbnail_home.png",
    imageSrcDetail: "/business/smartHealth/thumbnail_business.png",
    projects: [],
  },
  {
    id: "digital-twin",
    title: "디지털 트윈",
    titleEn: "Digital Twin",
    description: "현실을 복제한 가상 시뮬레이션<br /> 기반 예측 시스템.",
    overview:
      "현실 환경을 가상 공간에 정밀 복제하여 시뮬레이션·예측·최적화를 수행합니다. 도시·산업·농업 등 다양한 분야에 적용 가능합니다.",
    imageSrc: "/business/digitalTwin/thumbnail_home.png",
    imageSrcDetail: "/business/digitalTwin/thumbnail_business.png",
    projects: [],
  },
  {
    id: "autonomous",
    title: "차량용 SW 검증 시스템",
    titleEn: "Autonomous Driving",
    description:
      "센서·AI 기반의<br /> 안전하고 지능적인 주행 기술 관리 플랫폼.",
    overview:
      "LiDAR, 카메라, RADAR 등 다양한 센서 데이터를 융합하여 자율주행 환경을 구축합니다. 실시간 모니터링 및 경로 최적화 솔루션을 제공합니다.",
    imageSrc: "/business/autoDriving/thumbnail_home.png",
    imageSrcDetail: "/business/autoDriving/thumbnail_business.png",
    projects: [
      {
        id: "adaptive-autosar-sil-simulation",
        title:
          "Adaptive AUTOSAR SIL 검증용 가상 신호 생성기 및 Android IVI 앱 개발",
        description:
          "가상 주행 신호 생성기와 Android IVI 앱을 연동한 E2E 자율주행 SIL 검증 솔루션",
        overview:
          "한국자동차연구원(KATECH)의 Service Creator 환경과 연동하여 Adaptive AUTOSAR 기반 어플리케이션의 SIL(Software-in-the-Loop) 검증에 필요한 차량 신호를 생성합니다. TCP/IP 소켓 통신과 멀티스레딩 기술을 활용해 10ms 단위의 고빈도 데이터를 실시간 송수신하며, GUI에서 JSON 스키마를 동적으로 편집해 주행 시나리오를 즉시 시뮬레이션할 수 있습니다. 생성된 신호는 Android IVI 앱으로 수신되어 차량 상태 모니터링 및 운전 패턴 분석 환경을 구성합니다.",
        image: "/business/project/ecoDrive/2.png",
        images: [
          "/business/project/ecoDrive/1.png",
          "/business/project/ecoDrive/2.png",
          "/business/project/ecoDrive/3.png",
          "/business/project/ecoDrive/4.png",
          "/business/project/ecoDrive/5.png",
        ],
        technologies: [
          "Android (Kotlin)",
          "Jetpack Compose",
          "Python",
          "Java",
          "TCP/IP Socket",
          "AIDL (IPC)",
          "Multi-threading",
          "Docker",
          "JSON Schema",
        ],
        results: [
          "가상 데이터 기반 Android IVI 앱 E2E 검증 환경 구축",
          "SO_KEEPALIVE 및 멀티스레드 엔진으로 10ms 주기 내 데이터 유실률 0% 달성",
          "급가속·급감속 등 16종 운전 시나리오 알고리즘 탑재",
          "160 DPI ~ 480 DPI IVI 디스플레이 대응 가변 레이아웃 구현",
        ],
      },
      {
        id: "ivi-connected-app",
        title: "IVI-Connected-App",
        description: "체감형 영상 연동 차량 액추에이터 제어 애플리케이션",
        overview:
          "차량 내 IVI 환경에서 사용자가 체감형 영상을 손쉽게 검색, 다운로드, 재생, 제어할 수 있는 안드로이드 기반 앱 및 영상 관리 클라우드 서버 구축.",
        image: "/business/project/IVIConnected/main.png",
        images: [
          "/business/project/IVIConnected/1.png",
          "/business/project/IVIConnected/2.png",
          "/business/project/IVIConnected/3.png",
          "/business/project/IVIConnected/4.png",
          "/business/project/IVIConnected/5.png",
          "/business/project/IVIConnected/6.png",
          "/business/project/IVIConnected/7.png",
          "/business/project/IVIConnected/8.png",
          "/business/project/IVIConnected/9.png",
        ],
        technologies: ["AIDL", "Jetpack Compoase", "Cloud"],
        results: [
          "Cloud–IVI–VC 3-way 연동 기반 실시간 차량 제어 시스템 구축",
          "영상–차량 액추에이터 동기화 오차 ±100ms 이하 달성",
          "차량 액추에이터 연동 체감형 영상 콘텐츠 3편 제작",
        ],
      },
    ],
  },
];
