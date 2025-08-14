import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CupomTable from "@/components/CupomTable";
import FilterBar, { FilterState } from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import Pagination from "@/components/Pagination";
import { useCompras } from "@/hooks/useCompras";
import { FileText, Loader2 } from "lucide-react";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: "",
    estado: "",
    cupom: "",
    loja: "",
    dataInicio: "",
    dataFim: ""
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isFetching } = useCompras(filters, currentPage);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="border-0 shadow-medium bg-gradient-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Sistema de Gestão de Cupons
                </CardTitle>
                <p className="text-white/80 text-lg">
                  Acompanhe e gerencie todos os cupons dos seus clientes
                </p>
              </div>
              {isFetching && (
                <div className="ml-auto">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <StatsCards compras={data?.compras || []} />

        {/* Filters */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Table */}
        <CupomTable 
          compras={data?.compras || []} 
          isLoading={isLoading}
          error={error}
        />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading || isFetching}
          />
        )}

        {/* Results info */}
        {data && (
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {data.compras.length} de {data.total} compras
            {data.totalPages > 1 && ` (Página ${currentPage} de ${data.totalPages})`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;