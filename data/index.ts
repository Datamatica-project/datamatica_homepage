export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  href: string;
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
        title: "HD MAP 구축",
        description: "LiDAR 기반 고정밀 3D 지도 생성 및 갱신 시스템",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "차량 관제 시스템",
        description: "자율주행 차량의 실시간 위치·상태 모니터링 플랫폼",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "교통 데이터 분석",
        description: "도심 교통 흐름 분석 및 이상 감지 AI 솔루션",
        image: "/business/AM.png",
        href: "#",
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
        title: "이미지 데이터 라벨링",
        description: "자율주행·의료·제조 분야 고정밀 이미지 어노테이션",
        image: "/business/Labeling.png",
        href: "#",
      },
      {
        title: "음성 데이터 구축",
        description: "다국어 음성 인식 학습용 데이터셋 수집 및 가공",
        image: "/business/Labeling.png",
        href: "#",
      },
      {
        title: "재현 데이터(Synthetic Data)",
        description: "실제 수집이 어려운 환경을 위한 고품질 합성 데이터 생성",
        image: "/business/Labeling.png",
        href: "#",
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
        title: "스마트 경로당 시스템",
        description: "IoT 기반 고령자 안전 모니터링 및 화상회의 통합 플랫폼",
        image: "/business/Safty.png",
        href: "#",
      },
      {
        title: "재난 감지 플랫폼",
        description: "AI 기반 화재·침수 등 재난 조기 감지 및 알림 시스템",
        image: "/business/Safty.png",
        href: "#",
      },
      {
        title: "스마트 CCTV 관제",
        description: "딥페이크·이상행동 감지 AI 연동 영상 관제 솔루션",
        image: "/business/Safty.png",
        href: "#",
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
        title: "스마트링 데이터 플랫폼",
        description: "웨어러블 생체 데이터 수집·분석·시각화 솔루션",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "원격 건강 모니터링",
        description: "고령자·만성질환자 대상 실시간 건강 지표 모니터링",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "의료 데이터 구축",
        description: "임상·의료 영상 AI 학습용 데이터셋 구축 및 관리",
        image: "/business/AM.png",
        href: "#",
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
        title: "스마트 시티 트윈",
        description: "도시 인프라 디지털 복제 및 교통·에너지 최적화",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "농업 자동화 시뮬레이션",
        description: "스마트 빌리지 수확 자동화 가상 검증 플랫폼",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "산업 설비 트윈",
        description: "제조 공정 디지털 복제 기반 예지 보전 솔루션",
        image: "/business/AM.png",
        href: "#",
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
        title: "도심 HD MAP 구축",
        description: "도심 도로망 고정밀 3D 지도 생성 및 갱신 서비스",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "실내 정밀 지도",
        description: "공항·터미널 등 실내 공간 내비게이션용 정밀 지도",
        image: "/business/AM.png",
        href: "#",
      },
      {
        title: "농촌 지형 매핑",
        description: "스마트 빌리지 자율주행 농기계용 농경지 정밀 지도",
        image: "/business/AM.png",
        href: "#",
      },
    ],
  },
];
