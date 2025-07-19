import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/global';

interface Props {
  reloadWeather: () => void;
}

export default function FloatingMenu({ reloadWeather }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="settings-outline" style={globalStyles.gearIcon} />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.push('/');
        }}
        title={t('SettingsMenu.begin')}
        leadingIcon={() => <Ionicons name="home-outline" size={20} color="#333" />}
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          reloadWeather();
        }}
        title={t('SettingsMenu.refreshWeather')}
        leadingIcon={() => <Ionicons name="refresh" size={20} color="#333" />}
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.push('/preferences');
        }}
        title={t('SettingsMenu.preferences')}
        leadingIcon={() => <Ionicons name="settings-sharp" size={20} color="#333" />}
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          router.push('/language-selector');
        }}
        title={t('SettingsMenu.language')}
        leadingIcon={() => <Ionicons name="language-outline" size={20} color="#333" />}
      />
      <Divider />
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
                  await AsyncStorage.clear();
                  router.replace('/');
                },
              },
            ]
          );
        }}
        title={t('SettingsMenu.reset')}
        leadingIcon={() => <Ionicons name="warning-outline" size={20} color="#D32F2F" />}
      />
    </Menu>
  );
}