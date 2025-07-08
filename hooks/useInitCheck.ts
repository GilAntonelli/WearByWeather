// hooks/useInitCheck.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export function useInitCheck() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const isInitialized = await AsyncStorage.getItem('isAppInitialized');
        if (isInitialized) {
          router.replace('/home');
        } else {
          setChecking(false);
        }
      } catch (error) {
        console.error('Error checking initialization:', error);
        setChecking(false);
      }
    };

    checkInitialization();
  }, [router]);

  return { checking };
}
