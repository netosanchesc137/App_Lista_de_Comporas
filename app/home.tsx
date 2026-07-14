import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GreenButton } from '../components/GreenButton';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <GreenButton title="Lojas" onPress={() => router.push('/lojas')} />
      <GreenButton title="Itens" onPress={() => router.push('/itens')} />
      <GreenButton title="Dispensa" onPress={() => router.push('/dispensa')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f7ed',
    justifyContent: 'center',
    padding: 24,
    gap: 18,
  },
});
