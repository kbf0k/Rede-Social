// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import app from '../../FirebaseConfig'


export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setSenha] = useState('');
    const [showAlert, setshowAlert] = useState(false)

    const Login = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('Inicio');
            })
            .catch((error) => {
                console.error(error);
                setshowAlert(true)
            });
    }

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Bold': Poppins_700Bold,
    });

    return (
        <LinearGradient colors={['#4a90e2', '#ff8c00', '#00b5b8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 180, y: 0 }} style={styles.container} >
            <BlurView intensity={55} tint="regular" style={styles.login_container}>
                <Image style={styles.logo} source={require('../assets/img/logo.png')} />
                <Text style={styles.titulo}>Entrar</Text>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Senha'
                    value={password}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <TouchableOpacity onPress={Login} style={styles.botao}>
                    <Text style={styles.textoBotao}>Entrar</Text>
                </TouchableOpacity>

                <View style={styles.criar_conta}>
                    <Text style={styles.textoConta}>Não tem uma conta?</Text>
                    <TouchableOpacity style={styles.Conta} onPress={() => navigation.navigate('Cadastro')}>Criar Conta</TouchableOpacity>
                </View>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Erro ao entrar"
                    titleStyle={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#ff8c00',
                        textAlign: 'center',
                        marginBottom: 10,
                        fontFamily: 'Poppins-Bold'
                    }}
                    message="Email ou senha inválidos. Verifique e tente novamente."
                    messageStyle={{
                        fontSize: 16,
                        color: '#fff',
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular'
                    }}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmButtonColor="#00b5b8"
                    confirmText="Tentar novamente"
                    confirmButtonStyle={{
                        paddingHorizontal: 25,
                        paddingVertical: 12,
                        borderRadius: 25,
                    }}
                    confirmButtonTextStyle={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        fontFamily: 'Poppins-Regular',
                        color: '#fff'
                    }}
                    contentContainerStyle={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: 15,
                        padding: 25,
                        width: '85%',
                    }}
                    onConfirmPressed={() => setshowAlert(false)}
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
        textAlign: 'center',
    },

    textoConta: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#fff',
        marginTop: 30,
        textAlign: 'center',
        maxWidth: 'auto'
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
    }
});
