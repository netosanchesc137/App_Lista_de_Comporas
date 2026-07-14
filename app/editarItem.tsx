/**
 * editarItem.tsx
 *
 * Tela de edição de um item existente.
 * Permite alterar nome, quantidade e loja.
 * Sincroniza alterações com a dispensa quando apropriado.
 */
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { ItensContext, type Item } from '../context/ItensContext';
import { LojasContext, type Loja } from '../context/LojasContext';
import { DispensaContext } from '../context/DispensaContext';
import { GreenButton } from '../components/GreenButton';

export const options = {
  title: 'Editar item',
};

export default function EditarItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('editarItem params:', params);
  const { id } = params as { id?: string };
  const { obterItemPorId, atualizarItem, excluirItem } = useContext(ItensContext);
  const { lojas } = useContext(LojasContext);
  const { adicionarNaDispensa, definirQuantidadeNaDispensa, removerDaDispensa } = useContext(DispensaContext);

  const [itemAtual, setItemAtual] = useState<Item | undefined>();
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loja, setLoja] = useState('');

  useEffect(() => {
    if (id) {
      const item = obterItemPorId(id);
      setItemAtual(item);
      setNome(item?.nome ?? '');
      setQuantidade(item ? String(item.quantidade) : '');
      setLoja(item?.loja ?? '');
    }
  }, [id, obterItemPorId]);

  // Valida o formulário de edição e atualiza o item.
  // Faz a sincronização de estado com a dispensa se o item estiver nela.
  const salvarEdicao = () => {
    if (!itemAtual) return;
    if (!nome.trim() || Number(quantidade) <= 0 || !loja) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, quantidade e loja.');
      return;
    }

    const atualizacao: Partial<Item> = {
      nome: nome.trim(),
      quantidade: Number(quantidade),
      loja,
    };

    atualizarItem(itemAtual.id, atualizacao);

    if (loja === 'Dispensa') {
      definirQuantidadeNaDispensa({ ...itemAtual, ...atualizacao });
    } else if (itemAtual.loja === 'Dispensa' && loja !== 'Dispensa') {
      removerDaDispensa(itemAtual.id);
    }

    router.back();
  };

  // Mostra um alerta de confirmação antes de apagar o item.
  // Se confirmado, exclui o item da lista global e volta para a tela anterior.
  const confirmarExclusao = () => {
    if (!itemAtual) return;
    Alert.alert('Excluir item', 'Tem certeza que deseja excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          excluirItem(itemAtual.id);
          router.back();
        },
      },
    ]);
  };

  if (!itemAtual) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Item não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar item</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Loja</Text>
        <Picker
          selectedValue={loja}
          onValueChange={(value) => setLoja(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Dispensa" value="Dispensa" />
          {lojas.map((lojaItem: Loja) => (
            <Picker.Item key={lojaItem.id} label={lojaItem.nome} value={lojaItem.nome} />
          ))}
        </Picker>
      </View>
      <GreenButton title="Salvar" onPress={salvarEdicao} />
      <GreenButton title="Excluir item" onPress={confirmarExclusao} style={styles.deleteButton} textStyle={styles.deleteText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8f7ed',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#14582b',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f4fbf5',
    borderWidth: 1,
    borderColor: '#b2d8b2',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    color: '#1f4e2f',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2f6f3f',
  },
  picker: {
    backgroundColor: '#f4fbf5',
    borderRadius: 16,
    height: 54,
  },
  pickerItem: {
    fontSize: 12,
  },
  deleteButton: {
    marginTop: 14,
    backgroundColor: '#d32f2f',
  },
  deleteText: {
    color: '#ffffff',
  },
});
