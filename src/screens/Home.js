// Kaique Bernardes Ferreira e João Pedro da Cunha Machado

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Inicio() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    carregarPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPosts();
    }, [])
  );

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
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // const comentar = async () => {
  //   if (!novoComentario.trim()) return;

  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   if (!user || !selectedPost) return;

  //   await addDoc(collection(db, 'posts', selectedPost.id, 'comentarios'), {
  //     autor: user.email,
  //     texto: novoComentario,
  //     data: serverTimestamp(),
  //   });

  //   setNovoComentario('');
  //   await carregarComentarios(selectedPost.id);
  // };

  const comentar = async () => {
    if (!novoComentario.trim()) return;
  
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !selectedPost) return;
  
    await addDoc(collection(db, 'posts', selectedPost.id, 'comentarios'), {
      autor: user.email,
      autorUid: user.uid,
      texto: novoComentario,
      data: serverTimestamp(),
    });
  
    // 🔔 Criar notificação para o autor do post
    if (user.email !== selectedPost.autor) {
      await addDoc(collection(db, 'users', selectedPost.autorUid, 'notificacoes'), {
        tipo: 'comentario',
        texto: `${user.email} comentou em sua publicação "${selectedPost.titulo}": "${novoComentario}"`,
        data: serverTimestamp(),
        postId: selectedPost.id,
        lido: false,
      });
    }
  
    setNovoComentario('');
    await carregarComentarios(selectedPost.id);
  };  

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
  ref={scrollViewRef}
  contentContainerStyle={{
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
      {selectedPost && (
          <View style={styles.postSelecionado}>
            <Pressable style={styles.botaoFechar} onPress={() => setSelectedPost(null)}>
              <Text style={styles.textoFechar}>X</Text>
            </Pressable>
            <Text style={styles.autor_coments}>{selectedPost.nomeAutor}</Text>
            <Text style={styles.titulo_coments}>{selectedPost.titulo}</Text>
            <Text style={styles.descricao_coments}>{selectedPost.descricao}</Text>


            <View style={styles.comentarios}>
              <Text style={styles.subtitulo_coments}>Comentários</Text>
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

        <Text style={styles.subtitulo}>Todas as publicações</Text>
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
    borderWidth: 2,
    borderColor: '#00b5b8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#f9f9f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  titulo_coments: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 20,
    color: '#444',
  },
  descricao_coments: {
    fontSize: 20,
    color: '#444',
    marginTop: -2,
  },
  autor: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  autor_coments: {
    fontSize: 16,
    color: '#666',
  },
  postSelecionado: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#e9faff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00b5b8',
    width: '85%',
  },
  subtitulo: {
    fontSize: 28,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  subtitulo_coments: {
    fontSize: 18,
    marginTop: 5,
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
    backgroundColor: '#4A90E2',
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
    backgroundColor: '#E23237',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoFechar: {
    fontWeight: 'bold',
    color: 'white',
  },
  
});













// import React, { useState, useCallback } from 'react';
// import {
//   StyleSheet, Text, View, FlatList, TouchableOpacity,
//   TextInput, Pressable, KeyboardAvoidingView, Platform
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { db } from '../../FirebaseConfig';
// import {
//   collection, getDocs, query, orderBy, addDoc,
//   serverTimestamp, getDoc, doc
// } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// export default function Inicio() {
//   const [posts, setPosts] = useState([]);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [comentarios, setComentarios] = useState([]);
//   const [novoComentario, setNovoComentario] = useState('');

//   const carregarPosts = async () => {
//     const q = query(collection(db, 'posts'), orderBy('data', 'desc'));
//     const querySnapshot = await getDocs(q);
//     const lista = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
//       const post = docSnap.data();
//       const userDoc = await getDoc(doc(db, 'usuarios', post.autor));
//       const nomeAutor = userDoc.exists() ? userDoc.data().nome : post.autor;
//       return { id: docSnap.id, ...post, nomeAutor };
//     }));
//     setPosts(lista);
//   };

//   const carregarComentarios = async (postId) => {
//     const q = query(collection(db, 'posts', postId, 'comentarios'), orderBy('data'));
//     const snapshot = await getDocs(q);
//     const lista = await Promise.all(snapshot.docs.map(async (docSnap) => {
//       const comentario = docSnap.data();
//       const userDoc = await getDoc(doc(db, 'usuarios', comentario.autor));
//       const nomeAutor = userDoc.exists() ? userDoc.data().nome : comentario.autor;
//       return { id: docSnap.id, ...comentario, nomeAutor };
//     }));
//     setComentarios(lista);
//   };

//   const selecionarPost = async (postId) => {
//     setSelectedPostId((prevId) => (prevId === postId ? null : postId));
//     await carregarComentarios(postId);
//   };

//   const comentar = async () => {
//     if (!novoComentario.trim() || !selectedPostId) return;

//     const auth = getAuth();
//     const user = auth.currentUser;
//     const post = posts.find(p => p.id === selectedPostId);

//     await addDoc(collection(db, 'posts', selectedPostId, 'comentarios'), {
//       autor: user.email,
//       autorUid: user.uid,
//       texto: novoComentario,
//       data: serverTimestamp(),
//     });

//     if (user.email !== post.autor) {
//       await addDoc(collection(db, 'users', post.autorUid, 'notificacoes'), {
//         tipo: 'comentario',
//         texto: `${user.email} comentou em sua publicação "${post.titulo}": "${novoComentario}"`,
//         data: serverTimestamp(),
//         postId: selectedPostId,
//         lido: false,
//       });
//     }

//     setNovoComentario('');
//     await carregarComentarios(selectedPostId);
//   };

//   useFocusEffect(
//     useCallback(() => {
//       carregarPosts();
//     }, [])
//   );

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 16 }}
//         renderItem={({ item }) => (
//           <View>
//             <TouchableOpacity onPress={() => selecionarPost(item.id)} style={styles.card}>
//               <Text style={styles.autor}>{item.nomeAutor}</Text>
//               <Text style={styles.titulo}>{item.titulo}</Text>
//               <Text numberOfLines={2} style={styles.descricao}>{item.descricao}</Text>
//             </TouchableOpacity>

//             {selectedPostId === item.id && (
//               <View style={styles.comentarios}>
//                 <Text style={styles.subtitulo_coments}>Comentários</Text>
//                 {comentarios.map((c) => (
//                   <Text key={c.id} style={styles.comentario}>
//                     <Text style={{ fontWeight: 'bold' }}>{c.nomeAutor}:</Text> {c.texto}
//                   </Text>
//                 ))}
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Escreva um comentário..."
//                   value={novoComentario}
//                   onChangeText={setNovoComentario}
//                 />
//                 <Pressable style={styles.botao} onPress={comentar}>
//                   <Text style={styles.textoBotao}>Comentar</Text>
//                 </Pressable>
//               </View>
//             )}
//           </View>
//         )}
//       />
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   autor: { fontWeight: 'bold', marginBottom: 4 },
//   titulo: { fontSize: 18, fontWeight: 'bold' },
//   descricao: { fontSize: 14, color: '#555', marginTop: 4 },
//   comentarios: {
//     backgroundColor: '#eaeaea',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   subtitulo_coments: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
//   comentario: { marginBottom: 4, fontSize: 14 },
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     padding: 8,
//     borderRadius: 6,
//     marginTop: 8,
//     backgroundColor: '#fff',
//   },
//   botao: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 6,
//     marginTop: 8,
//     alignItems: 'center',
//   },
//   textoBotao: { color: '#fff', fontWeight: 'bold' },
// });