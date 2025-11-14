import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#1b1b1bff',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40, 
        flex: 1, 
    },
    title: { 
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.softWhite,
        marginBottom: 30,
    },
    fotoArea: { 
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        marginBottom: 20,
        overflow: 'hidden', 
        borderWidth: 2, 
        borderColor: '#00BFFF',
    },
    infoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.softWhite,
        marginTop: 5,
    },
    emailText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#999', 
        marginTop: 5,
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
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