/**
 * LojasContext.tsx
 *
 * Mantém o estado global de lojas cadastradas no app.
 * A loja 'Sem loja' é criada automaticamente como valor padrão.
 * Outras lojas podem ser adicionadas, renomeadas e excluídas.
 */
import React, { createContext, useState, ReactNode } from 'react';

export type Loja = {
  id: string;
  nome: string;
};

export type LojasContextType = {
  lojas: Loja[];
  adicionarLoja: (nome: string) => void;
  atualizarLoja: (id: string, novoNome: string) => void;
  excluirLoja: (id: string) => void;
};

export const LojasContext = createContext<LojasContextType>({
  lojas: [],
  adicionarLoja: () => {},
  atualizarLoja: () => {},
  excluirLoja: () => {},
});

export const LojasProvider = ({ children }: { children: ReactNode }) => {
  const [lojas, setLojas] = useState<Loja[]>([
    { id: 'sem-loja', nome: 'Sem loja' },
  ]);

  // Adiciona uma nova loja ao estado global.
  // Nomes vazios ou duplicados de 'Sem loja' são ignorados.
  const adicionarLoja = (nome: string) => {
    const novoNome = nome.trim();
    if (!novoNome || novoNome.toLowerCase() === 'sem loja') return;
    setLojas((prevLojas) => [...prevLojas, { id: String(Date.now()), nome: novoNome }]);
  };

  // Atualiza o nome de uma loja existente.
  const atualizarLoja = (id: string, novoNome: string) => {
    const nomeTrimmed = novoNome.trim();
    if (!nomeTrimmed) return;
    setLojas((prevLojas) =>
      prevLojas.map((loja) =>
        loja.id === id ? { ...loja, nome: nomeTrimmed } : loja
      )
    );
  };

  // Remove uma loja do estado global.
  const excluirLoja = (id: string) => {
    setLojas((prevLojas) => prevLojas.filter((loja) => loja.id !== id));
  };

  return (
    <LojasContext.Provider value={{ lojas, adicionarLoja, atualizarLoja, excluirLoja }}>
      {children}
    </LojasContext.Provider>
  );
};
