// store.ts
import { create } from 'zustand';

type pageDetails = {
  page: number,
  scrollPercentage: number
}

type PageDetailsMap = {
  [key: number]: pageDetails;
};

type Store = {
  windowResized: boolean,
  setWindowResized: (value:boolean) => void;

  pageDetails: PageDetailsMap;
  setPageDetails: (page:number, scrollPercentage: number) => void
};

export const useStore = create<Store>((set, get) => ({
  windowResized: false,
  setWindowResized: (value:boolean) => set({windowResized: value}),

  pageDetails: {
    100: {page: -1, scrollPercentage: 0}
  },
  setPageDetails: (page:number, scrollPercentage: number) => {
    const pageDetails = useStore.getState().pageDetails
    pageDetails[page] = {page, scrollPercentage}
  }
}));

export default useStore;