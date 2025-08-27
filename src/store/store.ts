// store.ts
import { createRef, type RefObject } from 'react';
import { create } from 'zustand';

type Store = {
  offset: number;
  sections: number;
  pages: number;
  zoom: number;
  top: RefObject<number | null>;
  setOffset: (amount: number) => void;
  increase: (amount: number) => void;
  decrease: (amount: number) => void;
};

export const useStore = create<Store>((set) => ({
  offset: 0,
  sections: 3,
  pages: 3,
  zoom: 1,
  top: createRef(),
  setOffset: (amount: number) => set((state) => ({ ...state, offset: amount })),
  increase: (amount: number) => set((state) => ({ ...state, offset: state.offset + amount })),
  decrease: (amount: number) => set((state) => ({ ...state, offset: state.offset - amount })),
}));

export default useStore;