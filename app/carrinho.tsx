import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { DispensaContext } from '../context/DispensaContext';
import { GreenButton } from '../components/GreenButton';

type ItemCarrinho = { id: string; nome: string; quantidade: number; comprado: boolean };

export const options = {
  title: 'Carrinho',
};

export default function CarrinhoScreen() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([
    { id: '1', nome: 'Arroz', quantidade: 2, comprado: false },
    { id: '2', nome: 'Feijão', quantidade: 1, comprado: false },
  ]);

  const { adicionarNaDispensa } = useContext(DispensaContext);

  const marcarComprado = (id: string) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.map(item =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    );
  };

  const enviarParaDispensa = () => {
    const itensComprados = carrinho.filter(item => item.comprado);

    itensComprados.forEach(item => {
      adicionarNaDispensa({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        loja: 'Dispensa',
      });
    });

    setCarrinho((prevCarrinho) => prevCarrinho.filter(item => !item.comprado));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Carrinho</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={[styles.item, item.comprado && styles.comprado]}>
              {item.nome} - {item.quantidade}
            </Text>
            <GreenButton
              title={item.comprado ? 'Desmarcar' : 'Comprado'}
              onPress={() => marcarComprado(item.id)}
              style={styles.smallButton}
            />
          </View>
        )}
      />
      <GreenButton title="Enviar para Dispensa" onPress={enviarParaDispensa} />
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
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  item: {
    flex: 1,
    fontSize: 18,
    color: '#1f4e2f',
    fontWeight: '600',
  },
  comprado: {
    textDecorationLine: 'line-through',
    color: '#6c7f6c',
  },
  smallButton: {
    minWidth: 120,
  },
});

