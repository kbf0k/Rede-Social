// Kaique Bernardes Ferreira Joao Pedro da Cunha Machado
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { db } from '../../FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import AwesomeAlert from 'react-native-awesome-alerts';

export default function NovoPost() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const publicarPost = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('Erro', 'Usuário não está logado.');
        return;
      }

      await addDoc(collection(db, 'posts'), {
        titulo,
        descricao,
        autor: user.email,
        data: serverTimestamp(),
      });

      // alert('Sucesso', 'Post publicado!');
      alert('Sucesso, post publicado!');
      setTitulo('');
      setDescricao('');
    } catch (error) {
      console.error("Erro ao publicar post:", error);
      // alert('Erro', 'Não foi possível publicar o post.');
      alert('Erro, não foi possível publicar o post.');
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container_form}>
        <Text style={styles.h1}>Nova publicação</Text>
        <View style={styles.form_post}>
          {/* <Text style={styles.label}>Título</Text> */}
          <TextInput
            style={[styles.input, { height: 50 }]}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          {/* <Text style={styles.label}>Descrição</Text> */}
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
        </View>
        <Pressable style={styles.botao} onPress={publicarPost}>
          <Text style={styles.textoBotao}>Publicar</Text>
        </Pressable>
      </View>

      {/* <AwesomeAlert
        show={alertVisible}
        showProgress={false}
        title="Sucesso!"
        titleStyle={styles.alertTitle}
        message="O usuário foi atualizado com sucesso!"
        messageStyle={styles.alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Fechar"
        confirmButtonColor="#ff79c6"
        confirmButtonStyle={styles.alertButton}
        confirmButtonTextStyle={styles.alertButtonText}
        contentContainerStyle={styles.alertContainer}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_form: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    gap: 15,
    width: '100%',
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form_post: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#00b5b8',
    backgroundColor: 'rgb(232, 240, 254)',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  botao: {
    backgroundColor: '#ff8c00',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  textoBotao: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  // alertContainer: {
  //   backgroundColor: '#282a36',
  //   borderRadius: 12,
  //   padding: 22,
  // },
  // alertTitle: {
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   color: '#00b5b8',
  //   textAlign: 'center',
  // },
  // alertMessage: {
  //   fontSize: 16,
  //   color: '#f8f8f2',
  //   textAlign: 'center',
  //   marginTop: 10,
  // },
  // alertButton: {
  //   paddingHorizontal: 24,
  //   paddingVertical: 12,
  //   backgroundColor: '#4a90e2',
  //   borderRadius: 8,
  // },
  // alertButtonText: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   color: '#fff',
  //   textAlign: 'center',
  // },
});