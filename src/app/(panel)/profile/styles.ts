import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#1b1b1bff',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    header: {
        width: '100%',
        marginTop: 40,
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: 50,
        fontWeight: 'bold',
    },
    foto: {
        width: 180,
        height: 180,
        borderRadius: 100,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkGray,
    },
    footer: {
        width: '100%',
        bottom: 70,
    }

})