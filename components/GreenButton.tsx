/**
 * GreenButton.tsx
 *
 * Botão reutilizável usado em todo o app.
 * Encapsula um TouchableOpacity verde com texto branco.
 * Recebe estilos adicionais para customização local.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';

type GreenButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function GreenButton({ title, onPress, style, textStyle }: GreenButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    minWidth: 0,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
