import { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { styles } from '@/styles/(auth)/signup';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

import { Colors } from '@/constants/colors';
import { Button } from '@/components/button';
import { CustomInput } from '@/components/customInput';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);

    try {

      if (!name.trim() || !email.trim() || !password) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos para se cadastrar.');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Erro na Senha', 'A senha precisa ter pelo menos 6 caracteres.');
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      const expireAt = Date.now() + 10_000;
      await AsyncStorage.setItem('suppress_auto_redirect', String(expireAt));

      const { data, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            permissao: 'paciente',
          },
        },
      });

      if (authError) {
        await AsyncStorage.removeItem('suppress_auto_redirect');
        Alert.alert('Erro no Cadastro', authError.message);
        return;
      }

      const user = data.user;
      if (!user) {
        await AsyncStorage.removeItem('suppress_auto_redirect');
        Alert.alert('Erro', 'Usuário criado parcialmente. Tente logar.');
        return;
      }

      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        name: name.trim(),
        email: normalizedEmail,
        permissao: 'paciente',
      });

      if (insertError) {
        if ((insertError as any).code !== '23505') {
          console.error('Erro ao inserir perfil:', insertError);
          Alert.alert('Aviso', 'Conta criada, mas houve problema ao salvar o perfil. Faça login.');
        }
      }

      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro durante signOut pós-cadastro (não crítico):', e);
      }

      try {
        await AsyncStorage.removeItem('session');
      } catch (e) {
      }

      await new Promise((res) => setTimeout(res, 100));

      Alert.alert('Sucesso', 'Conta criada! Verifique seu e-mail se necessário e faça login.');
      router.replace('/(auth)/signin/page');

    } catch (err: any) {
      console.error('Signup error:', err);
      Alert.alert('Erro Inesperado', 'Não foi possível completar o cadastro. Tente novamente.');
      try {
        await AsyncStorage.removeItem('suppress_auto_redirect');
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d0e12ff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            <View style={styles.header}>
              <Pressable
                style={{ position: 'absolute', top: 0, left: 20, zIndex: 1 }}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={32} color={Colors.softWhite} />
              </Pressable>

              <Text style={styles.title}>Odontyc!</Text>
            </View>

            <View style={styles.main}>
              <Text style={styles.titleForm}>Crie sua conta</Text>

              <View style={styles.form}>
                <CustomInput
                  label="Nome"
                  placeholder="Digite seu nome..."
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={Colors.inputTextInput}
                />

                <CustomInput
                  label="Email"
                  placeholder="Digite seu Email..."
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.inputTextInput}
                />

                <CustomInput
                  label="Senha"
                  placeholder="Crie uma senha (mínimo 6 caracteres)"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor={Colors.inputTextInput}
                  secureTextEntry
                />
              </View>

              <Pressable onPress={() => router.replace('/(auth)/signin/page')} style={styles.link}>
                <Text style={styles.link}>Já tenho uma conta. Fazer Login</Text>
              </Pressable>

              <View style={styles.footer}>
                <Button onPress={handleSignUp} title={loading ? 'Carregando...' : 'Cadastrar'} disabled={loading} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
