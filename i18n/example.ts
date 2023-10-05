export const EN_example = {
  detail: {
    title: "Detail Example",
  },
  list: {
    title: "List Example",
  },
  listAndDrawer: {
    title: "List & Drawer",
  },
  listAndModal: {
    title: "List & Modal",
  },
  listWithList: {
    title: "List & List",
  },
  threeList: {
    title: "Three List",
  },
  listWithForm: {
    title: "List & Form",
  },
  listWithFormRow: {
    title: "List & Form (Row)",
  },
  stats: {
    title: "Statistics",
    tabs: {
      pg1: "사업장별 취식정보",
      pg2: "식구분별 취식정보",
    },
  },
  datagrid: {
    id: "Id",
    성명: "Name",
    상담일: "Date",
    행정구: "Area",
    생년월일: "BirthDay",
    연락처: "Phone",
    상담방법: "Way1",
    상담경로: "WayPath",
    가구유형: "HomeType",
    거주형태: "HomeST",
    수급: "ETC",
    주요욕구: "App Desire",
    상담원: "Employee",
    번호: "No.",
    제목: "Title",
    내용: "Content",
    등록일: "Date",
    조회수: "Visits",
    userNm: "UserNm",
    method: "Method",
    path: "Path",
    parameter: "Parameter",
    createdAt: "CreatedAt",
    desc: "Description",
  },
  form: {
    title: "Form Example",
    title1: "personal data",
    title2: "Details of consultation",
    area: {
      label: "Districts",
      options: [
        { label: "중구", value: "중구" },
        { label: "동구", value: "동구" },
        { label: "서구", value: "서구" },
        { label: "남구", value: "남구" },
        { label: "북구", value: "북구" },
        { label: "수성구", value: "수성구" },
        { label: "달서구", value: "달서구" },
        { label: "달성군", value: "달성군" },
      ],
    },
    cnsltUserCd: {
      label: "consultant",
    },
    cnsltDt: {
      label: ["Start Date", "End Date"],
    },
    cnsltHow: {
      label: "Consultation method",
      options: [
        { value: "유선", label: "Wired" },
        { value: "내방", label: "Visit" },
        { value: "방문", label: "Visit1" },
        { value: "이동상담", label: "Mobile counseling" },
        { value: "기타", label: "Etc" },
      ],
    },
    cnsltHowEtc: {
      label: "",
    },
    cnsltPath: {
      label: "Consultation path",
      options: [
        { value: "", label: "Clear" },
        { value: "관련기관", label: "related organization" },
        { value: "개인소개", label: "Personal introduction" },
        { value: "본인직접", label: "Self" },
        { value: "기타기관", label: "Etc" },
      ],
    },
    cnsltPathDtl: {
      label: "",
      options: [
        { value: "동사무소/구청", label: "district office" },
        { value: "복지관", label: "welfare center" },
        { value: "보건소", label: "Public health center" },
        { value: "관리사무소", label: "management office" },
        { value: "복지기관", label: "welfare institution" },
        { value: "시민사회단체", label: "civil society organization" },
      ],
    },
    cnsltPathPerson: {
      label: "",
      placeholder: "the name of the introducer",
    },
    cnsltPathDirect: {
      label: "",
      placeholder: "Recognition path",
    },
    cnsltPathOrg: {
      label: "",
      placeholder: "Name of the organization",
    },
    cnsltPathOrgPerson: {
      label: "",
      placeholder: "The person in charge",
    },
    cnsltPathOrgPhone: {
      label: "",
      placeholder: "Phone number",
    },
    name: {
      label: "Name",
    },
    birthDt: {
      label: "birth Day",
    },
    age: {
      prefix: "",
      suffix: "olds",
    },
    sex: {
      label: "Gender",
      options: [
        { value: "남", label: "M" },
        { value: "여", label: "W" },
      ],
    },
    phone1: {
      label: "phone 1",
    },
    phone2: {
      label: "phone 2",
    },
    hndcapYn: {
      label: "Presence of disability",
      options: [
        { value: "유", label: "Y" },
        { value: "무", label: "N" },
      ],
    },
    hndcapGrade: {
      label: "Disability rating",
      options: [
        { value: "심한 장애인", label: "severely handicapped" },
        { value: "심하지않은 장애인", label: "mildly disabled person" },
      ],
    },
    hndcapTyp: {
      label: "Type of disability",
      options: [
        { value: "지체장애", label: "physical disability" },
        { value: "뇌병변장애", label: "brain lesion disorder" },
        { value: "시각장애", label: "visual impairment" },
        { value: "청각장애", label: "hearing impairment" },
        { value: "언어장애", label: "speech impediment" },
        { value: "안면장애", label: "facial disorder" },
        { value: "정신지체", label: "mental retardation" },
        { value: "발달장애", label: "developmental disorder" },
        { value: "정신장애", label: "mental disorder" },
        { value: "신장장애", label: "kidney failure" },
        { value: "심장장애", label: "heart disorder" },
        { value: "호흡기장애", label: "respiratory problems" },
        { value: "간장애", label: "liver disorder" },
        { value: "장루요류장애", label: "intestinal urinary tract disorder" },
        { value: "간질장애", label: "epileptic disorder" },
      ],
    },
    addr: {
      label: "Address",
    },
    hopePoint: {
      label: "",
      직접지원: "Direct support",
      주거정보자원: "Residential Information Resources",
      내부자원: "Internal resources",
      기타: "ETC",
      세부내용: "Details",
    },
    hopePoint1: {
      label: "",
      options: [
        { value: "긴급임대료", label: "Emergency rent" },
        { value: "집수리", label: "house repair" },
        { value: "긴급연료", label: "emergency fuel" },
        { value: "보증금지원", label: "Deposit support" },
        { value: "주거이전지원(이사비)", label: "Housing relocation support" },
        { value: "기타", label: "ETC" },
      ],
    },
    hopePoint1Etc: {
      label: "",
    },
    hopePoint2: {
      label: "",
      options: [
        { value: "임대주택", label: "a rental house" },
        { value: "융자정보", label: "Loan information" },
        { value: "청약정보", label: "Subscription information" },
        { value: "대출정보", label: "Loan information" },
        { value: "재개발/뉴타운", label: "a redevelopment/new town" },
        { value: "기타", label: "ETC" },
      ],
    },
    hopePoint2Etc: {
      label: "",
    },
    hopePoint3: {
      label: "",
      options: [
        { value: "주거복지", label: "residential welfare" },
        { value: "주거물품지원", label: "Support for residential items" },
        { value: "연료지원", label: "Fuel support" },
        { value: "긴급지원주택", label: "Emergency Support Housing" },
        { value: "주거상향", label: "residential improvement" },
        { value: "주거비소액대출", label: "Small loan for housing expenses" },
        { value: "청약저축", label: "Subscription savings" },
        { value: "비주택거주자", label: "a non-resident" },
        { value: "노후주택개보수", label: "Renovation of old houses" },
        { value: "주거안정지원", label: "Housing stabilization support" },
        { value: "사랑의집수리", label: "Repairing the House of Love" },
        { value: "아동주거환경개선", label: "Improvement of Residential Environment for Children" },
        { value: "기타", label: "ETC" },
      ],
    },
    hopePoint3Etc: {
      label: "",
    },
    hopePoint4Etc: {
      label: "",
    },
    hopePoint5Etc: {
      label: "",
    },
    fldT: {
      label: "Major consultation details",
    },
  },
};
export const KO_example: typeof EN_example = {
  detail: {
    title: "Detail 예제",
  },
  list: {
    title: "목록 예제",
  },
  listAndDrawer: {
    title: "목록과 서랍",
  },
  listAndModal: {
    title: "목록과 모달",
  },
  listWithList: {
    title: "목록과 목록",
  },
  threeList: {
    title: "3개 목록",
  },
  listWithForm: {
    title: "목록과 양식",
  },
  listWithFormRow: {
    title: "목록과 폼 (상하)",
  },
  stats: {
    title: "통계",
    tabs: {
      pg1: "사업장별 취식정보",
      pg2: "식구분별 취식정보",
    },
  },
  datagrid: {
    id: "Id",
    성명: "성명",
    상담일: "상담일",
    행정구: "행정구",
    생년월일: "생년월일",
    연락처: "연락처1",
    상담방법: "상담방법",
    상담경로: "상담경로",
    가구유형: "가구유형",
    거주형태: "거주형태",
    수급: "수급",
    주요욕구: "주요욕구",
    상담원: "상담원",
    번호: "번호",
    제목: "제목",
    내용: "내용",
    등록일: "등록일",
    조회수: "조회수",
    userNm: "유저명",
    method: "메소드",
    path: "호출경로",
    parameter: "파라미터",
    createdAt: "생성일",
    desc: "설명",
  },
  form: {
    title: "폼 예제",
    title1: "인적사항",
    title2: "상담내용",
    area: {
      label: "행정구",
      options: [
        { label: "중구", value: "중구" },
        { label: "동구", value: "동구" },
        { label: "서구", value: "서구" },
        { label: "남구", value: "남구" },
        { label: "북구", value: "북구" },
        { label: "수성구", value: "수성구" },
        { label: "달서구", value: "달서구" },
        { label: "달성군", value: "달성군" },
      ],
    },
    cnsltUserCd: {
      label: "상담원",
    },
    cnsltDt: {
      label: ["시작일", "종료일"],
    },
    cnsltHow: {
      label: "상담방법",
      options: [
        { value: "유선", label: "유선" },
        { value: "내방", label: "내방" },
        { value: "방문", label: "방문" },
        { value: "이동상담", label: "이동상담" },
        { value: "기타", label: "기타" },
      ],
    },
    cnsltHowEtc: {
      label: "",
    },
    cnsltPath: {
      label: "상담경로",
      options: [
        { value: "", label: "선택안함" },
        { value: "관련기관", label: "관련기관" },
        { value: "개인소개", label: "개인소개" },
        { value: "본인직접", label: "본인직접" },
        { value: "기타기관", label: "기타기관" },
      ],
    },
    cnsltPathDtl: {
      label: "",
      options: [
        { value: "동사무소/구청", label: "동사무소/구청" },
        { value: "복지관", label: "복지관" },
        { value: "보건소", label: "보건소" },
        { value: "관리사무소", label: "관리사무소" },
        { value: "복지기관", label: "복지기관" },
        { value: "시민사회단체", label: "시민사회단체" },
      ],
    },
    cnsltPathPerson: {
      label: "",
      placeholder: "소개인 성명",
    },
    cnsltPathDirect: {
      label: "",
      placeholder: "인지경로",
    },
    cnsltPathOrg: {
      label: "",
      placeholder: "기관명",
    },
    cnsltPathOrgPerson: {
      label: "",
      placeholder: "담당자",
    },
    cnsltPathOrgPhone: {
      label: "",
      placeholder: "전화번호",
    },
    name: {
      label: "성명",
    },
    birthDt: {
      label: "생년월일",
    },
    age: {
      prefix: "만",
      suffix: "세",
    },
    sex: {
      label: "성별",
      options: [
        { value: "남", label: "남" },
        { value: "여", label: "여" },
      ],
    },
    phone1: {
      label: "연락처 1",
    },
    phone2: {
      label: "연락처 2",
    },
    hndcapYn: {
      label: "장애유무",
      options: [
        { value: "유", label: "유" },
        { value: "무", label: "무" },
      ],
    },
    hndcapGrade: {
      label: "장애등급",
      options: [
        { value: "심한 장애인", label: "심한 장애인" },
        { value: "심하지않은 장애인", label: "심하지않은 장애인" },
      ],
    },
    hndcapTyp: {
      label: "장애종류",
      options: [
        { value: "지체장애", label: "지체장애" },
        { value: "뇌병변장애", label: "뇌병변장애" },
        { value: "시각장애", label: "시각장애" },
        { value: "청각장애", label: "청각장애" },
        { value: "언어장애", label: "언어장애" },
        { value: "안면장애", label: "안면장애" },
        { value: "정신지체", label: "정신지체" },
        { value: "발달장애", label: "발달장애" },
        { value: "정신장애", label: "정신장애" },
        { value: "신장장애", label: "신장장애" },
        { value: "심장장애", label: "심장장애" },
        { value: "호흡기장애", label: "호흡기장애" },
        { value: "간장애", label: "간장애" },
        { value: "장루요류장애", label: "장루요류장애" },
        { value: "간질장애", label: "간질장애" },
      ],
    },
    addr: {
      label: "주소",
    },
    hopePoint: {
      label: "",
      직접지원: "직접지원",
      주거정보자원: "주거정보자원",
      내부자원: "내부자원",
      기타: "기타",
      세부내용: "세부내용",
    },
    hopePoint1: {
      label: "",
      options: [
        { value: "긴급임대료", label: "긴급임대료" },
        { value: "집수리", label: "집수리" },
        { value: "긴급연료", label: "긴급연료" },
        { value: "보증금지원", label: "보증금지원" },
        { value: "주거이전지원(이사비)", label: "주거이전지원(이사비)" },
        { value: "기타", label: "기타" },
      ],
    },
    hopePoint1Etc: {
      label: "",
    },
    hopePoint2: {
      label: "",
      options: [
        { value: "임대주택", label: "임대주택" },
        { value: "융자정보", label: "융자정보" },
        { value: "청약정보", label: "청약정보" },
        { value: "대출정보", label: "대출정보" },
        { value: "재개발/뉴타운", label: "재개발/뉴타운" },
        { value: "기타", label: "기타" },
      ],
    },
    hopePoint2Etc: {
      label: "",
    },
    hopePoint3: {
      label: "",
      options: [
        { value: "주거복지", label: "주거복지" },
        { value: "주거물품지원", label: "주거물품지원" },
        { value: "연료지원", label: "연료지원" },
        { value: "긴급지원주택", label: "긴급지원주택" },
        { value: "주거상향", label: "주거상향" },
        { value: "주거비소액대출", label: "주거비소액대출" },
        { value: "청약저축", label: "청약저축" },
        { value: "비주택거주자", label: "비주택거주자" },
        { value: "노후주택개보수", label: "노후주택개보수" },
        { value: "주거안정지원", label: "주거안정지원" },
        { value: "사랑의집수리", label: "사랑의집수리" },
        { value: "아동주거환경개선", label: "아동주거환경개선" },
        { value: "기타", label: "기타" },
      ],
    },
    hopePoint3Etc: {
      label: "",
    },
    hopePoint4Etc: {
      label: "",
    },
    hopePoint5Etc: {
      label: "",
    },
    fldT: {
      label: "주요상담내용",
    },
  },
};
