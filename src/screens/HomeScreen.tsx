import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { adicionarLista, carregarListas,removerLista } from '../services/ListaService';
import CriarListaModal from '../components/CriarListaModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lista } from '../types/Lista';

type RootStackParamList = {
  Home: undefined;
  Lista: { id: string }; 
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  const [listas, setListas] = useState<Lista[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dados: Lista[] = await carregarListas();
    setListas(dados);
  };

  const handleAdicionarLista = async (nomeLista: string) => {
    if (!nomeLista) {
      Alert.alert('Digite um nome para a lista');
      return;
    }

    const novasListas = await adicionarLista(nomeLista, new Date(), []); 
    setListas(novasListas);
  };

  const handleExcluirLista = async (idLista: string) => {
    await removerLista(idLista);
    carregarDados();
  };

  const handleListClick = (id: string) => {
    navigation.navigate('Lista', { id }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Listas de Compras</Text>

      <View style={styles.buttonContainer}>
        <Button title="Criar Nova Lista" onPress={() => setModalVisible(true)} color="#2D6A4F" />
      </View>

      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleListClick(item.id)}
            style={styles.itemContainer}>
            <Text style={styles.itemText} >
              {item.nome}
            </Text>
            <TouchableOpacity  onPress={() => handleExcluirLista(item.id)}>
              <Text style={styles.itemDate}>
                {item.dataCriacao.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </Text>

              <Text style={styles.deleteButton}>
                ❌
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <CriarListaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddLista={handleAdicionarLista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEC1',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#6C584C',
  },
  buttonContainer: {
    marginBottom: 25,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF3DA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A98467',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C584C',
  },
  itemDate: {
    fontSize: 16,
    color: '#6C584C',
  },
  deleteButton: {
    textAlign:'center',
    fontSize: 18,
    color: 'red',
  },
});

export default HomeScreen;
