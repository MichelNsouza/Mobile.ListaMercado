import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Tipagem para navegação
type RootStackParamList = {
  Lista: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

// Estrutura do produto
type Produto = {
  id: number;
  nome: string;
  quantidade: number;
  categoria?: string;
  valor?: number;
};

const ListaScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState('');

  // Chave para armazenar a lista no AsyncStorage
  const STORAGE_KEY = `lista_${id}`;

  // Carregar produtos do AsyncStorage ao abrir a tela
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

  // Salvar produtos no AsyncStorage sempre que a lista for alterada
  const salvarLista = async (novaLista: Produto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  // Adicionar um produto à lista
  const adicionarProduto = () => {
    if (!novoProduto.trim()) return;

    const novoItem: Produto = {
      id: Date.now(),
      nome: novoProduto,
      quantidade: 1,
      categoria: '',
      valor: 0,
    };

    const novaLista = [...produtos, novoItem];
    setProdutos(novaLista);
    salvarLista(novaLista);
    setNovoProduto('');
  };

  // Alterar quantidade do produto
  const alterarQuantidade = (produtoId: number, delta: number) => {
    const novaLista = produtos.map((produto) =>
      produto.id === produtoId
        ? { ...produto, quantidade: Math.max(1, produto.quantidade + delta) }
        : produto
    );
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  // Excluir um produto da lista
  const excluirProduto = (produtoId: number) => {
    const novaLista = produtos.filter((produto) => produto.id !== produtoId);
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  // Selecionar categoria do produto
  const selecionarCategoria = (produtoId: number, categoria: string) => {
    const novaLista = produtos.map((produto) =>
      produto.id === produtoId ? { ...produto, categoria } : produto
    );
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  // Definir valor do produto
  const definirValor = (produtoId: number, valor: number) => {
    const novaLista = produtos.map((produto) =>
      produto.id === produtoId ? { ...produto, valor } : produto
    );
    setProdutos(novaLista);
    salvarLista(novaLista);
  };

  // Calcular total da lista
  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + (produto.valor || 0) * produto.quantidade, 0);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Lista ID: {id}
      </Text>

      {/* Adicionar Produto */}
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 5, marginRight: 10 }}
          placeholder="Nome do produto"
          value={novoProduto}
          onChangeText={setNovoProduto}
        />
        <Button title="Adicionar" onPress={adicionarProduto} />
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 2 }}>{item.nome}</Text>

            {/* Botões de Quantidade */}
            <TouchableOpacity onPress={() => alterarQuantidade(item.id, -1)}>
              <Text style={{ fontSize: 18, marginHorizontal: 5 }}>➖</Text>
            </TouchableOpacity>
            <Text>{item.quantidade}</Text>
            <TouchableOpacity onPress={() => alterarQuantidade(item.id, 1)}>
              <Text style={{ fontSize: 18, marginHorizontal: 5 }}>➕</Text>
            </TouchableOpacity>

            {/* Seleção de Categoria */}
            <TextInput
              style={{ flex: 2, borderWidth: 1, marginLeft: 10, padding: 5 }}
              placeholder="Categoria"
              value={item.categoria}
              onChangeText={(text) => selecionarCategoria(item.id, text)}
            />

            {/* Definir Valor */}
            <TextInput
              style={{ flex: 1, borderWidth: 1, marginLeft: 10, padding: 5 }}
              placeholder="Valor"
              keyboardType="numeric"
              value={item.valor?.toString() || ''}
              onChangeText={(text) => definirValor(item.id, parseFloat(text) || 0)}
            />

            {/* Botão de Remover */}
            <TouchableOpacity onPress={() => excluirProduto(item.id)}>
              <Text style={{ color: 'red', marginLeft: 10 }}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total da Lista */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        Total: R$ {calcularTotal().toFixed(2)}
      </Text>
    </View>
  );
};

export default ListaScreen;
