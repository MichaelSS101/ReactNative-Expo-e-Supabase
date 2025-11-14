import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContexts';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { session, setAuth, loading } = useAuth();

  const [fontsLoaded] = useFonts({
    CreamCake: require('../assets/fonts/CreamCakeBold.otf'),
  });

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        setAuth(session);

        if (!session) {
          router.replace('/(auth)/signin/page');
          return;
        }

        try {
          const expireAtStr = await AsyncStorage.getItem('suppress_auto_redirect');

          if (expireAtStr) {
            const expireAt = Number(expireAtStr);

            if (!isNaN(expireAt) && Date.now() < expireAt) {
              await AsyncStorage.removeItem('suppress_auto_redirect');
              return;
            }
            await AsyncStorage.removeItem('suppress_auto_redirect');
          }
        } catch (err) {
          console.warn("Erro ao checar suppress_auto_redirect:", err);
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('permissao')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar permissão:", error.message);
          router.replace('/(panel)/paciente/page');
          return;
        }

        const permissao = userData?.permissao?.toLowerCase();

        if (permissao === 'dentista') {
          router.replace('/(panel)/dentista/page');
        } else {
          router.replace('/(panel)/paciente/page');
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(panel)" options={{ headerShown: false }} />
    </Stack>
  );
}
