// Kaique Bernardes Ferreira e João Pedro da Cunha Machado

import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'; // 👈 importação necessária

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);

  const carregarNotificacoes = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notificacoes'),
      orderBy('data', 'desc')
    );
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotificacoes(lista);
  };

  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Notificações</Text>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificacao}>
            <Text style={styles.texto}>{item.texto}</Text>
            <Text style={styles.data}>{new Date(item.data?.toDate()).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma notificação.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  notificacao: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  texto: { fontSize: 16 },
  data: { fontSize: 12, color: '#555', marginTop: 4 },
});