import React, { FC } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { MoodPicker } from '../components/MoodPicker';
import { useAppContext } from '../App.provider';

export const Home: FC = () => {
  const appContext = useAppContext();

  const imageUrl =
    'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1766&q=80';

  return (
    <ImageBackground source={{ uri: imageUrl }} style={styles.container}>
      <MoodPicker handleSelectMood={appContext.handleSelectMood} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
