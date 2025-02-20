import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ListaScreen from './src/screens/ListaScreen';
import { RootStackParamList } from './src/types/Nav';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Tá na Lista!' }} 
        />
        <Stack.Screen 
        name="Lista" 
        component={ListaScreen} 
        options={{ title: 'Lista de Compras' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
