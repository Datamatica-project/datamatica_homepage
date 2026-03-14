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
    id: "autonomous",
    title: "자율주행 관제",
    titleEn: "Autonomous Driving",
    description:
      "센서·AI 기반의<br /> 안전하고 지능적인 주행 기술 관리 플랫폼.",
    overview:
      "LiDAR, 카메라, RADAR 등 다양한 센서 데이터를 융합하여 자율주행 환경을 구축합니다. 실시간 모니터링 및 경로 최적화 솔루션을 제공합니다.",
    imageSrc: "/business/autoDriving/thumbnail_home.png",
    imageSrcDetail: "/business/autoDriving/thumbnail_business.png",
    projects: [],
  },
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
];
