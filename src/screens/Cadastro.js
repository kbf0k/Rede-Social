// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import s3 from '../../awsConfig'

import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as ImagePicker from "expo-image-picker";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const S3_BUCKET = "bucket-storage-alpha";

export default function Cadastro({ navigation }) {
    const [nome, setnome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [showAlert, setShowAlert] = useState(false)

    const registerUser = async (email, password, nome, imageUri) => {
        const auth = getAuth(getApp())
        const firestore = getFirestore(getApp())

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const filePath = `imagem_usuario/${email}/${filename}`

            const response = await fetch(imageUri)
            const blob = await response.blob()

            const uploadParms = {
                Bucket: S3_BUCKET,
                Key: filePath,
                Body: blob,
                ContentType: 'image/jpeg',
            }

            const uploadResult = await s3.upload(uploadParms).promise();
            const imageUrl = uploadResult.Location;

            await setDoc(doc(firestore, 'users', user.uid), {
                uid: user.uid,
                nome,
                email,
                imageUrl,
            });
        } catch (error) {
            alert('Erro ao registrar usuário: ' + error.message);
            throw error;
        }
    }

    const pickimage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const verificar = async () => {
        if (email && password && nome && imageUri) {
            await registerUser(email, password, nome, imageUri);
            setShowAlert(true)
        } else {
            alert('Preencha todos os campos!');
        }
    };

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Bold': Poppins_700Bold,
    });

    return (
        <LinearGradient colors={['#4a90e2', '#ff8c00', '#00b5b8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 180, y: 0 }} style={styles.container} >
            <BlurView intensity={55} tint="regular" style={styles.login_container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Image style={styles.logo} source={require('../assets/img/logo.png')} />
                <Text style={styles.titulo}>Cadastro</Text>

                <TextInput
                    placeholder='Digite seu nome'
                    value={nome}
                    onChangeText={setnome}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    style={styles.input}
                />

                <TouchableOpacity onPress={pickimage} style={styles.button_image}>
                    <Text style={styles.buttonText}>Selecionar imagem de perfil</Text>
                </TouchableOpacity>

                {imageUri && (
                    <View>
                        <Text style={{ fontWeight: 'bold', color: '#fff', marginBottom: 8, alignSelf: 'center' }}>Imagem selecionada:</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={{ uri: imageUri }}
                                style={{ width: 50, height: 50, borderRadius: 8 }}
                            />
                        </View>
                    </View>
                )}
                <TouchableOpacity onPress={verificar} style={styles.botao}>
                    <Text style={styles.textoBotao}>Criar Conta</Text>
                </TouchableOpacity>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Cadastro concluido com sucesso"
                    titleStyle={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#00b5b8' }}
                    message="Faça o login para entrar na sua conta."
                    messageStyle={{ textAlign: 'center', fontSize: 16, color: '#f8f8f2', textAlign: 'center' }}
                    closeOnTouchOutside={() => navigation.navigate('Login')}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmText='Confirmar'
                    confirmButtonColor="#00b5b8"
                    cancelButtonStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    confirmButtonStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                    cancelButtonTextStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    confirmButtonTextStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    contentContainerStyle={{
                        backgroundColor: '#282a36',
                        borderRadius: 10,
                        padding: 20,
                    }}
                    onConfirmPressed={() => navigation.navigate('Login')}
                />
            </BlurView>
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    login_container: {
        width: '85%',
        padding: 30,
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
    },

    logo: {
        width: 250,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    botaoVoltar: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: '#ffffff20',
        padding: 8,
        borderRadius: 20,
    },
    titulo: {
        fontSize: 32,
        fontFamily: 'Poppins-Bold',
        color: '#fff',
        marginBottom: 20,
    },

    input: {
        width: '100%',
        height: 45,
        borderColor: '#00b5b8',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        color: '#fff',
        fontFamily: 'Poppins-Regular',
    },

    button_image: {
        width: '100%',
        borderRadius: 20,
        paddingHorizontal: 12,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#ff8c00',
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },

    botao: {
        backgroundColor: '#00b5b8',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },

    criar_conta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 20
    },

    textoConta: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
    },

    Conta: {
        marginTop: 10,
        backgroundColor: '#ff8c00',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        marginLeft: 30
    }
});