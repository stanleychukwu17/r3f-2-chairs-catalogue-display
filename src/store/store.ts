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
  pageDetails: PageDetailsMap;
  setPageDetails: (page:number, scrollPercentage: number) => void
};

export const useStore = create<Store>(() => ({
  pageDetails: { 100: {page: -1, scrollPercentage: 0} },
  setPageDetails: (page:number, scrollPercentage: number) => {
    const pageDetails = useStore.getState().pageDetails
    pageDetails[page] = {page, scrollPercentage}
    console.log("updated page store details", {page, scrollPercentage})
  }
}));

export default useStore;