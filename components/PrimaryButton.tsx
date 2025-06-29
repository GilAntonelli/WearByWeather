import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  ViewStyle,
  View,
  Pressable,
  AccessibilityRole,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { theme } from '../styles/theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export function PrimaryButton({
  title,
  onPress,
  style,
  iconLeft,
  accessibilityLabel,
  accessibilityRole = 'button',
}: Props) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [overlayAnim] = useState(new Animated.Value(0));

  async function playClickSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/click.wav')
      );
      await sound.playAsync();
      sound.unloadAsync();
    } catch (error) {
      console.warn('Erro ao tocar som:', error);
    }
  }

  function handlePress() {
    playClickSound();
    onPress();
  }

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.15,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          {iconLeft && (
            <Ionicons
              name={iconLeft}
              size={18}
              color={theme.colors.textDark}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.text}>{title}</Text>
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#fff',
              opacity: overlayAnim,
              borderRadius: 999,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  
});
