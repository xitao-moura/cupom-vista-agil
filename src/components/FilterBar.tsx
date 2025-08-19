import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  lojas: any[];
  estados: any[];
  cidades: any[];
}

export interface FilterState {
  cidade: string;
  estado: string;
  cupom: string;
  loja: string;
  dataInicio: string;
  dataFim: string;
}

const FilterBar = ({ onFilterChange, lojas, estados, cidades }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: "",
    estado: "",
    cupom: "",
    loja: "",
    dataInicio: "",
    dataFim: ""
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    let newFilters = { ...filters, [key]: value };

    // Resetar cidade se estado mudar
    if (key === "estado") {
      newFilters = { ...newFilters, cidade: "" };
    }

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
          
          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              <option value="">Todos os estados</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Cidade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cidade</label>
            <select
              value={filters.cidade}
              onChange={(e) => handleFilterChange("cidade", e.target.value)}
              disabled={!filters.estado}
              className="w-full border rounded-md px-3 py-2 bg-background disabled:opacity-50"
            >
              <option value="">Todas as cidades</option>
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Cupom */}
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

          {/* Loja */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Loja</label>
            <select
              value={filters.loja}
              onChange={(e) => handleFilterChange("loja", e.target.value)}
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              <option value="">Todas as lojas</option>
              {lojas.map((loja) => (
                <option key={loja._id} value={loja._id}>
                  {loja.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Data início */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data Início</label>
            <Input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange("dataInicio", e.target.value)}
            />
          </div>

          {/* Data fim */}
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
