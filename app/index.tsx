import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GreenButton } from '../components/GreenButton';

export const options = {
  title: 'Home',
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Compras</Text>
      <Text style={styles.subtitulo}>Bem-vinda</Text>

      <View style={styles.actions}>
        <GreenButton title="Lojas" onPress={() => router.push('/lojas')} />
        <GreenButton title="Itens" onPress={() => router.push('/itens')} />
        <GreenButton title="Dispensa" onPress={() => router.push('/dispensa')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f7ed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a4d2b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    color: '#2f6f3f',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
});
