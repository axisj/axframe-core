import { create } from "zustand";
import { ExampleSaveRequest } from "@core/services/example/ExampleRepositoryInterface";
import { ExampleService } from "services";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { convertDateToString } from "@core/utils/object";
import { ProgramFn } from "@types";
import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";

interface SaveRequest extends ExampleSaveRequest {}

interface MetaData {
  programFn?: ProgramFn;
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  saveSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.LIST_DETAIL.children.REGISTRATION.path,
  saveRequestValue: {},
  saveSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
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
      apiParam.__status__ = "C";

      const response = await ExampleService.save(convertDateToString(apiParam));

      console.log(response);
    } finally {
      set({ saveSpinning: false });
    }
  },
  syncMetadata: (s = createState) => set(s),

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $FORM$Store extends States, Actions, PageStoreActions<States> {}

export const use$FORM$Store = create(
  subscribeWithSelector<$FORM$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

use$FORM$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    saveRequestValue: s.saveRequestValue,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
