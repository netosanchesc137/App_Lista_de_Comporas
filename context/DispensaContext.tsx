/**
 * DispensaContext.tsx
 *
 * Gerencia o estoque da dispensa separadamente da lista global de itens.
 * A dispensa guarda itens que já foram comprados ou armazenados.
 * O contexto sincroniza com ItensContext quando um mesmo item
 * também existe como item principal com loja 'Dispensa'.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Item } from './ItensContext';
import { ItensContext } from './ItensContext';

export type DispensaItem = Item;

export type DispensaContextType = {
  dispensa: DispensaItem[];
  adicionarNaDispensa: (item: DispensaItem) => void;
  definirQuantidadeNaDispensa: (item: DispensaItem) => void;
  atualizarDispensa: (itensAtualizados: DispensaItem[]) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  baixarQuantidade: (id: string) => void;
  excluirItem: (id: string) => void;
  removerDaDispensa: (id: string) => void;
};

export const DispensaContext = createContext<DispensaContextType>({
  dispensa: [],
  adicionarNaDispensa: () => {},
  definirQuantidadeNaDispensa: () => {},
  atualizarDispensa: () => {},
  atualizarQuantidade: () => {},
  baixarQuantidade: () => {},
  excluirItem: () => {},
  removerDaDispensa: () => {},
});

export const DispensaProvider = ({ children }: { children: ReactNode }) => {
  const [dispensa, setDispensa] = useState<DispensaItem[]>([]);
  const { obterItemPorId, atualizarItem } = useContext(ItensContext);

  // Adiciona um item na dispensa.
  //
  // 1. Procura por id primeiro: se já existe um item com o mesmo id,
  //    significa que é o mesmo registro e devemos somar as quantidades.
  // 2. Se não existir id, procura por nome para evitar duplicação de itens
  //    com nomes iguais na dispensa.
  // 3. Se ainda assim não existir, adiciona o item como novo registro na dispensa.
  const adicionarNaDispensa = (item: DispensaItem) => {
    setDispensa((prevDispensa) => {
      const existentePorId = prevDispensa.find((d) => d.id === item.id);
      if (existentePorId) {
        return prevDispensa.map((d) =>
          d.id === item.id ? { ...d, quantidade: d.quantidade + item.quantidade } : d
        );
      }

      const existentePorNome = prevDispensa.find((d) => d.nome === item.nome);
      if (existentePorNome) {
        return prevDispensa.map((d) =>
          d.nome === item.nome ? { ...d, quantidade: d.quantidade + item.quantidade, loja: 'Dispensa' } : d
        );
      }

      return [...prevDispensa, { ...item, loja: 'Dispensa' }];
    });
  };

  // Atualiza ou cria um item na dispensa usando a quantidade exata informada.
  //
  // Esse método é usado quando um item já existente precisa ser ajustado
  // para ter uma quantidade específica, não apenas somar um valor.
  // Ele também mantém o registro de loja como 'Dispensa'.
  const definirQuantidadeNaDispensa = (item: DispensaItem) => {
    const itemExistenteEmItens = obterItemPorId(item.id);

    setDispensa((prevDispensa) => {
      const existentePorId = prevDispensa.find((d) => d.id === item.id);
      if (existentePorId) {
        return prevDispensa.map((d) =>
          d.id === item.id ? { ...d, quantidade: item.quantidade, nome: item.nome, loja: 'Dispensa' } : d
        );
      }

      const existentePorNome = prevDispensa.find((d) => d.nome === item.nome);
      if (existentePorNome) {
        return prevDispensa.map((d) =>
          d.nome === item.nome ? { ...d, quantidade: item.quantidade, id: item.id, loja: 'Dispensa' } : d
        );
      }

      return [...prevDispensa, { ...item, loja: 'Dispensa' }];
    });

    // Se o item também estiver na lista global como 'Dispensa', atualize
    // a quantidade lá também para manter a lista principal sincronizada.
    if (itemExistenteEmItens?.loja === 'Dispensa') {
      atualizarItem(itemExistenteEmItens.id, { quantidade: item.quantidade });
    }
  };

  const atualizarDispensa = (novaLista: DispensaItem[]) => {
    setDispensa(novaLista);
  };

  // Atualiza somente a quantidade de um item na dispensa.
  // Se o item também estiver na lista global como dispensa,
  // aplica a atualização lá também.
  // Atualiza a quantidade de um item específico na dispensa.
  // Se o mesmo item também existir na lista global como 'Dispensa',
  // mantém essa quantidade sincronizada ali também.
  const atualizarQuantidade = (id: string, quantidade: number) => {
    setDispensa((prevDispensa) =>
      prevDispensa.map((item) =>
        item.id === id ? { ...item, quantidade } : item
      )
    );

    const itemEmItens = obterItemPorId(id);
    if (itemEmItens?.loja === 'Dispensa') {
      atualizarItem(id, { quantidade });
    }
  };

  // Subtrai uma unidade do item na dispensa.
  // Se a quantidade chegar a 0, o item é removido automaticamente.
  const baixarQuantidade = (id: string) => {
    setDispensa((prevDispensa) =>
      prevDispensa
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  // Remove um item da dispensa e, se o mesmo item estiver
  // marcado como loja 'Dispensa' na lista global, move-o para 'Sem loja'.
  // Remove o item da vista da dispensa, mas mantém o registro global do item.
  // Quando o mesmo item também estava marcado como 'Dispensa' na lista global,
  // ele é enviado de volta para 'Sem loja'.
  const removerDaDispensa = (id: string) => {
    const itemEmItens = obterItemPorId(id);
    if (itemEmItens?.loja === 'Dispensa') {
      atualizarItem(id, { loja: 'Sem loja' });
    }
    setDispensa((prevDispensa) => prevDispensa.filter((item) => item.id !== id));
  };

  // Exclui o item da dispensa permanentemente.
  // Essa função é usada quando o usuário confirma a remoção definitiva.
  // Também cuida da limpeza do estado global para o mesmo id.
  const excluirItem = (id: string) => {
    const itemEmItens = obterItemPorId(id);
    if (itemEmItens?.loja === 'Dispensa') {
      atualizarItem(id, { loja: 'Sem loja' });
    }
    setDispensa((prevDispensa) => prevDispensa.filter((item) => item.id !== id));
  };

  return (
    <DispensaContext.Provider
      value={{
        dispensa,
        adicionarNaDispensa,
        definirQuantidadeNaDispensa,
        atualizarDispensa,
        atualizarQuantidade,
        baixarQuantidade,
        excluirItem,
        removerDaDispensa,
      }}
    >
      {children}
    </DispensaContext.Provider>
  );
};
