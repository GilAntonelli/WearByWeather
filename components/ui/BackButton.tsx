import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';
import { useTranslation } from 'react-i18next';

export function BackButton() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      accessibilityLabel="BackButton.label"
      accessibilityRole="button"
      style={styles.container}
    >
      <View style={styles.inner}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.textDark} />
        <Text style={styles.text}>{t('BackButton.label')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textDark,
    fontWeight: '500',
  },
});
