import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1012',
    },

    title: {
        color: '#fff',
        bottom: 20,
        fontSize: 64,
        fontStyle: 'italic',
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 4,
    },
    header: {
        width: '100%',
        height: '20%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    main: {
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
        paddingTop: 150,

    },
    link: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        backgroundColor: '#282b2cff',
        color: '#ecececff',
        borderRadius: 20,
    }
});