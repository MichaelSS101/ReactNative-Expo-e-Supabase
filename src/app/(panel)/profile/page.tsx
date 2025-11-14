import { Button } from '@/components/button';
import { useAuth } from '@/contexts/AuthContexts';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/(panel)/profile';

import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type UserPermissao = 'paciente' | 'dentista' | null;

export default function Profile() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [permissao, setPermissao] = useState<UserPermissao>(null); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { user, signOut } = useAuth() as {
    user: any | null;
    signOut?: () => Promise<void>;
  };

  const router = useRouter();

  const handleGoBack = () => {
    let path: '/(panel)/paciente/page' | '/(panel)/dentista/page' = '/(panel)/paciente/page';

    if (permissao === 'dentista') {
      path = '/(panel)/dentista/page';
    } else if (permissao === 'paciente') {
      path = '/(panel)/paciente/page';
    }
    
    router.replace(path);
  };

  const handleSignout = async () => {
    try {
      if (typeof signOut === 'function') {
        await signOut();
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      router.replace('/(auth)/signin/page'); 
    } catch (err: any) {
      console.error('Logout error:', err);
      Alert.alert('Erro ao sair', err?.message ?? 'Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setName('Usuário não logado');
        setEmail(null);
        setPermissao(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {

        setEmail(user.email ?? null);

        const { data, error } = await supabase
          .from('users')
          .select('name, avatar_url, permissao')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
            setName(data.name ?? user.email.split('@')[0]);
            setAvatarUrl(data.avatar_url ?? null);
            setPermissao(data.permissao as UserPermissao ?? 'paciente'); 
        } else {
            setName(user.email.split('@')[0] || 'Usuário');
            setPermissao('paciente'); 
            setAvatarUrl(null);
        }

      } catch (err) {
        console.error('fetchUserInfo error:', err);
        setName('Erro ao carregar');
        setPermissao(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const handlePickImage = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria para trocar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    setUploading(true);

    try {
      const fileUri = result.assets[0].uri;
      const fileExt = fileUri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const response = await fetch(fileUri);
      const buffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${fileExt}`
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newAvatarUrl = publicUrlData.publicUrl;
      
      await supabase.from('users').update({ avatar_url: newAvatarUrl }).eq('id', user.id);

      setAvatarUrl(newAvatarUrl);

      Alert.alert('Sucesso', 'Foto carregada com sucesso!');
    } catch (err: any) {
      console.error('upload error:', err);
      Alert.alert('Erro', err.message || 'Não foi possível enviar a imagem. Verifique o servidor de storage.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1b1b1bff' }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color={Colors.softWhite} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          
          <TouchableOpacity style={styles.fotoArea} activeOpacity={0.8} onPress={handlePickImage} disabled={loading || uploading}>
            {(loading || uploading) ? (
              <ActivityIndicator size="large" color="#00BFFF" />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Ionicons name="person" size={64} color={Colors.softWhite} />
            )}
          </TouchableOpacity>

          <Text style={styles.infoText}>
            {name}
          </Text>

          <Text style={styles.emailText}>
            {email}
          </Text>
          
          <Text style={{ marginTop: 20, fontSize: 14, color: '#00BFFF' }}>
              Permissão: {permissao?.toUpperCase() || 'N/A'}
          </Text>
          
        </View>

        <View style={styles.footer}>
          <Button title="Sair da conta" onPress={handleSignout} />
        </View>
      </View>
    </SafeAreaView>
  );
}