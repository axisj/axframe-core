import { PROGRAM_TYPES } from "../../router";

export const EXAMPLE_router = {
  path: "examples",
  children: {
    LIST_DETAIL: {
      path: "listAndDetail",
      children: {
        REGISTRATION: {
          program_type: PROGRAM_TYPES.EXAMPLE_FORM,
          path: "registration",
        },
        LIST: {
          program_type: PROGRAM_TYPES.EXAMPLE_LIST,
          path: "list",
        },
        DETAIL: {
          program_type: PROGRAM_TYPES.EXAMPLE_DETAIL,
          path: "detail/:id",
        },
      },
    },

    LIST_AND_MODAL: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_AND_MODAL,
      path: "listAndModal",
    },

    LIST_AND_DRAWER: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_AND_DRAWER,
      path: "listAndDrawer",
    },

    LIST_WITH_LIST: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_WITH_LIST,
      path: "listWithList",
    },

    LIST_WITH_FORM: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_WITH_FORM,
      path: "listWithForm",
    },

    LIST_WITH_FORM_LIST: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_WITH_FORM_LIST,
      path: "listWithFormList",
    },

    LIST_WITH_FORM_ROW: {
      program_type: PROGRAM_TYPES.EXAMPLE_LIST_WITH_FORM_ROW,
      path: "listWithFormRow",
    },

    THREE_LIST: {
      program_type: PROGRAM_TYPES.EXAMPLE_THREE_LIST,
      path: "threeList",
    },

    STATS: {
      program_type: PROGRAM_TYPES.EXAMPLE_STATS,
      path: "stats",
    },
  },
};
