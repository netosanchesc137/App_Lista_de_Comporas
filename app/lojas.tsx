/**
 * lojas.tsx
 *
 * Tela de gerenciamento de lojas.
 * Aqui o usuário cadastra novas lojas, edita nomes
 * e exclui lojas existentes. Ao excluir, os itens
 * associados são movidos para 'Sem loja'.
 */
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LojasContext, type Loja } from '../context/LojasContext';
import { ItensContext } from '../context/ItensContext';
import { GreenButton } from '../components/GreenButton';

export const options = {
  title: 'Lojas',
};

export default function LojasScreen() {
  const router = useRouter();
  const { lojas, adicionarLoja, atualizarLoja, excluirLoja } = useContext(LojasContext);
  const { itens, atualizarItem } = useContext(ItensContext);
  const [novaLoja, setNovaLoja] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');

  // Adiciona uma nova loja à lista global de lojas.
  // Não adiciona nomes vazios.
  const handleAdicionarLoja = () => {
    if (novaLoja.trim() !== '') {
      adicionarLoja(novaLoja);
      setNovaLoja('');
    }
  };

  const handleIniciarEdicao = (loja: Loja) => {
    setEditando(loja.id);
    setNovoNome(loja.nome);
  };

  const handleConfirmarEdicao = () => {
    if (editando && novoNome.trim() !== '') {
      atualizarLoja(editando, novoNome);
      setEditando(null);
      setNovoNome('');
    }
  };

  // Exclui uma loja e re-associa todos os itens dessa loja para 'Sem loja'.
  // Isso evita que itens fiquem vinculados a uma loja que não existe mais.
  const handleExcluirLoja = (id: string) => {
    const loja = lojas.find((item) => item.id === id);
    if (!loja || loja.id === 'sem-loja') return;

    itens
      .filter((item) => item.loja === loja.nome)
      .forEach((item) => atualizarItem(item.id, { loja: 'Sem loja' }));

    excluirLoja(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lojas</Text>

      <View style={styles.adicionarContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome da nova loja"
          placeholderTextColor="#7f9d84"
          value={novaLoja}
          onChangeText={setNovaLoja}
        />
        <GreenButton title="Adicionar" onPress={handleAdicionarLoja} />
      </View>

      <FlatList
        data={lojas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {editando === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={novoNome}
                  onChangeText={setNovoNome}
                />
                <GreenButton title="Salvar" onPress={handleConfirmarEdicao} />
                <GreenButton
                  title="Cancelar"
                  onPress={() => setEditando(null)}
                  style={styles.cancelButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.item}>{item.nome}</Text>
                <View style={styles.buttonRow}>
                  <GreenButton
                    title="Entrar"
                    onPress={() =>
                      router.push({ pathname: '/lojaDetalhe', params: { loja: item.nome } })
                    }
                    style={styles.smallButton}
                  />
                  {item.id !== 'sem-loja' ? (
                    <>
                      <GreenButton title="Editar" onPress={() => handleIniciarEdicao(item)} style={styles.smallButton} />
                      <GreenButton title="Excluir" onPress={() => handleExcluirLoja(item.id)} style={styles.cancelButton} />
                    </>
                  ) : null}
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f7ed',
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14582b',
    marginBottom: 18,
    textAlign: 'center',
  },
  adicionarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    backgroundColor: '#f4fbf5',
    borderWidth: 1,
    borderColor: '#b2d8b2',
    padding: 12,
    borderRadius: 16,
    flex: 1,
    color: '#1f4e2f',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  item: {
    fontSize: 18,
    color: '#1f4e2f',
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  smallButton: {
    flexGrow: 1,
    minWidth: 0,
  },
  cancelButton: {
    backgroundColor: '#a5d6a7',
  },
});
