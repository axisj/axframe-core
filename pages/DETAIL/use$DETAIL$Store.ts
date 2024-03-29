import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";
import {
  ExampleDetailRequest,
  ExampleItem,
  ExampleSaveRequest,
} from "@core/services/example/ExampleRepositoryInterface";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import pick from "lodash/pick";
import { ExampleService } from "services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface SaveRequest extends ExampleSaveRequest {}

interface APIDetailRequest extends ExampleDetailRequest {}

interface DtoItem extends ExampleItem {}

interface MetaData {
  programFn?: ProgramFn;
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  detailSpinning: boolean;
  detail?: DtoItem;
}

interface Actions extends PageStoreActions<States> {
  setDetailRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setDetailSpinning: (exampleSaveSpinning: boolean) => void;
  callDetailApi: (request?: APIDetailRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.LIST_DETAIL.children.DETAIL.path,
  saveRequestValue: {},
  detailSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  setDetailRequestValue: (requestValue) => {
    set({ saveRequestValue: requestValue });
  },
  setDetailSpinning: (spinning) => set({ detailSpinning: spinning }),
  callDetailApi: async (request) => {
    if (get().detailSpinning) return;
    set({ detailSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      const response = await ExampleService.detail(apiParam);

      console.log(response);

      set({ detail: response.rs });
    } finally {
      set({ detailSpinning: false });
    }
  },
  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = ["programFn", "saveRequestValue"];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $DETAIL$Store extends States, Actions, PageStoreActions<States> {}

export const use$DETAIL$Store = create(
  subscribeWithSelector<$DETAIL$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

use$DETAIL$Store.subscribe(
  (s) => [s.programFn, s.saveRequestValue],
  ([programFn, saveRequestValue]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      programFn,
      saveRequestValue: saveRequestValue,
    });
  },
  { equalityFn: shallow },
);
