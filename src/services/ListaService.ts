import AsyncStorage from '@react-native-async-storage/async-storage';
import Produto from '../types/Produto';

// Definição do tipo Lista
export interface Lista {
  id: string;
  nome: string;
  dataCriacao: Date;
  produtos: Produto[];
}

export const salvarListas = async (listas: Lista[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('listas', JSON.stringify(listas));
  } catch (error) {
    console.error('Erro ao salvar listas:', error);
  }
};

export const carregarListas = async (): Promise<Lista[]> => {
  try {
    const listasSalvas = await AsyncStorage.getItem('listas');
    if (!listasSalvas) return [];

    const listas: Lista[] = JSON.parse(listasSalvas).map((lista: Lista) => ({
      ...lista,
      dataCriacao: new Date(lista.dataCriacao) // Convertendo string para Date
    }));

    return listas;
  } catch (error) {
    console.error('Erro ao carregar listas:', error);
    return [];
  }
};


// Adicionar uma nova lista com nome
export const adicionarLista = async (nome: string, dataCriacao: Date, produtos: Produto[]): Promise<Lista[]> => {
  const listas = await carregarListas();
  const novaLista: Lista = { id: Date.now().toString(), nome, dataCriacao: new Date(), produtos };
  listas.push(novaLista);
  await salvarListas(listas);
  return listas;
};

export const adicionarProduto = async (listaId: string, produto: Produto): Promise<Lista[]> => {
  const listas = await carregarListas();
  const index = listas.findIndex(lista => lista.id === listaId);

  if (index !== -1) {
    listas[index].produtos.push(produto); // Adicionando o produto na lista
    await salvarListas(listas); // Salvando no AsyncStorage
  }

  return listas;
};

// Remover um produto específico de uma lista
export const removerProduto = async (listaId: string, produtoId: string): Promise<Lista[]> => {
  const listas = await carregarListas();
  const listaIndex = listas.findIndex(lista => lista.id === listaId);

  if (listaIndex !== -1) {
    listas[listaIndex].produtos = listas[listaIndex].produtos.filter(produto => produto.id !== produtoId);
    await salvarListas(listas);
  }

  return listas;
};

export const atualizarQuantidade = async (listaId: string, produtoId: string, incremento: number): Promise<Lista[]> => {
  const listas = await carregarListas();
  const listaIndex = listas.findIndex(lista => lista.id === listaId);

  if (listaIndex !== -1) {
    listas[listaIndex].produtos = listas[listaIndex].produtos.map(produto =>
      produto.id === produtoId
        ? { ...produto, quantidade: Math.max(1, produto.quantidade + incremento) }
        : produto
    );
    await salvarListas(listas);
  }

  return listas;
};

// Remover uma lista específica
export const removerLista = async (listaId: string): Promise<Lista[]> => {
  let listas = await carregarListas();
  listas = listas.filter(lista => lista.id !== listaId);
  await salvarListas(listas);
  return listas;
};

// Limpar todas as listas do armazenamento
export const limparTodasAsListas = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('listas');
  } catch (error) {
    console.error('Erro ao limpar todas as listas:', error);
  }
};
