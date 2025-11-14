import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0e12ff',
    },

    title: {
        color: '#fff',
        fontSize: 78, 
        fontFamily: 'CreamCake',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 3,
        paddingBottom: 20,
    },
    header: {
        width: '100%',
        height: 120,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    main: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#1c1d1fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 30,
        marginTop: 10,
    },

    titleForm: {
        fontWeight: 'bold',
        color: '#f1f1f1ff',
        fontSize: 28,
        marginBottom: 10,
    },
    form: {
        width: '100%',
        gap: 5,
    },

    footer: {
        width: '100%',
        marginTop: 'auto',
        paddingBottom: 20,
    },
    link: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: 'rgba(75, 196, 212, 1)', 
        backgroundColor: 'transparent',
    }
});