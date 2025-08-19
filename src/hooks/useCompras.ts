import { useQuery } from "@tanstack/react-query";
import { FilterState } from "@/components/FilterBar";

interface ApiResponse {
  compras: Compra[];
  total: number;
  page: number;
  totalPages: number;
}

interface Compra {
  _id: string;
  valor: number;
  loja: {
    _id: string;
    nome: string;
  };
  cidade: string;
  estado: string;
  produtos: Array<{
    _id: string;
    nome: string;
  }>;
  cupons: Array<{
    _id: string;
    numero: string;
  }>;
  cliente: {
    _id: string;
    nome: string;
    cpf_cnpj: string;
    data_nascimento: string;
    telefone: string;
    email: string;
    cidade: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const buildQueryString = (filters: FilterState, page: number) => {
  const params = new URLSearchParams();
  
  params.append('page', page.toString());
  
  if (filters.cidade) params.append('cidade', filters.cidade);
  if (filters.estado) params.append('estado', filters.estado);
  if (filters.cupom) params.append('cupom', filters.cupom);
  if (filters.loja) params.append('loja', filters.loja);
  if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
  if (filters.dataFim) params.append('dataFim', filters.dataFim);
  
  return params.toString();
};

const fetchCompras = async (filters: FilterState, page: number): Promise<ApiResponse> => {
  const queryString = buildQueryString(filters, page);
  // const url = `https://api.geradorcupom.gnis.com.br/v1/compras?${queryString}`;
  const url = `http://201.54.15.150:3000/v1/compras?${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar compras: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Se a API não retorna os metadados de paginação, vamos calcular baseado nos dados
  return {
    compras: data.compras || data, // Suporte para diferentes formatos de resposta
    total: data.total || data.length,
    page: data.page || page,
    totalPages: data.totalPages || Math.ceil((data.total || data.length) / 20)
  };
};

export const useCompras = (filters: FilterState, page: number) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ['compras', filters, page],
    queryFn: () => fetchCompras(filters, page),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export type { Compra, ApiResponse };