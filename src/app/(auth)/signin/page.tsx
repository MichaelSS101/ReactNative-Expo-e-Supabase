import { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { styles } from '@/styles/(auth)/signin';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

import { Colors } from '@/constants/colors';
import { Button } from '@/components/button';
import { CustomInput } from '@/components/customInput';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      setLoading(true);

      if (!email || !password) {
        Alert.alert('Erro', 'Preencha email e senha.');
        return;
      }

      // LOGIN
      const { data: signInData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        const errorMessage = authError.message.includes('Invalid login credentials') 
                            ? 'Email ou senha inválidos. Tente novamente.' 
                            : authError.message;
        Alert.alert('Erro no Login', errorMessage);
        return;
      }

      const user = signInData.user;
      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado após o login.');
        return;
      }

      // BUSCAR PERMISSÃO
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('permissao')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        Alert.alert(
          'Erro',
          'Login efetuado, mas não foi possível verificar sua permissão.'
        );

        router.replace('/(panel)/paciente/page'); 
        return;
      }

      if (userData?.permissao?.toLowerCase() === 'dentista') {
        router.replace('/(panel)/dentista/page');
      } else {
        router.replace('/(panel)/paciente/page');
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Erro Inesperado', 'Não foi possível fazer login. Verifique sua conexão.');
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
              <Text style={styles.title}>Odontyc!</Text>
            </View>

            <View style={styles.main}>

              <Text style={styles.titleForm}>Faça seu Login</Text>

              <View style={styles.form}>
                <CustomInput
                  label="Email"
                  placeholder="Digite seu Email..."
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.inputTextInput}
                />

                <CustomInput
                  label="Senha"
                  placeholder="Digite sua senha"
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={Colors.inputTextInput}
                />
              </View>

              <Link href={'/(auth)/signup/page'} style={styles.link}>
                <Text style={styles.link}>
                  Não tenho uma conta! Cadastre-se
                </Text>
              </Link>

              <View style={styles.footer}>
                <Button
                  onPress={handleSignIn}
                  title={loading ? 'Carregando...' : 'Entrar'}
                  disabled={loading}
                />
              </View>

            </View>

          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}