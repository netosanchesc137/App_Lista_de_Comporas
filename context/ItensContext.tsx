/**
 * ItensContext.tsx
 *
 * Fornece o estado global de itens do aplicativo.
 * Cada item tem id, nome, quantidade e loja associada.
 * Este contexto é usado para cadastrar, atualizar,
 * excluir e obter itens por id em várias telas.
 */
import React, { createContext, useState, ReactNode } from 'react';

export type Item = {
  id: string;
  nome: string;
  quantidade: number;
  loja: string;
};

export type ItensContextType = {
  itens: Item[];
  adicionarItem: (item: Item) => void;
  atualizarItem: (id: string, novoItem: Partial<Item>) => void;
  excluirItem: (id: string) => void;
  obterItemPorId: (id: string) => Item | undefined;
};

export const ItensContext = createContext<ItensContextType>({
  itens: [],
  adicionarItem: () => {},
  atualizarItem: () => {},
  excluirItem: () => {},
  obterItemPorId: () => undefined,
});

export const ItensProvider = ({ children }: { children: ReactNode }) => {
  const [itens, setItens] = useState<Item[]>([]);

  // Adiciona um novo item à lista global.
  const adicionarItem = (item: Item) => {
    setItens([...itens, item]);
  };

  // Atualiza campos parciais de um item existente.
  const atualizarItem = (id: string, novoItem: Partial<Item>) => {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, ...novoItem } : item
      )
    );
  };

  // Remove um item da lista global pelo id.
  const excluirItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  // Retorna o item correspondente ao id informado.
  const obterItemPorId = (id: string) => itens.find((item) => item.id === id);

  return (
    <ItensContext.Provider
      value={{ itens, adicionarItem, atualizarItem, excluirItem, obterItemPorId }}
    >
      {children}
    </ItensContext.Provider>
  );
};
