import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#32cf59ff',
    },

    title: {
        fontSize: 32,
        marginBottom: 25,
        fontWeight: 'bold',
        color: '#f1f1f1ff'
    },
    header: {
        width: '100%',
        height: '20%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: 'rgba(236, 236, 236, 0.5)',
        borderRadius: 10,
        width: 35,
        height: 35,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    
    main:{
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#1c1d1fff',
        borderRadius: 20,
        
    },

    titleForm: {
        fontWeight: 'bold',
        color: '#f1f1f1ff',
        fontSize: 26,
        paddingTop: 20,
    },
    form: {
        width: '100%',
    },
    
    footer: {
        width: '100%',
        paddingTop: 70

    }
});