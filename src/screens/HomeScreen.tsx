import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { adicionarLista, carregarListas } from '../services/ListaService';
import CriarListaModal from '../components/CriarListaModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lista } from '../types/Lista';


type RootStackParamList = {
  Home: undefined;
  Lista: undefined;
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
    Alert.alert('apaga lista lista id: ' + idLista);
  }

  const handleListClick = (id: string) => {
    navigation.navigate('Lista', { id }); 
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign:'center', marginBottom:'25' }}>Minhas Listas de Compras</Text>

      <View style={{ marginBottom:'25' }}>
        <Button title="Criar Nova Lista" onPress={() => setModalVisible(true)} />
      </View>

      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>

            <Text style={{ fontSize: 18, fontWeight: 'bold' }} onPress={() => handleListClick(item.id)}>
              {item.nome}
            </Text>
            <View >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {item.dataCriacao.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </Text>

              <Text style={{ fontSize: 18, fontWeight: 'bold' }} onPress={() => handleExcluirLista(item.id)}>
                Apagar
              </Text>
            </View>
          </View>
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

export default HomeScreen;
