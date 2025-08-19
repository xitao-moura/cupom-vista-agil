import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CupomTable from "@/components/CupomTable";
import FilterBar, { FilterState } from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useCompras } from "@/hooks/useCompras";

// Importe o modal que vamos criar
import DownloadModal from "@/components/DownloadModal";

const Index = () => {
  // Estado real usado na pesquisa
  const [filters, setFilters] = useState<FilterState>({
    cidade: "",
    estado: "",
    cupom: "",
    loja: "",
    dataInicio: "",
    dataFim: ""
  });

  // Estado temporário para digitação
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);

  // Paginação
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Listas para os selects
  const [lojas, setLojas] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);

  // Hook de dados principais
  const { data, isLoading, error, isFetching } = useCompras(filters, currentPage);

  // Sincroniza página na URL
  useEffect(() => {
    setSearchParams({ page: String(currentPage) });
  }, [currentPage, setSearchParams]);

  // Buscar lojas e estados no carregamento
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch("http://201.54.15.150:3000/v1/lojas");
        const json = await res.json();
        setLojas(json || []);
      } catch (err) {
        console.error("Erro ao carregar lojas", err);
      }
    };

    const fetchEstados = async () => {
      try {
        const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        const json = await res.json();
        const sorted = json.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setEstados(sorted);
      } catch (err) {
        console.error("Erro ao carregar estados", err);
      }
    };

    fetchLojas();
    fetchEstados();
  }, []);

  // Buscar cidades quando o estado mudar
  useEffect(() => {
    if (!pendingFilters.estado) {
      setCidades([]);
      return;
    }

    const fetchCidades = async () => {
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${pendingFilters.estado}/municipios`);
        const json = await res.json();
        const sorted = json.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setCidades(sorted);
      } catch (err) {
        console.error("Erro ao carregar cidades", err);
      }
    };

    fetchCidades();
  }, [pendingFilters.estado]);

  // Pesquisa
  const handleSearch = () => {
    setFilters(pendingFilters);
    setCurrentPage(1);
  };

  // Paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Exportação Excel
  // Exportação Excel
  const handleExport = async () => {
      setIsExporting(true); // Inicia o estado de exportação
      try {
        // 1. Construir a URL com os filtros
        // A biblioteca URLSearchParams facilita a construção da query string
        const params = new URLSearchParams();
        if (filters.cidade) params.append('cidade', filters.cidade);
        if (filters.estado) params.append('estado', filters.estado);
        if (filters.cupom) params.append('cupom', filters.cupom);
        if (filters.loja) params.append('loja', filters.loja);
        if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
        if (filters.dataFim) params.append('dataFim', filters.dataFim);

        const url = `http://201.54.15.150:3000/v1/compras/export?${params.toString()}`;

        // 2. Fazer a requisição GET
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const json = await res.json();

        if (json?.urls && json.urls.length > 0) {
          setDownloadUrls(json.urls);
          setIsModalOpen(true);
        } else {
          alert("Não foi possível exportar o arquivo. Nenhum dado encontrado.");
        }
      } catch (err) {
        console.error("Erro ao exportar:", err);
        alert("Ocorreu um erro ao exportar o arquivo.");
      } finally {
        setIsExporting(false); // Finaliza o estado de exportação
      }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-8">

        {(isLoading || isFetching) ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-3 text-primary font-medium">Carregando...</span>
          </div>
        ) : (
          <>
            {/* Filtros */}
            <FilterBar
              onFilterChange={(newFilters) => setPendingFilters(newFilters)}
              lojas={lojas}
              estados={estados}
              cidades={cidades}
            />

            {/* Botões */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Pesquisar
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isExporting} // Desabilita o botão enquanto a exportação estiver em andamento
              >
                {isExporting ? "Exportando..." : "Exportar Excel"}
              </button>
            </div>

            {/* Tabela */}
            <CupomTable
              compras={data?.compras || []}
              isLoading={isLoading}
              error={error}
            />

            {/* Paginação */}
            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading || isFetching}
              />
            )}

            {/* Info */}
            {data && (
              <div className="text-center text-sm text-muted-foreground">
                Mostrando {data.compras.length} de {data.total} cupons
                {data.totalPages > 1 && ` (Página ${currentPage} de ${data.totalPages})`}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Download */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        urls={downloadUrls}
      />
    </div>
  );
};

export default Index;