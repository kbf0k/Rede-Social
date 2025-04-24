import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Inicio() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');

  useEffect(() => {
    const carregarPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('data', 'desc'));
      const querySnapshot = await getDocs(q);
      const lista = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const post = docSnap.data();
        const userDoc = await getDoc(doc(db, 'usuarios', post.autor));
        const nomeAutor = userDoc.exists() ? userDoc.data().nome : post.autor;
        return { id: docSnap.id, ...post, nomeAutor };
      }));
      setPosts(lista);
    };
    carregarPosts();
  }, []);

  const carregarComentarios = async (postId) => {
    const q = query(collection(db, 'posts', postId, 'comentarios'), orderBy('data'));
    const snapshot = await getDocs(q);
    const lista = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const comentario = docSnap.data();
      const userDoc = await getDoc(doc(db, 'usuarios', comentario.autor));
      const nomeAutor = userDoc.exists() ? userDoc.data().nome : comentario.autor;
      return { id: docSnap.id, ...comentario, nomeAutor };
    }));
    setComentarios(lista);
  };

  const selecionarPost = async (post) => {
    setSelectedPost(post);
    await carregarComentarios(post.id);
  };

  const comentar = async () => {
    if (!novoComentario.trim()) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !selectedPost) return;

    await addDoc(collection(db, 'posts', selectedPost.id, 'comentarios'), {
      autor: user.email,
      texto: novoComentario,
      data: serverTimestamp(),
    });

    setNovoComentario('');
    await carregarComentarios(selectedPost.id);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      {selectedPost && (
          <View style={styles.postSelecionado}>
            <Pressable style={styles.botaoFechar} onPress={() => setSelectedPost(null)}>
              <Text style={styles.textoFechar}>X</Text>
            </Pressable>
            <Text style={styles.autor}>{selectedPost.nomeAutor}</Text>
            <Text style={styles.titulo}>{selectedPost.titulo}</Text>
            <Text style={styles.descricao}>{selectedPost.descricao}</Text>


            <View style={styles.comentarios}>
              <Text style={styles.subtitulo}>Comentários:</Text>
              {comentarios.map((c) => (
                <Text key={c.id} style={styles.comentario}>
                  <Text style={{ fontWeight: 'bold' }}>{c.nomeAutor}:</Text> {c.texto}
                </Text>
              ))}
              <TextInput
                style={styles.input}
                placeholder="Escreva um comentário..."
                value={novoComentario}
                onChangeText={setNovoComentario}
              />
              <Pressable style={styles.botao} onPress={comentar}>
                <Text style={styles.textoBotao}>Comentar</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.subtitulo}>Todas as publicações:</Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selecionarPost(item)} style={styles.card}>
              <Text style={styles.autor}>{item.nomeAutor}</Text>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text numberOfLines={2} style={styles.descricao}>{item.descricao}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 16,
    color: '#444',
  },
  autor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  postSelecionado: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#e9faff',
    borderRadius: 8,
  },
  subtitulo: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  comentarios: {
    marginTop: 15,
  },
  comentario: {
    fontSize: 15,
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  botao: {
    backgroundColor: '#00b5b8',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoFechar: {
    alignSelf: 'flex-end',
    backgroundColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoFechar: {
    fontWeight: 'bold',
    color: '#333',
  },
  
});