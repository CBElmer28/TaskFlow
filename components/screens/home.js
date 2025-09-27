import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { loadTasks, saveTasks, loadCompletedCount, saveCompletedCount } from '../storage/storage';

const tasks = [
  { id: '1', title: 'Comprar leche' },
  { id: '2', title: 'Estudiar React Native' },
];

export default function home({ navigation }) {
  const isFocused = useIsFocused();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      const t = await loadTasks();
      const c = await loadCompletedCount();
      if (!mounted) return;
      setTasks(t);
      setCompletedCount(c);
      setLoading(false);
    }
    if (isFocused) loadAll();
    return () => { mounted = false; };
  }, [isFocused]);

  useEffect(() => {
    if (!loading) saveTasks(tasks);
  }, [tasks, loading]);

  useEffect(() => {
    if (!loading) saveCompletedCount(completedCount);
  }, [completedCount, loading]);

  const toggleDone = (id) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      return updated;
    });
    setCompletedCount(prevCount => {
      const wasDone = tasks.find(t => t.id === id)?.done;
      return wasDone ? Math.max(0, prevCount - 1) : prevCount + 1;
    });
  };

  const clearAll = () => {
    Alert.alert('Confirmar', 'Eliminar todas las tareas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setTasks([]);
          setCompletedCount(0);
          await saveTasks([]);
          await saveCompletedCount(0);
        }
      }
    ]);
  };

  const handleDelete = (item) => {
    setTasks(prev => prev.filter(t => t.id !== item.id));
    if (item.done) setCompletedCount(c => Math.max(0, c - 1));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.textWrap}>
        <Text style={[styles.title, item.done && styles.done]}>{item.title}</Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      </TouchableOpacity>
      <Button title="Eliminar" onPress={() => handleDelete(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>¡Bienvenido a TaskFlow!</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Button title="Agregar Tarea" onPress={() => navigation.navigate('Add Task')} />
        <Button title="Eliminar todas" color="#d00" onPress={clearAll} />
      </View>
      <Text style={{ marginBottom: 8 }}>Tareas completadas: {completedCount}</Text>
      {loading ? <Text>Cargando...</Text> : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No hay tareas</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  welcome: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  textWrap: { flex: 1, marginRight: 8 },
  title: { fontSize: 16 },
  desc: { color: '#666' },
  done: { textDecorationLine: 'line-through', color: '#999' },
});