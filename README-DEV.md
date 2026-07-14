# Guia de Desenvolvimento - lista-de-compras

Este arquivo descreve a arquitetura do app, os principais contextos e as telas, para facilitar a manutenção futura.

## Visão geral do projeto

Este é um app Expo com `expo-router`, escrito em React Native + TypeScript.
O app usa Context API para manter o estado global de itens, dispensa e lojas.

### Estrutura principal

- `app/` - telas e navegação do aplicativo
- `context/` - provedores de estado global
- `components/` - componentes reutilizáveis
- `assets/` - imagens e recursos estáticos

## Contextos

### `context/ItensContext.tsx`
Responsabilidade:
- Guarda a lista global de itens
- Cada item tem: `id`, `nome`, `quantidade`, `loja`
- Fornece funções para:
  - `adicionarItem` - cria novo item
  - `atualizarItem` - atualiza campos parciais de um item
  - `excluirItem` - remove item permanentemente
  - `obterItemPorId` - recupera item pelo `id`

Como usar:
- É o estado base que todas as telas consultam para saber quais itens existem.
- A tela `Itens` adiciona itens aqui.

### `context/DispensaContext.tsx`
Responsabilidade:
- Guarda o estoque da dispensa separadamente da lista principal de itens
- Permite adicionar itens à dispensa, atualizar quantidades, remover e excluir
- Sincroniza com `ItensContext` quando o mesmo item também existe com `loja: 'Dispensa'`

Principais funções:
- `adicionarNaDispensa(item)`
  - Se existir item com mesmo `id`, soma as quantidades
  - Se não, procura por nome para evitar duplicações
  - Caso novo, adiciona item com `loja: 'Dispensa'`
- `definirQuantidadeNaDispensa(item)`
  - Ajusta a quantidade para um valor exato
  - Usa lógica por `id` ou `nome`
  - Se o item estiver na lista principal como `Dispensa`, atualiza lá também
- `atualizarQuantidade(id, quantidade)`
  - Atualiza a quantidade na dispensa e, quando necessário, na lista principal
- `baixarQuantidade(id)`
  - Subtrai 1 unidade e remove item quando chegar a zero
- `removerDaDispensa(id)` / `excluirItem(id)`
  - Removem o item da dispensa
  - Se o item também existir como `Dispensa` em `ItensContext`, atualizam a loja para `Sem loja`

### `context/LojasContext.tsx`
Responsabilidade:
- Controla as lojas cadastradas
- Cria automaticamente uma loja base `Sem loja`
- Fornece funções para adicionar, editar e excluir lojas

Principais funções:
- `adicionarLoja(nome)` - adiciona nova loja
- `atualizarLoja(id, novoNome)` - altera nome da loja
- `excluirLoja(id)` - remove a loja

Notas de manutenção:
- Ao excluir loja, a tela `Lojas` também atualiza itens associados para `Sem loja`.

## Layout e navegação

### `app/_layout.tsx`
Responsabilidade:
- Define a hierarquia de provedores de contexto: `LojasProvider` > `ItensProvider` > `DispensaProvider`
- Aplica estilo padrão ao cabeçalho e ao conteúdo do `Stack` do Expo Router
- Define a `StatusBar` do app

## Telas principais

### `app/itens.tsx`
Responsabilidade:
- Cadastro de novos itens
- Lista todos os itens cadastrados
- Permite editar ou excluir itens

Fluxos importantes:
- `adicionarNovoItem()`
  - Cria item com `nome`, `quantidade` e `loja`
  - Se objetivo for `Dispensa`, também chama `adicionarNaDispensa` para atualizar a dispensa
  - Se o item já existir na dispensa, soma quantidades
- `openEditItem(id)`
  - Navega para a tela de edição usando `router.push` para `/editarItem`

Comportamento UX:
- Há um modal para escolher a loja de destino
- O botão verde `GreenButton` é usado para ações principais

### `app/lojaDetalhe.tsx`
Responsabilidade:
- Exibir itens vinculados a uma loja específica
- Permitir editar quantidade de compra diretamente
- Enviar item para a dispensa
- Mover itens de `Sem loja` para outra loja

Fluxos importantes:
- `quantidadesCompra` mantém valores conforme o usuário digita
- `handleQuantidadeCompraEndEditing` valida e persiste a quantidade final
- `comprarItem(item)` transfere o item para a dispensa
  - Usa `dispença.find(d => d.nome === item.nome)` para reusar o mesmo registro
  - Chama `adicionarNaDispensa` para somar ou criar o item na dispensa
- `desassociarItemDaLoja(id)` remove o item da loja atual
- `moverParaLoja(item)` altera a loja do item em `ItensContext`

### `app/dispensa.tsx`
Responsabilidade:
- Mostrar o estoque atual da dispensa
- Permitir editar quantidades diretamente
- Excluir itens da dispensa

Fluxos importantes:
- `handleQuantidadeChange(id, value)` formata e atualiza o valor digitado
- `handleQuantidadeSubmit(id)` restaura a quantidade caso o campo fique vazio
- `handleExcluir(id)` remove o item via `DispensaContext`

### `app/lojas.tsx`
Responsabilidade:
- Gerenciar cadastro de lojas
- Navegar para a tela de detalhes da loja
- Permitir editar e excluir lojas

Fluxos importantes:
- `handleAdicionarLoja()` adiciona nova loja
- `handleIniciarEdicao(loja)` inicia edição inline
- `handleConfirmarEdicao()` salva o novo nome
- `handleExcluirLoja(id)` move itens daquela loja para `Sem loja` antes de excluir

### `app/editarItem.tsx`
Responsabilidade:
- Editar um item existente
- Alterar nome, quantidade e loja associada
- Sincronizar com a dispensa quando o item estiver em `Dispensa`

Fluxos importantes:
- `useEffect` inicializa o formulário com os dados do item selecionado
- `salvarEdicao()` valida e aplica mudanças
  - Se o item for `Dispensa`, chama `definirQuantidadeNaDispensa`
  - Se o item sair de `Dispensa`, chama `removerDaDispensa`
- `confirmarExclusao()` exibe alerta de confirmação antes de excluir

## Boas práticas de manutenção

- Quando alterar dados de item/dispenser/loja, prefira atualizar o contexto central em vez de manipular diretamente o estado local.
- Use `obterItemPorId(id)` antes de operar em um item que vem da rota.
- Respeite as verificações de quantidade maior que zero.
- Evite duplicar lógica de negócios: mantenha a soma de quantidade em `DispensaContext`.

## Como rodar

```bash
npm install
npx expo start
```

Se quiser resetar o projeto ao estado inicial com o script atual:

```bash
npm run reset-project
```
