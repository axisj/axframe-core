import React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type ModalFactory<T> = (
  open: boolean,
  resolve: (value: T) => T,
  reject: (reason?: any) => void,
  onClose: (evt: React.MouseEvent) => void,
  afterClose: () => void,
) => any;

interface IModalModel<T = any> {
  id: string;
  modalFactory?: ModalFactory<T>;
}

export class ModalModelClass {
  public modal: IModalModel;
  public open: boolean = true;

  public params: unknown;
  public resolve!: (value?: unknown) => void;
  public reject!: (reason?: unknown) => void;
  public onClose!: (evt: React.MouseEvent) => void;
  public afterClose!: () => void;

  public constructor(value: IModalModel) {
    this.modal = value;
  }
}

export interface ModalModel {
  modals: Map<string, ModalModelClass>;
}

export interface ModalActions {
  openModal: <T = void>(modalFactory: ModalFactory<T>, id?: string) => Promise<T>;
  closeModal: (id?: string) => void;
  removeModal: (id?: string) => void;
}

export interface ModalStore extends ModalModel, ModalActions {}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: new Map(),
  openModal: <T = void>(modalFactory, id) => {
    return new Promise<T>((resolve, reject) => {
      if (!id) id = uuidv4();

      if (get().modals.get(id)) {
        return;
      }

      const modal = new ModalModelClass({ id, modalFactory });

      modal.resolve = (value) => {
        get().closeModal(id);
        resolve(value as T);
      };
      modal.reject = (reason) => {
        get().closeModal(id);
        reject(reason);
      };
      modal.onClose = (evt) => {
        if (evt?.target && evt?.currentTarget) {
          if (evt.target["tagName"] !== "INPUT" && evt.target["tagName"] !== "TEXTAREA") {
            modal.reject();
            return;
          }
          evt.currentTarget["focus"]();
        } else {
          modal.reject();
        }
      };
      modal.afterClose = () => {
        get().removeModal(id);
      };

      get().modals.set(id, modal);
      set({ modals: new Map([...get().modals]) });
    });
  },
  closeModal: async (id) => {
    if (id) {
      const modal = get().modals.get(id);
      if (modal) {
        modal.open = false;
      }
    } else {
      // get().modals.clear();
    }

    const modals = new Map([...get().modals]);
    set({ modals });
  },
  removeModal: (id) => {
    if (id) {
      get().modals.delete(id);
      set({ modals: new Map([...get().modals]) });
    }
  },
}));
