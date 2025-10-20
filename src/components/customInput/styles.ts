import {StyleSheet} from "react-native";
import { Colors } from '@/constants/colors'


export const styles = StyleSheet.create({

    container: {
        gap: 10,
        marginTop: 20,
    },

    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.softWhite,
        paddingLeft: 20,
        marginTop: 20,
    },

    input: {
        width: '95%',
        height: 52,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f1f1f1ff',
        paddingLeft: 12,
        fontSize: 16,
        color: '#f1f1f1ff',
        alignSelf: 'center',
    }

})