export type Store = {
  id: string;
  name: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  storeId: string;
  purchased: boolean;
};

export type PantryItem = {
  name: string;
  quantity: number;
};
