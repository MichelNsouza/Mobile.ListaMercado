import Produto from "./Produto";

export interface Lista {
  id: string;
  nome: string;
  dataCriacao: Date;
  produtos: Produto[];
}