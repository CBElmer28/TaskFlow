import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INTERVAL_KEY = '@taskflow_clock_interval_v1';
const OPTIONS = [1, 2, 5,10]; // segundos

export default function Settings() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [intervalSec, setIntervalSec] = useState(1);
  const timerRef = useRef(null);

  // Cargar intervalo persistido
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(INTERVAL_KEY)
      .then(raw => {
        if (!mounted) return;
        const val = raw ? parseInt(raw, 10) : 1;
        if (OPTIONS.includes(val)) setIntervalSec(val);
      })
      .catch(e => console.error('load interval', e));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCurrentTime(new Date().toLocaleTimeString());
    timerRef.current = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, intervalSec * 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [intervalSec]);

  const changeInterval = async (sec) => {
    try {
      await AsyncStorage.setItem(INTERVAL_KEY, sec.toString());
      setIntervalSec(sec);
    } catch (e) {
      console.error('save interval', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hora actual</Text>
      <Text style={styles.time}>{currentTime}</Text>

      <Text style={[styles.label, { marginTop: 24 }]}>Intervalo del reloj</Text>
      <View style={styles.optionsRow}>
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBtn, intervalSec === opt && styles.optionBtnActive]}
            onPress={() => changeInterval(opt)}
          >
            <Text style={intervalSec === opt ? styles.optionTextActive : styles.optionText}>{opt} s</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, fontWeight: '600' },
  time: { fontSize: 28, marginTop: 8 },
  optionsRow: { flexDirection: 'row', marginTop: 12 },
  optionBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 10 },
  optionBtnActive: { backgroundColor: '#2f95dc', borderColor: '#2f95dc' },
  optionText: { color: '#333', fontWeight: '600' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
});
