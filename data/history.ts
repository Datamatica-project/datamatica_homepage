export interface HistoryTimelineItem {
  month: string;
  entries: string[];
}

export interface HistoryTimelineYear {
  year: number;
  items: HistoryTimelineItem[];
}

export const historyTimeline: HistoryTimelineYear[] = [
  {
    year: 2024,
    items: [
      {
        month: "01",
        entries: [
          "자율주행 관제시스템 개발 사업 수주",
          "전북대학교 RIS 미래수송기기 사업단- 인포뱅크(주) MoU 체결 (AAM 안전비행 3차원 공간관리 시스템 개발 협업)",
          "AAM 안전비행 3차원 공간관리 시스템 개발 과제 수주",
          "3차원 공간 데이터 모델링 및 렌더링",
          "3차원 공간 데이터 구축 품질 검증",
        ],
      },
      {
        month: "02",
        entries: ["당진시 스마트 빌리지(스마트 경로당) 사업 수주"],
      },
      {
        month: "03",
        entries: [
          "데이터 수집·정제·관리 플랫폼 기능 및 기술 개발 사업 수주",
          "데이터 검증 플랫폼 기술 개발 사업 수주",
          "자율주행 이미지 객체 라벨링 저장도구 시제품 개발 사업 수주",
        ],
      },
      {
        month: "04",
        entries: [
          "디지털 트윈 기반 시뮬레이션 및 원격 제어 기술 개발 사업 수주",
          "디지털 트윈 기반 플랫폼 기능 및 기술 개발 사업 수주",
          "모의 승객 데이터 취득 시험 지원 용역",
          "데이터 구축 설계 사업 수주",
        ],
      },
    ],
  },
  {
    year: 2023,
    items: [
      {
        month: "02",
        entries: ["자율주행 차량 학습데이터 검수 사업 수주 (의미 정확성)"],
      },
      {
        month: "03",
        entries: [
          "어빌리티시스템즈 MoU 체결 (항만· HD MAP 협업)",
          "수출입 자율주행 차량 자동 하역 지원 시스템 연구개발 (고정밀 지도 기술 분석 및 개발 용역)",
          "기업부설연구소 설립",
        ],
      },
      {
        month: "04",
        entries: ["ISO 9001 품질경영시스템 인증 획득"],
      },
      {
        month: "05",
        entries: [
          "인피닉 NIA 학습용 데이터 검수",
          "뉴레이어 NIA 학습용 데이터 검수",
        ],
      },
      {
        month: "07",
        entries: [
          "전문연구사업자(융합연구개발업) 승인",
          "NIA 특이 도로 환경 주행 데이터 고도화 구축 사업 수주",
        ],
      },
      {
        month: "08",
        entries: [
          "TS 엣지케이스 데이터 수집 사업 수주",
          "TS 엣지케이스 데이터 가공 사업 수주",
        ],
      },
      {
        month: "09",
        entries: [
          "AI CCTV 데이터 가공 사업 수주",
          "한국인 얼굴 이미지 데이터 수집 제공 사업 수주",
          "중소벤처기업진흥공단 투자 유치",
          "기술보증기금 투자 유치",
          "기업은행 투자 유치",
          "KDATA 데이터 활용사례 벤치마킹 지원 시범 사업 선정",
        ],
      },
      {
        month: "10",
        entries: [
          "자율주행 이미지 데이터 가공 사업 수주",
          "공간정보 보호법 데이터 비식별화 사업 수주",
          "데이터 가공 플랫폼 임차 사업 수주",
          "고정밀 지도 기술 분석 및 개발 용역 수주",
          "자율주행 엣지 데이터 가공 사업 수주",
          "가천대학교 ISO 공인 인증 획득 지원사업 선정",
          "한국자동차연구원 정밀지도 구축 자동화 교육과정 사업 수주",
        ],
      },
      {
        month: "12",
        entries: [
          "ISO 27001 정보보호경영시스템 인증 획득",
          "자율주행 관제시스템 개발 사업 수주",
        ],
      },
    ],
  },
  {
    year: 2022,
    items: [
      {
        month: "03",
        entries: [
          "강릉시 MoU 체결",
          "강릉과학산업진흥원 MoU 체결",
          "한국건설생활환경시험연구원 MoU 체결",
          "비전인, SSL, 상상할수없는, 더막스컴퍼니 MoU 체결",
        ],
      },
      {
        month: "04",
        entries: [
          "Basic.ai 합작법인 설립 추진 (Basic.ai Korea)",
          "NIA 기존산업지능화분야 사업 수주 (감귤 착과량 데이터 구축)",
        ],
      },
      {
        month: "05",
        entries: [
          "NIA 안전재난고도화분야 사업 수주",
          "철도기술연구원 실시간 통합제어기 데이터 제작 사업 수주",
          "자율주행 다차원 데이터 제작",
          "엣지케이스 데이터 제작",
          "자율주행 센서융합 데이터 제작 (2D·3D 동기화)",
        ],
      },
      {
        month: "06",
        entries: ["건설현장 위험상태 판단 데이터 가공 품질 위탁"],
      },
      {
        month: "09",
        entries: ["가천대학교 조기취업형 계약학과 운영 협약"],
      },
      {
        month: "11",
        entries: [
          "한국자동차연구원 인공지능 학습데이터 검수 SW 임차",
          "SIEMENS 공식 파트너사 계약 (MindSphere & Mendix)",
        ],
      },
      {
        month: "12",
        entries: ["주식 평가 가치 36배 성장 (1주당 18만원)"],
      },
    ],
  },
  {
    year: 2021,
    items: [
      {
        month: "03",
        entries: ["Data-Baker 해외데이터 사업 MoU 체결 (중국)"],
      },
      {
        month: "06",
        entries: ["인하대학교 데이터 가공사업 협력"],
      },
      {
        month: "07",
        entries: [
          "2D 바운딩박스 24만장 가공",
          "2D 시멘틱 세그멘테이션 4.5만장 가공",
          "3D 바운딩박스 42만장 가공",
        ],
      },
      {
        month: "08",
        entries: ["Facial Landmark 약 21.2만장 가공"],
      },
      {
        month: "12",
        entries: [
          "3D 센서퓨전 데이터 사업 컨설팅 및 솔루션 임차(SaaS)",
          "자연 비언어 소리 데이터 가공 사업 컨설팅",
        ],
      },
    ],
  },
  {
    year: 2020,
    items: [
      {
        month: "05",
        entries: ["주식회사 데이터메티카 설립"],
      },
      {
        month: "07",
        entries: ["VAR Agreement 체결 (Basic.ai)"],
      },
      {
        month: "11",
        entries: ["충북대학교 데이터 가공사업 협력"],
      },
      {
        month: "12",
        entries: [
          "MSA for BPO Partner & SaaS 체결 (Basic.ai)",
          "Global Data Annotation 협력단체 참가",
          "Elefant Racing Bayreuth Data 사업팀 참가",
        ],
      },
    ],
  },
];
