/**
 * itens.tsx
 *
 * Tela de cadastro e listagem de itens.
 * Permite criar itens com nome, quantidade e loja associada.
 * Quando o destino é 'Dispensa', o item também é adicionado
 * ao contexto da dispensa com o comportamento de soma correto.
 */
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ItensContext, type Item } from '../context/ItensContext';
import { LojasContext, type Loja } from '../context/LojasContext';
import { DispensaContext } from '../context/DispensaContext';
import { GreenButton } from '../components/GreenButton';

export const options = {
  title: 'Itens',
};

export default function ItensScreen() {
  const router = useRouter();
  const { itens, adicionarItem, atualizarItem, excluirItem } = useContext(ItensContext);
  const { lojas } = useContext(LojasContext);
  const { adicionarNaDispensa } = useContext(DispensaContext);

  const placeholderLoja = 'placeholder';
  const [novoNome, setNovoNome] = useState('');
  const [novaQtd, setNovaQtd] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState(placeholderLoja);
  const [modalVisible, setModalVisible] = useState(false);

  // Atualiza a loja selecionada no formulário e fecha o modal.
  const handleSelecionarLoja = (value: string) => {
    setLojaSelecionada(value);
    setModalVisible(false);
  };

  // Cria um novo item a partir dos campos do formulário.
  // Se a loja selecionada for 'Dispensa', o item também é adicionado
  // ao contexto da dispensa com a lógica de soma de quantidade.
  const adicionarNovoItem = () => {
    if (novoNome.trim() && Number(novaQtd) > 0) {
      const destino = lojaSelecionada !== placeholderLoja ? lojaSelecionada : 'Sem loja';
      const novoItem: Item = {
        id: String(Date.now()),
        nome: novoNome.trim(),
        quantidade: Number(novaQtd),
        loja: destino,
      };

      if (destino === 'Dispensa') {
        // Se o item já existir na dispensa, soma as quantidades.
        const existenteDispensa = itens.find(
          (item) => item.nome === novoNome.trim() && item.loja === 'Dispensa'
        );

        if (existenteDispensa) {
          const quantidadeAtualizada = existenteDispensa.quantidade + Number(novaQtd);
          atualizarItem(existenteDispensa.id, { quantidade: quantidadeAtualizada });
          adicionarNaDispensa({
            ...novoItem,
            id: existenteDispensa.id,
            quantidade: Number(novaQtd),
          });
        } else {
          adicionarItem(novoItem);
          adicionarNaDispensa(novoItem);
        }
      } else {
        adicionarItem(novoItem);
      }
      setNovoNome('');
      setNovaQtd('');
      setLojaSelecionada(placeholderLoja);
    }
  };

  // Navega para a tela de edição do item selecionado.
  const openEditItem = (id: string) => {
    console.log('openEditItem id:', id);
    router.push({ pathname: '/editarItem', params: { id } });
  };

  // O FlatList mostra todos os itens em ordem de cadastro.
  // Cada item exibe nome, quantidade e loja, e permite edição/exclusão.
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Itens cadastrados</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={novoNome}
        onChangeText={setNovoNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={novaQtd}
        onChangeText={setNovaQtd}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Loja associada</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
          <Text style={[styles.pickerButtonText, lojaSelecionada === placeholderLoja && styles.placeholderText]}>
            {lojaSelecionada === placeholderLoja ? 'Selecione uma loja' : lojaSelecionada}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#1f4e2f" />
        </TouchableOpacity>
      </View>
      <GreenButton title="Adicionar item" onPress={adicionarNovoItem} />
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione uma loja</Text>
          <TouchableOpacity style={styles.modalItem} onPress={() => handleSelecionarLoja('Dispensa')}>
            <Text style={styles.modalItemText}>Dispensa</Text>
          </TouchableOpacity>
          {lojas.map((loja: Loja) => (
            <TouchableOpacity key={loja.id} style={styles.modalItem} onPress={() => handleSelecionarLoja(loja.nome)}>
              <Text style={styles.modalItemText}>{loja.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.item}>{item.nome}</Text>
                <Text style={styles.meta}>{`Qtd: ${item.quantidade} · Loja: ${item.loja}`}</Text>
              </View>
              <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => openEditItem(item.id)} style={[styles.iconButton, styles.editButton]}>
                <MaterialIcons name="edit" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirItem(item.id)} style={[styles.iconButton, styles.cancelButton]}>
                <MaterialIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            </View>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#14582b',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4fbf5',
    borderWidth: 1,
    borderColor: '#b2d8b2',
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    color: '#1f4e2f',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#2f6f3f',
  },
  pickerButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4fbf5',
    borderWidth: 1,
    borderColor: '#b2d8b2',
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 14,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#1f4e2f',
  },
  placeholderText: {
    color: '#6c7f6c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f4e2f',
    marginBottom: 14,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#f4fbf5',
    marginBottom: 8,
  },
  modalItemText: {
    color: '#1f4e2f',
    fontSize: 15,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  item: {
    fontSize: 15,
    color: '#1f4e2f',
    fontWeight: '700',
    marginBottom: 1,
  },
  meta: {
    color: '#527354',
    marginBottom: 0,
    fontSize: 13,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: '#2e7d32',
  },
  cancelButton: {
    backgroundColor: '#2e7d32',
  },
});
