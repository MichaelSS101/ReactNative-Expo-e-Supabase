import { useState } from 'react'
import { Text, View, Pressable, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'

import { styles } from './styles'
import {Ionicons} from '@expo/vector-icons'

import { Colors } from '@/constants/colors'
import { Button } from '@/components/button'
import { CustomInput } from '@/components/customInput'


export default function SignUp() {

    const [name, setName,] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignUp(){
        setLoading(true);

        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options:{
                data:{
                    name: name
                }
            }
        })

        if(error){
            Alert.alert('Error', error.message)
            setLoading(false);
            return;
        }
        
        setLoading(false);
        router.replace('/(auth)/signin/page')

    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#111111ff' }}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.header}>

                        <Pressable 
                        style={styles.backButton}
                        onPress={() => router.back()}
                        >
                            <Ionicons name='arrow-back' size={24} color={Colors.softWhite} />
                        </Pressable>
                        <Text style={styles.title}>Odontyc!</Text>
                    </View>

                    <View style={styles.main}>
                        <Text style={styles.titleForm}>
                                Crie uma conta
                        </Text>

                        <View style={styles.form}>

                            <CustomInput label='Nome' 
                            placeholder='Digite seu nome...' 
                            value={name} 
                            onChangeText={setName} 
                            placeholderTextColor={Colors.inputTextInput} />

                            <CustomInput label='Email' 
                            placeholder='Digite seu Email...' 
                            value={email} 
                            onChangeText={setEmail} 
                            placeholderTextColor={Colors.inputTextInput} />

                            <CustomInput label='Senha' 
                            placeholder='Crie uma senha' 
                            value={password} 
                            onChangeText={setPassword} 
                            placeholderTextColor={Colors.inputTextInput} 
                            secureTextEntry />
                            
                        </View>

                        <View style={styles.footer}>
                            <Button onPress={handleSignUp} title="Criar conta"> 
                                {loading ? 'Carregando...' : 'Cadastrar'} 
                            </Button>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}