// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Pressable } from 'react-native';
import { getFirestore, updateDoc, getDocs, collection, doc } from 'firebase/firestore';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
import app from '../../FirebaseConfig';

const db = getFirestore(app);


export default function Perfil() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [showAlert, setAlertVisible] = useState(false);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const lista = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            nome: data.nome,
            senha: data.senha,
            imageUrl: data.imageUrl,
          };
        });
        setUsuarios(lista);

        // Pega o usuário autenticado
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Encontra o usuário do Firestore com e-mail igual ao do Authentication
          const usuarioEncontrado = lista.find(u => u.email === user.email);
          if (usuarioEncontrado) {
            setUsuarioSelecionado(usuarioEncontrado);
            setNome(usuarioEncontrado.nome);
            setEmail(usuarioEncontrado.email);
            setsenha(usuarioEncontrado.senha);
          }
        }
      } catch (error) {
        alert("Erro ao carregar usuários: " + error.message);
      }
    };

    carregarUsuarios();
  }, []);

  const editarUsuario = async () => {
    if (!usuarioSelecionado) return;

    const usuarioRef = doc(db, 'users', usuarioSelecionado.id);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Atualiza dados no Firestore
      await updateDoc(usuarioRef, {
        nome: nome,
        email: email,
      });

      // Atualiza o e-mail e senha do Authentication
      if (user) {
        await updateEmail(user, email);
        await updatePassword(user, senha);
      }

      // Atualiza a senha também no Firestore (por consistência, embora não recomendado em texto puro)
      await updateDoc(usuarioRef, {
        senha: senha,
      });

      setAlertVisible(true);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      alert("Erro ao atualizar o usuário: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_Box}>
        <View style={styles.box}>
          <Text style={styles.title}>Meu Perfil</Text>
          {usuarioSelecionado?.imageUrl ? (
            <Image
              style={styles.image}
              source={{ uri: usuarioSelecionado.imageUrl }}
            />
          ) : (
            <Image
              style={styles.image}
              source={require('../assets/img/avatar.png')}
            />
          )}

          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setsenha}
            secureTextEntry
            style={styles.input}
          />

          <Pressable style={styles.button_editar} onPress={() => editarUsuario()}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </Pressable>
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Informações atualizadas"
        titleStyle={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#00b5b8',
        }}
        message="Suas informações foram editadas com sucesso."
        messageStyle={{
          textAlign: 'center',
          fontSize: 16,
          color: '#f8f8f2',
        }}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="Confirmar"
        confirmButtonColor="#00b5b8"
        confirmButtonStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
        confirmButtonTextStyle={{
          fontWeight: 'bold',
          fontSize: 16,
        }}
        contentContainerStyle={{
          backgroundColor: '#282a36',
          borderRadius: 10,
          padding: 20,
        }}
        onConfirmPressed={() => setAlertVisible(false)}
      />
    </View >

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container_Box: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#f5f7fa',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ff8c00',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00b5b8',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: 'rgb(232, 240, 254)',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  button_editar: {
    backgroundColor: '#ff8c00',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
