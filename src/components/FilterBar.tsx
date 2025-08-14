import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  cidade: string;
  estado: string;
  cupom: string;
  loja: string;
  dataInicio: string;
  dataFim: string;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: "",
    estado: "",
    cupom: "",
    loja: "",
    dataInicio: "",
    dataFim: ""
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      cidade: "",
      estado: "",
      cupom: "",
      loja: "",
      dataInicio: "",
      dataFim: ""
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Filtros</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cidade</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrar por cidade"
                value={filters.cidade}
                onChange={(e) => handleFilterChange("cidade", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Estado</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrar por estado"
                value={filters.estado}
                onChange={(e) => handleFilterChange("estado", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cupom</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Número do cupom"
                value={filters.cupom}
                onChange={(e) => handleFilterChange("cupom", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Loja</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome da loja"
                value={filters.loja}
                onChange={(e) => handleFilterChange("loja", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data Início</label>
            <Input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange("dataInicio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data Fim</label>
            <Input
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange("dataFim", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;