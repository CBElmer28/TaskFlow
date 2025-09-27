import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TASKS_KEY } from '../storage/storage';

export default function addtask({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validación', 'El título es obligatorio');
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(TASKS_KEY);
      const tasks = raw ? JSON.parse(raw) : [];
      const newTask = { id: Date.now().toString(), title: title.trim(), description: description.trim(), done: false, createdAt: new Date().toISOString() };
      const updated = [newTask, ...tasks];
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      setTitle('');
      setDescription('');
      navigation.navigate('home');
    } catch (e) {
      console.error('handleSubmit', e);
      Alert.alert('Error', 'No se pudo guardar la tarea');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Ir al gym" />
      <Text style={styles.label}>Descripción</Text>
      <TextInput value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline placeholder="Hacer cardio 30 minutos" />
      <Button title="Guardar tarea" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 12 },
});