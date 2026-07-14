# App Lista de Compras

Aplicativo mobile de lista de compras desenvolvido com **React Native + Expo + TypeScript**.

## Funcionalidades implementadas

- Controle de itens da lista de compras.
- Organização dos itens por lojas.
- Gerenciamento de estoque da dispensa.
- Estado global com **Context API** e reducer.
- Fluxo de compra com sincronização automática do estoque:
  - Ao marcar um item como comprado, ele entra no estoque da dispensa.
  - Ao desmarcar, o estoque é ajustado automaticamente.

## Estrutura

- `App.tsx`: interface principal otimizada para uso diário.
- `src/context/ShoppingContext.tsx`: regras de negócio e estado global.
- `src/types/index.ts`: tipos de domínio.

## Como executar

```bash
npm install
npm run start
```
