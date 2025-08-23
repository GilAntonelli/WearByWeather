import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { clearCachedHomeData } from '../services/homePrefetch';
interface Props {
  reloadWeather: () => void;
}

export default function FloatingMenu({ reloadWeather }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();

  // Dark panel palette for better contrast against the app content
  const MENU_BG = '#e2e1e1ff';
  const MENU_TEXT = '#050505ff';
  const MENU_ICON = '#020202ff';
  const DIVIDER = '#3A3A3F';
  const DANGER = '#D32F2F';
  const gearColor = '#111827';

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      contentStyle={{ backgroundColor: MENU_BG, borderRadius: 12, paddingVertical: 4 }}
      anchor={
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="settings-outline" size={22} color={gearColor} />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.replace('/welcome?force=true');
        }}
        title={t('SettingsMenu.begin')}
        titleStyle={{ color: MENU_TEXT }}
        leadingIcon={() => <Ionicons name="home-outline" size={20} color={MENU_ICON} />}
      />

      <Divider style={{ backgroundColor: DIVIDER }} />

      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          reloadWeather();
        }}
        title={t('SettingsMenu.refreshWeather')}
        titleStyle={{ color: MENU_TEXT }}
        leadingIcon={() => <Ionicons name="refresh" size={20} color={MENU_ICON} />}
      />

      <Divider style={{ backgroundColor: DIVIDER }} />

      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.push('/preferences');
        }}
        title={t('SettingsMenu.preferences')}
        titleStyle={{ color: MENU_TEXT }}
        leadingIcon={() => <Ionicons name="settings-sharp" size={20} color={MENU_ICON} />}
      />

      <Divider style={{ backgroundColor: DIVIDER }} />

      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.push('/language-selector');
        }}
        title={t('SettingsMenu.language')}
        titleStyle={{ color: MENU_TEXT }}
        leadingIcon={() => <Ionicons name="language-outline" size={20} color={MENU_ICON} />}
      />

      <Divider style={{ backgroundColor: DIVIDER }} />

      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          Alert.alert(
            t('SettingsMenu.reset'),
            t('alerts.resetAlert'),
            [
              { text: t('alerts.cancelbutton'), style: 'cancel' },
              {
                text: t('alerts.resetbutton'),
                style: 'destructive',
                onPress: async () => {
                  clearCachedHomeData();
                  await AsyncStorage.clear();
                  router.replace('/');
                },
              },
            ],
          );
        }}
        title={t('SettingsMenu.reset')}
        titleStyle={{ color: DANGER, fontWeight: '600' }}
        leadingIcon={() => <Ionicons name="warning-outline" size={20} color={DANGER} />}
      />
    </Menu>
  );
}
