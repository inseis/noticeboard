import { atom } from "recoil";

export interface IItem {
  name: string;
  id: number;
  category: string;
}

export const categoryState = atom<string[]>({
  key: "categories",
  default: [],
});

export const itemsState = atom<IItem[]>({
  key: "items",
  default: [],
});


