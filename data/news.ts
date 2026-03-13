export interface NewsArticle {
  id: string;
  date: string;
  year: number;
  title: string;
  description: string;
  source: string;
  thumbnail: string;
}

// 뉴스 기사 데이터
export const newsArticles: NewsArticle[] = [
  {
    id: "25011301",
    date: "2025년 1월 13일",
    year: 2025,
    title:
      "[기업경영인신문] 스마트빌리지의 선두주자, 데이터메티카의 자율주행 자동화 기술 - 데이터메티카 곡세홍 대표",
    description:
      "디지털 혁신, 사업 변화를 이끌며 자율주행 기술 발전 데이터 기반의 스마트 빌리지 혁신 모델 구현 1993년, 세계 최초로 고려대학교 산업공학과의 한민홍 교수 연구팀이 자율주행 자동차를 선보였다. 운전자의 조작 없이 100km 빗길과 야간주행을...",
    source: "https://bizhuman.co.kr/View.aspx?No=3502480",
    thumbnail: "/news/2025/25011301.avif",
  },
  {
    id: "24083001",
    date: "2024년 8월 30일",
    year: 2024,
    title: "[엠뉴스] 당진시, 스마트 경로당 구축 시연회 개최",
    description:
      "스마트화상회의 시스템·IoT안전관리시스템 구축해 어르신들 복지서비스 강화 당진시(시장 오성환)가 총 187개소의 경로당에 스마트화상회의시스템과 IoT안전관리시스템 구축을 완료하고, 28일 노인회관 2층 대회의실에서 스마트경로당 구축 시연회를...",
    source: "http://www.cmni.news/news/articleView.html?idxno=86190",
    thumbnail: "/news/2024/24083001.avif",
  },
  {
    id: "24080601",
    date: "2024년 8월 06일",
    year: 2024,
    title: "[디지털투데이] 데이터메티카, AI 겨냥 재현 데이터 사업 본격 추진",
    description:
      "데이터메티카는 2022년 15억원 이상 규모 한국지능정보사회진흥원(NIA) 재현 데이터 사업을 성공적으로 수행한 경험과 다양한 연구 노하우를 기반으로 재현 데이터(Synthetic Data) 사업을 본격화한다고 6일 밝혔다. 데이터메티카는...",
    source: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=528298",
    thumbnail: "/news/2024/24080601.avif",
  },
  {
    id: "24062101",
    date: "2024년 6월 21일",
    year: 2024,
    title:
      "[정보통신신문] 데이터메티카, 스마트 사업단과 스마트 시티 사업 본격화",
    description:
      "인공지능(AI) 학습 데이터 전문 기업 데이터메티카가 본격적으로 스마트 도시 구축에 박차를 가하기 위해 스마트 사업단을 구성했다고 21일 밝혔다. 이번 사업단은 데이터메티카를 주축으로 인포뱅크, 인피닉, 더막스, 투비유니콘 등 다양한 기업이...",
    source: "https://www.koit.co.kr/news/articleView.html?idxno=123314",
    thumbnail: "/news/2024/24062101.avif",
  },
  {
    id: "24060401",
    date: "2024년 6월 04일",
    year: 2024,
    title:
      "[비욘드포스트] ㈜데이터메티카·㈜투비유니콘, 홀로그램 기술 공동 개발 사업 진행",
    description:
      "| 홀로그램 기술, 초거대 AI와 융합 통한 혁신적인 서비스 제공 예정 인공지능(AI) 학습용 DB구축 및 데이터처리 특화 기업 데이터메티카는 투비유니콘과 함께 한국전자통신연구원(ETRI)의 관련 분야 주요 기술과 노하우를 정식으로 이전받아...",
    source:
      "https://www.beyondpost.co.kr/view.php?ud=20240604104551623846a9e4dd7f_30",
    thumbnail: "/news/2024/24060401.avif",
  },
  {
    id: "24052201",
    date: "2024년 5월 22일",
    year: 2024,
    title: "[헬로티] 데이터메티카, 자율주행 농기계 개발로 ‘RIS 사업’ 선정",
    description:
      "데이터메티카는 JB지산학협력단(RIS 총괄운영본부)이 주최한 ‘전북 지자체-대학 협력기반 지역혁신(RIS)’ 사업에 공모해 최종 선정됐다고 22일 밝혔다. 선정된 사업 과제의 주요 내용은 원격 자율작업이 가능한 농기계 연구 및 상용화를 위한 기술...",
    source: "https://www.hellot.net/news/article.html?no=90015",
    thumbnail: "/news/2024/24052201.avif",
  },
  {
    id: "24040201",
    date: "2024년 4월 02일",
    year: 2024,
    title: "[IT DAILY] 데이터메티카, 전북특별자치도 모빌리티 사업 추진",
    description:
      "| 군산시 선유도 거점으로 자율주행 셔틀·트럭 운영 인공지능(AI) 학습 데이터 전문기업 데이터메티카는 군산시 선유도를 거점으로 전북특별자치도 내 모빌리티 사업에 앞장설 계획이라고 2일 밝혔다. 데이터메티카는 AI 데이터베이스 구축 서비스를...",
    source: "http://www.itdaily.kr/news/articleView.html?idxno=221827",
    thumbnail: "/news/2024/24040201.avif",
  },
  {
    id: "24032801",
    date: "2024년 3월 28일",
    year: 2024,
    title:
      "[서울경제TV] 데이터메티카, ‘2024 당진 스마트 경로당 구축 사업’ 착수",
    description:
      "글로벌 DB구축 서비스 제공 전문기업 ㈜데이터메티카가 ‘2024 당진 스마트 경로당 구축 사업’을 수주해 본격적인 착수단계에 돌입했다고 밝혔다. 이번 컨소시엄은 충청남도 당진시의 초고령화 사회 진입에 따른 복지정책 강화를 위해 기획된 것으로...",
    source: "https://www.sentv.co.kr/article/view/sentv202403280056",
    thumbnail: "",
  },
  {
    id: "24022801",
    date: "2024년 2월 28일",
    year: 2024,
    title:
      "[테크월드] 데이터메티카·맥케이 생성형 AI 콘텐츠 제작 솔루션 MoAI 개발",
    description:
      "고품질 DB구축 서비스 제공 전문기업 ㈜데이터메티카는 ㈜맥케이와 함께 국내 최초로 생성형 AI 솔루션 MoAI를 개발하고, 데이터메티카 중국 상해 지사를 시작으로 글로벌 시장에 진출한다고 27일 밝혔다. 이 솔루션은 ㈜데이터메티카에서 총판으로...",
    source: "https://www.epnc.co.kr/news/articleView.html?idxno=240984",
    thumbnail: "/news/2024/24022801.avif",
  },
  {
    id: "24022201",
    date: "2024년 2월 22일",
    year: 2024,
    title:
      "[벤처스퀘어] 데이터메티카, AI 바우처·데이터 바우처 공급기업 동시 선정",
    description:
      "인공지능(AI) 학습 데이터 전문 기업 데이터메티카가 과학기술정보통신부가 주관하는 2024년 AI 바우처 지원사업 및 데이터 바우처 지원사업의 공급 기업으로 동시에 선정되었다.",
    source: "https://www.venturesquare.net/914597",
    thumbnail: "/news/2024/24022201.avif",
  },
  {
    id: "24012601",
    date: "2024년 1월 26일",
    year: 2024,
    title:
      "[비욘드포스트] 데이터메티카·인포뱅크·전북대학교 RIS 미래수송기기 사업단 MoU 체결",
    description:
      "AAM 3차원 공간 관리 시스템 개발 협력을 위해 데이터메티카와 인포뱅크, 전북대학교 RIS 미래수송기기 사업단이 업무협약(MoU)을 체결했다.",
    source:
      "https://www.beyondpost.co.kr/view.php?ud=20240126104944330446a9e4dd7f_30",
    thumbnail: "/news/2024/24012601.avif",
  },
  {
    id: "24011801",
    date: "2024년 1월 18일",
    year: 2024,
    title:
      "[디지털투데이] 데이터메티카, ISO 27001 정보보호경영시스템 인증 획득",
    description:
      "자율주행 데이터 어노테이션 기업 데이터메티카가 인공지능 학습 데이터 구축 서비스 및 소프트웨어 개발 분야에 대해 ISO 27001 정보보호경영시스템 인증을 획득했다.",
    source: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=502583",
    thumbnail: "/news/2024/24011801.avif",
  },
  {
    id: "23121101",
    date: "2023년 12월 11일",
    year: 2023,
    title: "ISO 27001 정보보호경영시스템(ISMS) 인증 획득",
    description:
      "㈜데이터메티카는 지난 12월 8일 인공지능 학습용 데이터 구축 서비스와 소프트웨어 개발 분야, 자율주행 차량 운영 관제 서비스에 대해 ISO 27001 정보보호경영시스템 인증을 획득했다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/iso-27001-정보보호경영시스템-isms-인증-획득",
    thumbnail: "/news/2023/23121101.avif",
  },
  {
    id: "23090501",
    date: "2023년 9월 5일",
    year: 2023,
    title: "전문연구사업자(융합 연구개발업) 신고 완료",
    description:
      "주식회사 데이터메티카는 지난 7월 28일 융합 연구개발업으로 전문연구사업자 신고를 완료했다. 이에 따라 데이터메티카는 높은 수준의 전문성과 신뢰성을 인정받았음을 알렸다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/전문연구사업자-융합-연구개발업-신고",
    thumbnail: "/news/2023/23090501.avif",
  },
  {
    id: "23070401",
    date: "2023년 7월 4일",
    year: 2023,
    title: "2023 인공지능 학습용 데이터 가공 및 검 크라우드 워커 모집",
    description:
      "주식회사 데이터메티카는 2023년도 자율주행 사업의 가공 및 검 크라우드 워커를 채용한다고 밝혔다. 어노테이션 유형은 2D Polygon, 2D Bounding Box 등이 포함된다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/2023-%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5-%ED%95%99%EC%8A%B5%EC%9A%A9-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B0%80%EA%B3%B5-%EB%B0%8F-%EA%B2%80-%ED%81%AC%EB%9D%BC%EC%9A%B0%EB%93%9C-%EC%9B%8C%EC%BB%A4-%EB%AA%A8%EC%A7%91",
    thumbnail: "/news/2023/23070401.avif",
  },
  {
    id: "23051701",
    date: "2023년 5월 17일",
    year: 2023,
    title: "[G밸리뉴스] 데이터메티카, 2023 국제인공지능대전 성료",
    description:
      "데이터메티카는 ‘2023 국제인공지능대전(AI EXPO KOREA)’에 참가해 성공적으로 전시를 마쳤다고 밝혔다. 해당 행사는 국내외 AI 기업과 연구기관이 참여한 국내 최대 규모의 인공지능 행사이다.",
    source: "https://www.kfenews.co.kr/news/articleView.html?idxno=609812",
    thumbnail: "/news/2023/23051701.avif",
  },
  {
    id: "23051501",
    date: "2023년 5월 15일",
    year: 2023,
    title: "DataMatica Teams Up with BasicAI to Boost Annotation Teamwork",
    description:
      "After achieving remarkable success in R&D, BasicAI has garnered global acclaim, including recognition from several Korean companies. DataMatica announced a collaboration with BasicAI to enhance data annotation teamwork and strengthen AI data services.",
    source: "https://www.basic.ai/blog-post/customers-datamatica",
    thumbnail: "/news/2023/23051501.avif",
  },
  {
    id: "23041201",
    date: "2023년 4월 12일",
    year: 2023,
    title: "ISO 9001 품질경영체계 인증 획득",
    description:
      "㈜데이터메티카는 지난 4월 12일 인공지능 학습용 데이터 구축 서비스 및 소프트웨어 개발 분야에 대해 ISO 9001 품질경영체계 인증을 획득했다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/iso-9001-%ED%92%88%EC%A7%88%EA%B2%BD%EC%98%81%EC%B2%B4%EA%B3%84-%EC%9D%B8%EC%A6%9D-%ED%9A%8D%EB%93%9D",
    thumbnail: "/news/2023/23041201.avif",
  },
  {
    id: "23032301",
    date: "2023년 3월 23일",
    year: 2023,
    title: "[경제in뉴스] 글로벌 데이터 어노테이션의 시작, 데이터메티카",
    description:
      "현대에 ‘데이터’는 여러 산업에 이용되는 중요한 요소 중 하나이다. 기업이 보유한 고객의 데이터를 수집해 고객 맞춤형 제품을 제공하거나 서비스에 대한 피드백을 받아 개선을 도모하는 등 다양한 산업에서 데이터 활용이 확대되고 있다.",
    source: "https://www.newseconomy.kr/news/articleView.html?idxno=4786",
    thumbnail: "/news/2023/23032301.avif",
  },
  {
    id: "23032001",
    date: "2023년 3월 20일",
    year: 2023,
    title: "가천대학교 대학-산업체 간 조기취업형 계약학과 운영 협약",
    description:
      "가천대학교 미래자동차학과와 데이터메티카 간 협약이 체결되었으며, 학생들이 보다 확실한 목적 의식과 열정을 가지고 실전에 강한 인재로 성장할 수 있도록 산학 협력을 강화할 예정이다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/가천대학교-대학-산업체-간-조기취업형-계약학과-운영-협약",
    thumbnail: "/news/2023/23032001.avif",
  },
  {
    id: "23032002",
    date: "2023년 3월 20일",
    year: 2023,
    title: "(주) 데이터메티카 기업부설연구소 설립",
    description:
      "㈜데이터메티카는 연구 전담 조직 운영 및 연구 역량 강화를 위해 기업부설연구소를 설립했다. 기업부설연구소를 통해 연구개발 인력을 상시 확보하고 기술 경쟁력을 높여나갈 계획이다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/주-데이터메티카-기업부설연구소-설립",
    thumbnail: "/news/2023/23032002.avif",
  },
  {
    id: "23032003",
    date: "2023년 3월 20일",
    year: 2023,
    title: "[강원일보] 인공지능으로 산불·홍수 예방시스템 추진",
    description:
      "강릉과학산업진흥원 공모 사업 참여를 통해 강원도 내 자연재해 대응을 위한 인공지능 기반 데이터 구축 및 예방 시스템 개발이 추진된다.",
    source: "https://www.kwnews.co.kr/page/view/2022032400000000146",
    thumbnail: "/news/2023/23032003.avif",
  },
  {
    id: "23032004",
    date: "2023년 3월 20일",
    year: 2023,
    title: "倍赛科技与韩国 DataMatica 成立合资公司，携手共拓亚太新机遇",
    description:
      "倍赛科技与韩国 AI 数据服务企业 DataMatica 宣布成立合资公司，双方将整合 AI 数据处理与数据服务能力，推动亚太地区人工智能数据产业发展。",
    source: "https://zhuanlan.zhihu.com/p/578998346",
    thumbnail: "/news/2023/23032004.avif",
  },
  {
    id: "23032005",
    date: "2023년 3월 20일",
    year: 2023,
    title: "BASIC AI and DATAMATICA embark on strategic cooperation",
    description:
      "BasicAI, a leading AI software infrastructure provider, announced a strategic partnership with DataMatica to strengthen collaboration in AI data infrastructure and global data services.",
    source:
      "https://raphaelchu.wixsite.com/website/post/basic-ai-and-datamatica-embark-on-strategic-cooperation-toward-the-realization-of-data-centric",
    thumbnail: "/news/2023/23032005.avif",
  },
  {
    id: "23032006",
    date: "2023년 3월 20일",
    year: 2023,
    title: "SIEMENS 공식 파트너사 체결",
    description:
      "지멘스는 독일 기반의 글로벌 기술 기업으로 산업, 인프라, 모빌리티, 헬스케어 등 다양한 분야에서 혁신적인 기술을 제공하고 있다. 데이터메티카는 SIEMENS와의 공식 파트너십 체결을 통해 산업 데이터 및 디지털 솔루션 분야에서 협력을 강화할 계획이다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/siemens-%EA%B3%B5%EC%8B%9D-%ED%8C%8C%ED%8A%B8%EB%84%88%EC%82%AC-%EC%B2%B4%EA%B2%B0",
    thumbnail: "/news/2023/23032006.avif",
  },
  {
    id: "20201501",
    date: "2020년 10월 15일",
    year: 2020,
    title: "BASIC.AI 제휴 VAR Agreement 체결",
    description:
      "BASIC.AI는 AI 학습용 데이터 구축 업계의 선도 기업으로 효율적인 데이터 중심 MLOps 소프트웨어 인프라를 제공한다. 데이터메티카는 BASIC.AI와 VAR(Value Added Reseller) Agreement를 체결하고 AI 데이터 어노테이션 및 데이터 구축 플랫폼 분야에서 협력을 확대한다.",
    source:
      "https://raphaelchu.wixsite.com/website/post/the-secret-behind-establishing-new-data-centers",
    thumbnail: "/news/2020/20201501.avif",
  },
];
