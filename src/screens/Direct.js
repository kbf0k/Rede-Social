// Kaique Bernardes Ferreira e João Pedro da Cunha Machado

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import app from '../../FirebaseConfig';

const db = getFirestore(app);

export default function Direct({ navigation }) {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const carregarUsuarios = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'users'));
                setUsuarios(snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nome: data.nome,
                        email: data.email,
                        senha: data.senha,
                        imageUrl: data.imageUrl,
                    };
                }));
            } catch (error) {
                alert("Erro ao carregar usuários: " + error.message);
            }
        };

        carregarUsuarios();
    }, []);


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatScreen', { user: item })}>
            {item.imageUrl ? (
                <Image
                    style={styles.image}
                    source={{ uri: item.imageUrl }}
                />
            ) : (
                <Image
                    style={styles.image}
                    source={require('../assets/img/avatar.png')}
                />
            )}
            <View style={styles.chatText}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.message}>{item.email}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Direct</Text>
            </View>
            <FlatList
                data={usuarios}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#ff8c00',
        padding: 16,
        alignItems: 'center',
    },
    backButton: {
        marginRight: 8,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        marginTop: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 6,
        backgroundColor: 'rgba(255, 140, 0, 0.45)',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },

    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00b5b8',
        marginRight: 12,
    },
    chatText: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        color: '#000',
    },
    time: {
        fontSize: 12,
        color: '#ff8c00',
    },
});