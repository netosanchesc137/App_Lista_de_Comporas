import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ShoppingProvider, useShoppingContext } from './src/context/ShoppingContext';

function ShoppingScreen() {
  const { stores, items, pantry, addItem, toggleItemPurchased } = useShoppingContext();
  const [selectedStore, setSelectedStore] = useState<string | 'all'>('all');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [storeId, setStoreId] = useState(stores[0]?.id ?? '');

  const visibleItems = useMemo(
    () => items.filter((item) => selectedStore === 'all' || item.storeId === selectedStore),
    [items, selectedStore],
  );

  const pendingItems = visibleItems.filter((item) => !item.purchased);
  const purchasedItems = visibleItems.filter((item) => item.purchased);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Lista de Compras</Text>
        <Text style={styles.subtitle}>Controle por loja e sincronização automática com a dispensa.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Adicionar item</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do item"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <Text style={styles.label}>Loja de compra</Text>
          <View style={styles.storeFilter}>
            {stores.map((store) => (
              <Pressable
                key={store.id}
                onPress={() => setStoreId(store.id)}
                style={[styles.chip, store.id === storeId && styles.chipActive]}
              >
                <Text style={[styles.chipLabel, store.id === storeId && styles.chipLabelActive]}>
                  {store.name}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.button}
            onPress={() => {
              addItem({
                name: itemName,
                quantity: Number.parseInt(quantity, 10) || 1,
                storeId,
              });
              setItemName('');
              setQuantity('1');
            }}
          >
            <Text style={styles.buttonLabel}>Adicionar</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Filtrar por loja</Text>
          <View style={styles.storeFilter}>
            <Pressable
              onPress={() => setSelectedStore('all')}
              style={[styles.chip, selectedStore === 'all' && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, selectedStore === 'all' && styles.chipLabelActive]}>
                Todas
              </Text>
            </Pressable>
            {stores.map((store) => (
              <Pressable
                key={store.id}
                onPress={() => setSelectedStore(store.id)}
                style={[styles.chip, selectedStore === store.id && styles.chipActive]}
              >
                <Text
                  style={[styles.chipLabel, selectedStore === store.id && styles.chipLabelActive]}
                >
                  {store.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pendentes</Text>
          {pendingItems.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum item pendente nesta seleção.</Text>
          ) : (
            pendingItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleItemPurchased(item.id)}
                style={styles.listItem}
              >
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemMeta}>Qtd: {item.quantity}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Comprados</Text>
          {purchasedItems.length === 0 ? (
            <Text style={styles.emptyText}>Marque itens como comprados para sincronizar a dispensa.</Text>
          ) : (
            purchasedItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleItemPurchased(item.id)}
                style={[styles.listItem, styles.listItemPurchased]}
              >
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemMeta}>Qtd: {item.quantity}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estoque da dispensa</Text>
          {pantry.length === 0 ? (
            <Text style={styles.emptyText}>Sem itens em estoque.</Text>
          ) : (
            pantry.map((item) => (
              <View key={item.name} style={styles.stockRow}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.stockQty}>{item.quantity}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ShoppingProvider>
      <ShoppingScreen />
    </ShoppingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  label: {
    color: '#4b5563',
    fontSize: 14,
  },
  storeFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  chipLabel: {
    color: '#374151',
    fontSize: 12,
  },
  chipLabelActive: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listItem: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemPurchased: {
    backgroundColor: '#dcfce7',
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  listItemMeta: {
    fontSize: 14,
    color: '#4b5563',
  },
  emptyText: {
    color: '#6b7280',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  stockName: {
    color: '#1f2937',
    fontSize: 16,
  },
  stockQty: {
    color: '#0f766e',
    fontSize: 16,
    fontWeight: '700',
  },
});
