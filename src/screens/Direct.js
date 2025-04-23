// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuth, singInWithEmailAndPassword } from 'firebase/auth';
import app from '../../FirebaseConfig'

export default function Direct() {
    return (
        <View style={styles.container}>
            <Text>Direct</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});