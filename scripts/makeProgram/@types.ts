enum ProgramType {
  DETAIL,
  FORM,
  LIST,
  LIST_AND_DRAWER,
  LIST_AND_MODAL,
  LIST_WITH_FORM,
  LIST_WITH_FORM_LIST,
  LIST_WITH_FORM_ROW,
  LIST_WITH_LIST,
  THREE_LIST,
  STATS,
}

interface Program {
  code: string;
  url?: string;
  name: string | string[];
  type: keyof typeof ProgramType;
}

export interface ProgramConfig {
  pagesDir: string;
  templateDir: string;
  programTypeFile: string;
  pageRouteFile: string;
  programs: Program[];
}
