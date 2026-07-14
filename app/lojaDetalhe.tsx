/**
 * lojaDetalhe.tsx
 *
 * Tela de detalhes de uma loja ou do item 'Sem loja'.
 * Exibe os itens vinculados à loja selecionada e permite:
 * - editar quantidade de compra direto no campo
 * - enviar itens para a dispensa
 * - mover itens para outra loja quando estiverem em 'Sem loja'
 */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { DispensaContext } from '../context/DispensaContext';
import { ItensContext } from '../context/ItensContext';
import { LojasContext } from '../context/LojasContext';
import type { Item } from '../context/ItensContext';
import { GreenButton } from '../components/GreenButton';

export const options = ({ params }: { params: { loja?: string | string[] } }) => {
  const loja = Array.isArray(params.loja) ? params.loja[0] : params.loja ?? 'Detalhes da Loja';
  return {
    title: loja,
  };
};

export default function LojaDetalheScreen() {
  const params = useLocalSearchParams() as { loja?: string | string[] };
  const loja = Array.isArray(params.loja) ? params.loja[0] : params.loja ?? '';
  const { dispensa, adicionarNaDispensa } = useContext(DispensaContext);
  const { itens, atualizarItem } = useContext(ItensContext);
  const { lojas } = useContext(LojasContext);
  const [selectedLoja, setSelectedLoja] = useState<Record<string, string>>({});

  const lojasDisponiveis = lojas.filter((item) => item.nome !== 'Sem loja');

  const itensDaLoja = itens.filter((item) =>
    loja === 'Sem loja' ? item.loja === 'Sem loja' || item.loja === '' : item.loja === loja
  );

  const [quantidadesCompra, setQuantidadesCompra] = useState<Record<string, string>>({});

  useEffect(() => {
    setQuantidadesCompra(
      Object.fromEntries(itensDaLoja.map((item) => [item.id, String(item.quantidade)]))
    );
  }, [itensDaLoja]);

  // Mantém o estado local do valor de compra digitado para cada item.
  const handleQuantidadeCompraChange = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setQuantidadesCompra((prev) => ({ ...prev, [id]: numericValue }));
  };

  // Valida e persiste a quantidade editada ao sair do campo.
  // Se o valor for inválido, volta a quantidade original do item.
  const handleQuantidadeCompraEndEditing = (item: Item) => {
    const quantityString = quantidadesCompra[item.id] ?? String(item.quantidade);
    const quantidade = Number(quantityString) || 0;

    if (quantidade > 0) {
      atualizarItem(item.id, { quantidade });
      setQuantidadesCompra((prev) => ({ ...prev, [item.id]: String(quantidade) }));
    } else {
      setQuantidadesCompra((prev) => ({ ...prev, [item.id]: String(item.quantidade) }));
    }
  };

  // Envia o item para a dispensa com a quantidade atual de compra.
  // Se já existir o mesmo nome na dispensa, o contexto soma a quantidade.
  // Transfere o item da loja para a dispensa usando a quantidade
  // informada no campo de compra.
  //
  // Se o item já existir na dispensa pelo nome, usamos o mesmo id para
  // garantir que as quantidades se acumulem no mesmo registro.
  const comprarItem = (item: Item) => {
    const quantidadeCompra = Number(quantidadesCompra[item.id] ?? String(item.quantidade));
    if (quantidadeCompra <= 0) {
      return;
    }

    // Mantém a quantidade do item na lista da loja atualizada
    // caso o usuário tenha alterado o valor antes de comprar.
    if (quantidadeCompra !== item.quantidade) {
      atualizarItem(item.id, { quantidade: quantidadeCompra });
    }

    const existente = dispensa.find((d) => d.nome === item.nome);
    const itemParaDispensa = {
      ...item,
      id: existente ? existente.id : String(Date.now()),
      quantidade: quantidadeCompra,
      loja: 'Dispensa',
    };

    adicionarNaDispensa(itemParaDispensa);
  };

  // Remove a associação do item com a loja atual,
  // deixando-o em 'Sem loja'.
  const desassociarItemDaLoja = (id: string) => {
    atualizarItem(id, { loja: 'Sem loja' });
  };

  // Move item que está em 'Sem loja' para a loja escolhida.
  const moverParaLoja = (item: Item) => {
    const target = selectedLoja[item.id] || lojasDisponiveis[0]?.nome;
    if (target) {
      atualizarItem(item.id, { loja: target });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Itens da {loja}</Text>
      <Text style={styles.subtitulo}>Itens vinculados</Text>

      {itensDaLoja.length === 0 ? (
        <Text style={styles.vazio}>Nenhum item associado a esta loja.</Text>
      ) : (
        <FlatList
          data={itensDaLoja}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const existente = dispensa.find((d) => d.nome === item.nome);
            return (
              <View style={styles.itemContainer}>
              <Text style={[styles.item, existente && styles.emEstoque]}>{item.nome}</Text>
              <View style={styles.rowInfo}>
                <View style={styles.compraInfo}>
                  <Text style={styles.compraLabel}>Compra</Text>
                  <TextInput
                    style={styles.compraInput}
                    keyboardType="numeric"
                    value={quantidadesCompra[item.id] ?? String(item.quantidade)}
                    onChangeText={(value) => handleQuantidadeCompraChange(item.id, value)}
                    onEndEditing={() => handleQuantidadeCompraEndEditing(item)}
                  />
                </View>
                {existente ? (
                  <Text style={styles.meta}>Dispensa: {existente.quantidade}</Text>
                ) : null}
              </View>
                {loja === 'Sem loja' ? (
                  <View style={styles.semLojaRow}>
                    {lojasDisponiveis.length > 0 ? (
                      <>
                        <View style={styles.pickerContainerItem}>
                          <Text style={styles.pickerLabel}>Mover para</Text>
                          <Picker
                            selectedValue={selectedLoja[item.id] ?? lojasDisponiveis[0]?.nome ?? ''}
                            onValueChange={(value) => setSelectedLoja((prev) => ({ ...prev, [item.id]: value }))}
                            style={styles.pickerItemSmall}
                            itemStyle={styles.pickerItemStyle}
                          >
                            {lojasDisponiveis.map((lojaItem) => (
                              <Picker.Item key={lojaItem.id} label={lojaItem.nome} value={lojaItem.nome} />
                            ))}
                          </Picker>
                        </View>
                        <GreenButton
                          title="Mover"
                          onPress={() => moverParaLoja(item)}
                          style={[styles.iconButton, styles.editButton]}
                          textStyle={styles.iconButtonText}
                        />
                      </>
                    ) : (
                      <Text style={styles.vazio}>Cadastre uma loja para mover este item.</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.buttonRow}>
                    <GreenButton title="Comprar" onPress={() => comprarItem(item)} style={styles.smallButton} />
                    <GreenButton title="Remover da loja" onPress={() => desassociarItemDaLoja(item.id)} style={styles.cancelButton} />
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#2f6f3f',
    textAlign: 'center',
    marginBottom: 18,
  },
  vazio: {
    fontSize: 18,
    color: '#6c7f6c',
    textAlign: 'center',
    marginTop: 40,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  item: {
    fontSize: 18,
    color: '#1f4e2f',
    fontWeight: '600',
    marginBottom: 12,
  },
  emEstoque: {
    color: '#2f7d3d',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  compraInfo: {
    flex: 1,
  },
  compraLabel: {
    fontSize: 13,
    color: '#2f6f3f',
    marginBottom: 4,
  },
  compraInput: {
    width: 72,
    borderWidth: 1,
    borderColor: '#b2d8b2',
    backgroundColor: '#f4fbf5',
    borderRadius: 12,
    padding: 10,
    color: '#1f4e2f',
    fontSize: 15,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  cancelButton: {
    backgroundColor: '#a5d6a7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  semLojaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerContainerItem: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#2f6f3f',
    marginBottom: 4,
  },
  pickerItemSmall: {
    backgroundColor: '#f4fbf5',
    borderWidth: 1,
    borderColor: '#b2d8b2',
    borderRadius: 12,
    height: 42,
  },
  pickerItemStyle: {
    fontSize: 13,
    height: 42,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  editButton: {
    backgroundColor: '#2e7d32',
  },
  iconButtonText: {
    fontSize: 13,
  },
  meta: {
    color: '#527354',
    fontSize: 14,
    marginTop: 4,
  },
});
