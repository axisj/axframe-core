import { create } from "zustand";
import { ExampleItem, ExampleListRequest, ExampleSaveRequest } from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { ExampleService } from "services";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import React from "react";
import { ROUTES } from "router/Routes";
import { convertDateToString } from "@core/utils/object";
import { ProgramFn } from "@types";
import { EXAMPLE_router } from "../../router/exampleRouter.ts";

interface ListRequest extends ExampleListRequest {}

interface SaveRequest extends ExampleSaveRequest {}

interface DtoItem extends ExampleItem {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue: SaveRequest;
  detail?: SaveRequest;
  formActive: boolean;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  listPage: AXFDGPage;
  saveSpinning: boolean;
  detailSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key, detail?: DtoItem) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;
}

// create states
const createState: States = {
  routePath: EXAMPLE_router.children.LIST_WITH_FORM_ROW.path,
  listRequestValue: { pageNumber: 1, pageSize: 100 },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },
  listSortParams: [],
  listSelectedRowKey: "",
  flexGrow: 0.7,
  saveRequestValue: {},
  detail: {},
  saveSpinning: false,
  detailSpinning: false,
  formActive: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: async (key, detail) => {
    set({ listSelectedRowKey: key, saveRequestValue: { ...detail }, detail });
  },
  callListApi: async (request) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const apiParam: ListRequest = {
        ...get().listRequestValue,
        ...request,
      };
      const response = await ExampleService.list(apiParam);

      set({
        listRequestValue: apiParam,
        listData: response.ds.map((values) => ({
          values,
        })),
        listPage: {
          currentPage: response.page.pageNumber ?? 1,
          pageSize: response.page.pageSize ?? 0,
          totalPages: response.page.pageCount ?? 0,
          totalElements: response.page?.totalCount,
        },
      });
    } finally {
      set({ listSpinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    await get().callListApi({
      pageNumber,
      pageSize,
    });
  },
  setFlexGrow: (flexGlow) => {
    set({ flexGrow: flexGlow });
  },
  setSaveRequestValue: (exampleSaveRequestValue) => {
    set({ saveRequestValue: exampleSaveRequestValue });
  },
  setSaveSpinning: (exampleSaveSpinning) => set({ saveSpinning: exampleSaveSpinning }),
  callSaveApi: async (request) => {
    if (get().saveSpinning) return;
    set({ saveSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      if (!apiParam) return;
      apiParam.__status__ = get().listSelectedRowKey ? "U" : "C";

      const response = await ExampleService.save(convertDateToString(apiParam));

      console.log(response);
    } finally {
      set({ saveSpinning: false });
    }
  },
  cancelFormActive: () => {
    set({ formActive: false, listSelectedRowKey: undefined });
  },
  setFormActive: () => {
    set({ formActive: true, detail: undefined, saveRequestValue: undefined });
  },

  syncMetadata: (s = createState) => {
    const metaData: MetaData = {
      programFn: s.programFn,
      listSortParams: s.listSortParams,
      listRequestValue: s.listRequestValue,
      listColWidths: s.listColWidths,
      listSelectedRowKey: s.listSelectedRowKey,
      flexGrow: s.flexGrow,
      saveRequestValue: s.saveRequestValue,
      detail: s.detail,
      formActive: s.formActive,
    };
    set(metaData);
  },
  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_WITH_FORM_ROW$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_WITH_FORM_ROW$Store = create(
  subscribeWithSelector<$LIST_WITH_FORM_ROW$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$LIST_WITH_FORM_ROW$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listSortParams: s.listSortParams,
    listRequestValue: s.listRequestValue,
    listColWidths: s.listColWidths,
    listSelectedRowKey: s.listSelectedRowKey,
    flexGrow: s.flexGrow,
    saveRequestValue: s.saveRequestValue,
    detail: s.detail,
    formActive: s.formActive,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
