import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface BackButtonProps {
  label?: string;
  style?: ViewStyle;
  onPress?: () => void; // ✅ novo prop opcional
}

export function BackButton({ label = 'Voltar', style, onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(); // ✅ usa a função personalizada, se existir
    } else {
      router.back(); // comportamento padrão
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 24,
        },
        style,
      ]}
    >
      <Feather name="chevron-left" size={20} color={theme.colors.primary} />
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 16,
          marginLeft: 8,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
