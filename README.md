# App Lista de Compras

![Ícone do app](assets/images/icon.png)

Aplicativo mobile desenvolvido com React Native, Expo e TypeScript para organizar itens de compra, lojas e estoque da dispensa.

## Visão geral

O projeto foi criado para facilitar o controle de compras do dia a dia. Com ele, é possível:

- cadastrar itens com nome, quantidade e loja associada
- organizar itens por loja
- mover itens sem loja para uma loja cadastrada
- adicionar compras à dispensa
- controlar o estoque da dispensa separadamente da lista de compras
- editar quantidades diretamente nas telas principais

## Funcionalidades

- Cadastro e edição de itens
- Cadastro, edição e exclusão de lojas
- Tela de detalhes por loja
- Controle de itens sem loja
- Fluxo de compra com envio para a dispensa
- Atualização manual das quantidades na dispensa
- Documentação interna para manutenção futura

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Context API

## Estrutura principal

- `app/`: telas e navegação do aplicativo
- `context/`: gerenciamento de estado global
- `components/`: componentes reutilizáveis
- `assets/`: imagens e arquivos estáticos

## Como executar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npx expo start
```

3. Abra no dispositivo desejado:

- Expo Go no celular
- navegador web
- emulador Android

## Observações

- O app utiliza Context API para separar a lógica de itens, lojas e dispensa.
- A dispensa mantém seu próprio estoque e não depende diretamente da quantidade planejada para compra.
- Existe um guia técnico complementar em `README-DEV.md` para manutenção do código.

## Build e publicação

O projeto já possui arquivo `eas.json`, permitindo evolução futura para builds com Expo Application Services (EAS).

## Autor

Desenvolvido por Neto Uchoa.
