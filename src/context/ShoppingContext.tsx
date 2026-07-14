import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';

import { PantryItem, ShoppingItem, Store } from '../types';

type ShoppingState = {
  stores: Store[];
  items: ShoppingItem[];
  pantry: PantryItem[];
};

type AddItemPayload = {
  name: string;
  quantity: number;
  storeId: string;
};

type ShoppingAction =
  | { type: 'ADD_ITEM'; payload: AddItemPayload }
  | { type: 'TOGGLE_ITEM_PURCHASED'; payload: { itemId: string } };

type ShoppingContextValue = ShoppingState & {
  addItem: (payload: AddItemPayload) => void;
  toggleItemPurchased: (itemId: string) => void;
};

const initialStores: Store[] = [
  { id: 'mercado-centro', name: 'Mercado Centro' },
  { id: 'atacado-zona-sul', name: 'Atacado Zona Sul' },
  { id: 'hortifruti-bairro', name: 'Hortifruti do Bairro' },
];

const initialState: ShoppingState = {
  stores: initialStores,
  items: [
    { id: 'item-1', name: 'Arroz', quantity: 1, storeId: initialStores[0].id, purchased: false },
    { id: 'item-2', name: 'Leite', quantity: 2, storeId: initialStores[1].id, purchased: false },
  ],
  pantry: [{ name: 'Macarrão', quantity: 1 }],
};

const ShoppingContext = createContext<ShoppingContextValue | undefined>(undefined);

const normalizeName = (name: string) => name.trim().toLowerCase();

const upsertPantryItem = (pantry: PantryItem[], name: string, quantityDelta: number) => {
  const normalizedTarget = normalizeName(name);

  const updated = pantry
    .map((item) => {
      if (normalizeName(item.name) !== normalizedTarget) {
        return item;
      }

      return { ...item, quantity: item.quantity + quantityDelta };
    })
    .filter((item) => item.quantity > 0);

  const alreadyExists = updated.some((item) => normalizeName(item.name) === normalizedTarget);

  if (!alreadyExists && quantityDelta > 0) {
    updated.push({ name: name.trim(), quantity: quantityDelta });
  }

  return updated;
};

const shoppingReducer = (state: ShoppingState, action: ShoppingAction): ShoppingState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const itemName = action.payload.name.trim();

      if (!itemName || action.payload.quantity <= 0) {
        return state;
      }

      const newItem: ShoppingItem = {
        id: `${Date.now()}-${itemName}`,
        name: itemName,
        quantity: action.payload.quantity,
        storeId: action.payload.storeId,
        purchased: false,
      };

      return {
        ...state,
        items: [newItem, ...state.items],
      };
    }

    case 'TOGGLE_ITEM_PURCHASED': {
      const targetItem = state.items.find((item) => item.id === action.payload.itemId);

      if (!targetItem) {
        return state;
      }

      const willBePurchased = !targetItem.purchased;
      const quantityDelta = willBePurchased ? targetItem.quantity : -targetItem.quantity;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, purchased: willBePurchased } : item,
        ),
        pantry: upsertPantryItem(state.pantry, targetItem.name, quantityDelta),
      };
    }

    default:
      return state;
  }
};

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  const value = useMemo(
    () => ({
      ...state,
      addItem: (payload: AddItemPayload) => dispatch({ type: 'ADD_ITEM', payload }),
      toggleItemPurchased: (itemId: string) =>
        dispatch({ type: 'TOGGLE_ITEM_PURCHASED', payload: { itemId } }),
    }),
    [state],
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShoppingContext() {
  const context = useContext(ShoppingContext);

  if (!context) {
    throw new Error('useShoppingContext deve ser usado dentro de ShoppingProvider');
  }

  return context;
}
