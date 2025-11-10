import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';


const App = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setAvatarUrl(data?.avatar_url ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 👉 Função para navegar até a página de perfil
  const handleOpenProfile = () => {
    router.push('../profile/page');
  };

  return (
    <LinearGradient
      colors={[
        'rgba(0, 0, 255, 0.8)',
        'rgba(0, 0, 255, 0.88)',
        'rgba(0, 0, 255, 0.89)',
        '#17181aff'
      ]}
      style={{ flex: 1 }}
      locations={[0.01, 0.07, 0.01, 0.5]}
      start={{ x: 0, y: 0.01 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* Avatar com navegação para Profile */}
          <TouchableOpacity style={styles.avatar} onPress={handleOpenProfile} activeOpacity={0.7}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 999,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            ) : (
              <Ionicons name="person" size={32} color={Colors.softWhite} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrap}>
          <View style={styles.principalBox}>
            <Text style={styles.contentTitle}>Odontyc!</Text>

            <View style={styles.content}>
              <Text style={styles.contentText}>Conteúdo principal vai aqui</Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.navButton} activeOpacity={0.6}>
                <Ionicons name="home" size={32} color="#fff" />
                <Text style={styles.navButtonLabel}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} activeOpacity={0.6}>
                <Ionicons name="list" size={32} color="#fff" />
                <Text style={styles.navButtonLabel}>List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default App;
