import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SymptomInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>증상 단계</Text>
      <Text style={styles.description}>증상 단계는 이렇게 도출돼요!</Text>
      <View style={styles.emojis}>
        <Image source={require('../assets/happy.png')} style={styles.emoji} />
        <Image source={require('../assets/smile.png')} style={styles.emoji} />
        <Image source={require('../assets/neutral.png')} style={styles.emoji} />
        <Image source={require('../assets/sad.png')} style={styles.emoji} />
        <Image source={require('../assets/very_sad.png')} style={styles.emoji} />
      </View>
      <Text style={styles.label}>매우좋음 : 0~n개</Text>
      <Text style={styles.label}>좋음 : n~n개</Text>
      <Text style={styles.label}>보통 : n~n개</Text>
      <Text style={styles.label}>나쁨 : n~n개</Text>
      <Text style={styles.label}>매우나쁨 : n~n개</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  emojis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  emoji: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SymptomInfoScreen;
