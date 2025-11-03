import { Button } from '@/components/button';
import { useAuth } from '@/contexts/AuthContexts';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { setAuth } = useAuth();

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    setAuth(null);
    if (error) Alert.alert('Erro', 'Erro ao sair da conta, tente mais tarde.');
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setName('Usuário não logado');
          setEmail(null);
          setLoading(false);
          return;
        }

        setEmail(user.email ?? null);

        const { data, error } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();
        if (error) throw error;

        setName(data?.name ?? 'Usuário');
        setAvatarUrl(data?.avatar_url ?? null);
      } catch (err) {
        console.error(err);
        setName('Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePickImage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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
      mediaTypes: 'images',
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

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, buffer);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrlData.publicUrl);

      await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', user.id);

      Alert.alert('Sucesso', 'Foto carregada com sucesso!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32 }}>Carregando informações...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.softWhite }}>Perfil</Text>

        <TouchableOpacity style={styles.foto} activeOpacity={0.8} onPress={handlePickImage}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{width: 180, height: 180, borderRadius: 100,}}
            />
          ) : (
            
            <Ionicons name='pencil' size={24} color={'black'}
            style={{alignSelf: 'flex-end', top: 70, right: 10, borderRadius: 50, borderWidth: 10, borderColor: 'rgb(255, 255, 255)', backgroundColor: 'rgb(255, 255, 255)'}} />
          )}
        </TouchableOpacity>

        {uploading && <ActivityIndicator size="small" color={Colors.softWhite} />}

        <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.softWhite, marginTop: 20 }}>
          {name}
        </Text>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'rgba(224, 224, 224, 0.6)', marginTop: 8 }}>
          {email}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Sair da conta" onPress={handleSignout} />
      </View>
    </View>
  );
}
