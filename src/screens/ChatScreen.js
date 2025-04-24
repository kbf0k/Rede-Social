// Kaique Bernardes Ferreira e João Pedro da Cunha Machado

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import app from '../../FirebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

export default function ChatScreen({ route, navigation, item }) {
    const { user } = route.params;
    const [mensagem, setMensagem] = useState('');
    const [mensagens, setMensagens] = useState([]);
    const flatListRef = useRef();

    const currentUser = auth.currentUser;

    useEffect(() => {

        const chatId = [currentUser.uid, user.id].sort().join('_');
        const q = query(collection(db, 'chats', chatId, 'mensagens'), orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mensagensCarregadas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMensagens(mensagensCarregadas);
        });

        return unsubscribe;
    }, []);

    const enviarMensagem = async () => {
        if (mensagem.trim() === '') return;

        const chatId = [currentUser.uid, user.id].sort().join('_');

        await addDoc(collection(db, 'chats', chatId, 'mensagens'), {
            texto: mensagem,
            senderId: currentUser.uid,
            receiverId: user.id,
            createdAt: Timestamp.now(),
        });

        setMensagem('');
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.senderId === currentUser.uid;

        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
                <Text style={styles.messageText}>{item.texto}</Text>
            </View>
        );
    };

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#00b5b8" />
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                    </View>
                    <Text style={styles.userName}>{user.nome}</Text>
                </View>
            </View>


            <FlatList
                ref={flatListRef}
                data={mensagens}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 12 }}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={mensagem}
                    onChangeText={setMensagem}
                    placeholder="Digite sua mensagem..."
                    style={styles.input}
                />
                <TouchableOpacity onPress={enviarMensagem} style={styles.sendButton}>
                    <Ionicons name="send" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },

    backButton: {
        padding: 5,
        marginRight: 10,
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Poppins-Regular',
    },

    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 10,
    },

    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins-Regular',
    },

    messageContainer: {
        maxWidth: '75%',
        padding: 10,
        marginVertical: 4,
        borderRadius: 12,
        fontFamily: 'Poppins-Regular',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#00b5b8',
        borderTopRightRadius: 0,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: '#000',
        fontFamily: 'Poppins-Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#00b5b8',
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
