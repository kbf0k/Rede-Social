// Kaique Bernardes Ferreira e João Pedro da Cunha Machado

import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

export default function TelaSplash() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current; // valor inicial da opacidade

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Bold': Poppins_700Bold,
    });

    useEffect(() => {
        // Animação de fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Timer para trocar de tela
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <LinearGradient
            colors={['#4a90e2', '#ff8c00', '#00b5b8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <Animated.View style={{ alignItems: 'center', opacity: fadeAnim }}>
                <Image style={styles.logo} source={require('../assets/img/logo.png')} />
                <Text style={styles.titulo}>Conecte, Compartilhe, Viva.</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    titulo: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        marginTop: 20,
    },
});
