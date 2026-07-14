/**
 * dispensa.tsx
 *
 * Tela que mostra o estoque da dispensa.
 * Permite editar quantidades diretamente e excluir items.
 */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DispensaContext } from '../context/DispensaContext';

export const options = {
  title: 'Dispensa',
};

export default function DispensaScreen() {
  const { dispensa, atualizarQuantidade, excluirItem } = useContext(DispensaContext);
  const [quantidades, setQuantidades] = useState<Record<string, string>>(
    Object.fromEntries(dispensa.map((item) => [item.id, String(item.quantidade)]))
  );

  // Sincroniza o estado local de quantidades com o estado global da dispensa.
  // Isso garante que o TextInput mostre o valor atual mesmo após mudanças externas.
  useEffect(() => {
    setQuantidades(Object.fromEntries(dispensa.map((item) => [item.id, String(item.quantidade)])));
  }, [dispensa]);

  // Atualiza a quantidade exibida no campo e salva a alteração no contexto.
  const handleQuantidadeChange = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setQuantidades((prev) => ({ ...prev, [id]: numericValue }));

    if (numericValue !== '') {
      atualizarQuantidade(id, Number(numericValue));
    }
  };

  // Quando o usuário sai do campo sem valor, restaura a quantidade anterior.
  const handleQuantidadeSubmit = (id: string) => {
    if (!quantidades[id]) {
      const item = dispensa.find((item) => item.id === id);
      if (item) {
        setQuantidades((prev) => ({ ...prev, [id]: String(item.quantidade) }));
      }
    }
  };

  // Remove o item da dispensa.
  const handleExcluir = (id: string) => {
    excluirItem(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Dispensa</Text>

      <Text style={styles.subtitulo}>Minha dispensa</Text>
      {dispensa.length === 0 ? (
        <Text style={styles.vazio}>Nenhum item na dispensa.</Text>
      ) : (
        <FlatList
          data={dispensa}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.item}>{item.nome}</Text>
                  <Text style={styles.meta}>{`Qtd: ${item.quantidade}`}</Text>
                </View>
                <TextInput
                  style={styles.quantidadeInput}
                  keyboardType="numeric"
                  value={quantidades[item.id] ?? String(item.quantidade)}
                  onChangeText={(value) => handleQuantidadeChange(item.id, value)}
                  onEndEditing={() => handleQuantidadeSubmit(item.id)}
                />
                <TouchableOpacity onPress={() => handleExcluir(item.id)} style={styles.iconButton}>
                  <MaterialIcons name="delete" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f6f3f',
    marginTop: 10,
    marginBottom: 18,
  },
  vazio: {
    fontSize: 18,
    color: '#6c7f6c',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f8fbf8',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
  item: {
    fontSize: 16,
    color: '#1f4e2f',
    fontWeight: '700',
  },
  meta: {
    color: '#527354',
    fontSize: 13,
    marginTop: 2,
  },
  quantidadeInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#b2d8b2',
    backgroundColor: '#f4fbf5',
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: 'center',
    borderRadius: 12,
    color: '#1f4e2f',
    fontSize: 14,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    marginTop: 12,
  },
});

