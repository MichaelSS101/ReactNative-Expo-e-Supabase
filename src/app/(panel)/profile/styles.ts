import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#1b1b1bff',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        backgroundColor: 'black'
    },
    footer: {
        width: '100%',
        bottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 50,
        padding: 10,
        zIndex: 10,
    },
});
