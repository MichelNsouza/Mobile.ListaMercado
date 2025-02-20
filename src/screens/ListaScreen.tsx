import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';  // Importar o Checkbox da react-native-paper
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/Nav';
import Produto from '../types/Produto';

type ListaScreenRouteProp = RouteProp<RootStackParamList, 'Lista'>;

interface Props {
  route: ListaScreenRouteProp;
}

const ListaScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params || {};
  if (!id) {
    console.error('ID não fornecido para a rota ListaScreen');
    return null;
  }

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState('');
  const STORAGE_KEY = `lista_${id}`;

  useEffect(() => {
    const carregarLista = async () => {
      try {
        const produtosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
        if (produtosSalvos) {
          setProdutos(JSON.parse(produtosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar lista:', error);
      }
    };

    carregarLista();
  }, []);

  const salvarLista = async (novaLista: Produto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  const adicionarProduto = () => {
    if (!novoProduto.trim()) return;

    const novoItem: Produto = {
      id: String(Date.now()),
      nome: novoProduto,
      quantidade: 1,
      valor: 0.00,
      marcado: false,
    };

    const novaLista = [...produtos, novoItem];
    setProdutos(novaLista);
    salvarLista(novaLista);
    setNovoProduto('');
  };

  const alterarQuantidade = (id: string, delta: number) => {
    const novaLista = produtos.map((produto) =>
      produto.id === id ? { ...produto, quantidade: Math.max(1, produto.quantidade + delta) } : produto
    );
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  const alterarValor = (id: string, valor: string) => {
    const novaLista = produtos.map((produto) =>
      produto.id === id ? { ...produto, valor: parseFloat(valor.replace(',', '.')) || 0 } : produto
    );
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  const alternarMarcacao = (id: string) => {
    setProdutos((produtosAnteriores) => {
      const novaLista = produtosAnteriores.map((produto) =>
        produto.id === id ? { ...produto, marcado: !produto.marcado } : produto
      );
      salvarLista(novaLista);
      return novaLista;
    });
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + produto.quantidade * produto.valor, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={novoProduto}
          onChangeText={setNovoProduto}
        />
        <Button title="+" onPress={adicionarProduto} color="#2D6A4F" />
      </View>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Checkbox
              status={item.marcado ? 'checked' : 'unchecked'} // Usar status para alternar entre marcado e desmarcado
              onPress={() => alternarMarcacao(item.id)} // Alterar o estado de 'marcado' ao pressionar
              color="#2D6A4F" // Cor do checkbox
              uncheckedColor="#A98467" // Cor do checkbox desmarcado
            />
            <Text style={styles.itemText}>{item.nome}</Text>
            <View style={styles.quantidadeContainer}>
              <TouchableOpacity onPress={() => alterarQuantidade(item.id, -1)}>
                <Text style={styles.quantidadeButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantidadeText}>{item.quantidade}</Text>
              <TouchableOpacity onPress={() => alterarQuantidade(item.id, 1)}>
                <Text style={styles.quantidadeButton}>+</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.valorInput}
              keyboardType="numeric"
              value={String(item.valor).replace('.', ',')}
              onChangeText={(valor) => alterarValor(item.id, valor)}
            />
            <TouchableOpacity onPress={() => setProdutos(produtos.filter(p => p.id !== item.id))}>
              <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {calcularTotal().replace('.', ',')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEC1',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A98467',
    backgroundColor: '#FFF3DA',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3DA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A98467',
  },
  itemText: {
    flex: 2,
    fontSize: 16,
    color: '#6C584C',
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantidadeButton: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: '#2D6A4F',
  },
  quantidadeText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#6C584C',
  },
  valorInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#A98467',
    textAlign: 'center',
    backgroundColor: '#FFF',
    marginLeft: 10,
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10,
  },
  totalContainer: {
    padding: 15,
    backgroundColor: '#A98467',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ListaScreen;
