import { View, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/colors'
import { styles } from './styles'

export default function Index() {

    return (

        <View style={styles.container}>
            <ActivityIndicator size={46} color={'blue'} />
        </View>

    );
}