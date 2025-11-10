import { useState } from 'react'
import { Text, View, ScrollView, Alert } from 'react-native'
import { styles } from './styles'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

import { Colors } from '@/constants/colors'
import { Button } from '@/components/button'
import { CustomInput } from '@/components/customInput'


export default function Registrar() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn(){
        setLoading(true);

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error){
            Alert.alert('Error', error.message)
            setLoading(false);
            return;
        }

        setLoading(false);
        router.replace('/(panel)/profile/page')

    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#111111ff' }}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Odontyc!</Text>
                    </View>

                    <View style={styles.main}>
                        <Text style={styles.titleForm}>
                            Faça seu Login
                        </Text>

                        <View style={styles.form}>

                            <CustomInput label='Email' 
                            placeholder='Digite seu Email...' 
                            onChangeText={setEmail} 
                            placeholderTextColor={Colors.inputTextInput} />
                            
                            <CustomInput label='Senha' 
                            placeholder='Digite uma senha' 
                            onChangeText={setPassword} 
                            placeholderTextColor={Colors.inputTextInput} 
                            secureTextEntry />
                    
                        </View>

                        <Link href={'/(auth)/signup/page'} style={styles.link}>
                            <Text> Não tenho uma conta! Cadastre-se </Text>
                        </Link>

                        <View style={styles.footer}>
                            <Button onPress={handleSignIn} title="Entrar"> 
                                {loading ? 'Carregando...' : 'Entrar'} 
                            </Button>
                        </View>
                

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
        
    )
}