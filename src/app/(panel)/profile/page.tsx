import { useAuth } from '@/contexts/AuthContexts'
import { Button } from '@/components/button'
import { supabase } from '@/lib/supabase'
import { View, Text, Alert } from 'react-native'

export default function Profile(){

    const { setAuth } = useAuth();

    async function handleSignout(){
    const { error } = await supabase.auth.signOut();
    setAuth(null)

        if(error){
            Alert.alert('Error', 'Erro ao sair da conta, tente mais tarde.')
            return;
        }
    }

    return (
        <View>
            <Text> Página Perfil!</Text>

            <Button title='Deslogar'
            onPress={handleSignout} 
            />
        </View>
    )
}