/**
 * _layout.tsx
 *
 * Define a hierarquia de provedores de contexto do app.
 * O arquivo também aplica a aparência padrão do cabeçalho
 * e do conteúdo para todas as telas do Expo Router.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DispensaProvider } from '../context/DispensaContext';
import { ItensProvider } from '../context/ItensContext';
import { LojasProvider } from '../context/LojasContext';

export default function Layout() {
  return (
    <LojasProvider>
      <ItensProvider>
        <DispensaProvider>
          <StatusBar style="dark" backgroundColor="#d7f2dd" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#d7f2dd' },
              headerShadowVisible: false,
              headerTintColor: '#1f4d2f',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
                color: '#1f4d2f',
              },
              contentStyle: { backgroundColor: '#e8f7ed' },
            }}
          />
        </DispensaProvider>
      </ItensProvider>
    </LojasProvider>
  );
}
