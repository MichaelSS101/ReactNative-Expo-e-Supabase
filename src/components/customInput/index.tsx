import { View, Text, TextInput, TextInputProps} from "react-native";
import {styles} from './styles'

interface CustomInputProps extends TextInputProps {
    label: string;

}

export function CustomInput({ label, ...rest}: CustomInputProps){
    return (

        <View style={styles.container}>

            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} {...rest}  />

        </View>
        
    )
}