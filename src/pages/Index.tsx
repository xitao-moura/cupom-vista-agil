import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CupomTable from "@/components/CupomTable";
import FilterBar, { FilterState } from "@/components/FilterBar";
import StatsCards from "@/components/StatsCards";
import { FileText } from "lucide-react";

// Mock data based on the provided structure
const mockCompras = [
  {
    "_id": "683edea0ddfc83de2017f5e9",
    "valor": 1000,
    "loja": {
      "_id": "68307990ddfc83de2017f4d7",
      "nome": "Gasometro Madeiras"
    },
    "cidade": "Sao Paulo",
    "estado": "SP",
    "produtos": [
      {
        "_id": "682f244eddfc83de2017f279",
        "nome": "Duratex"
      }
    ],
    "cupons": [
      {
        "_id": "683edea0ddfc83de2017f5ed",
        "numero": "770854"
      },
      {
        "_id": "683edea0ddfc83de2017f5f0",
        "numero": "865493"
      }
    ],
    "cliente": {
      "_id": "683edea0ddfc83de2017f5e5",
      "nome": "Amanda Sousa",
      "cpf_cnpj": "34567967007",
      "data_nascimento": "1994-07-14T00:00:00.000Z",
      "telefone": "11991362975",
      "email": "amanda.almeida@simnegocios.com.br",
      "cidade": "São Paulo"
    },
    "createdAt": "2025-06-03T11:38:08.903Z",
    "updatedAt": "2025-06-03T11:38:08.938Z",
    "__v": 0
  },
  {
    "_id": "683edea0ddfc83de2017f5f1",
    "valor": 1500,
    "loja": {
      "_id": "68307990ddfc83de2017f4d8",
      "nome": "Construção Total"
    },
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "produtos": [
      {
        "_id": "682f244eddfc83de2017f280",
        "nome": "Tijolo Cerâmico"
      },
      {
        "_id": "682f244eddfc83de2017f281",
        "nome": "Cimento Portland"
      }
    ],
    "cupons": [
      {
        "_id": "683edea0ddfc83de2017f5f2",
        "numero": "456789"
      }
    ],
    "cliente": {
      "_id": "683edea0ddfc83de2017f5e6",
      "nome": "Carlos Silva",
      "cpf_cnpj": "12345678901",
      "data_nascimento": "1985-03-22T00:00:00.000Z",
      "telefone": "21987654321",
      "email": "carlos.silva@email.com",
      "cidade": "Rio de Janeiro"
    },
    "createdAt": "2025-05-28T09:15:30.123Z",
    "updatedAt": "2025-05-28T09:15:30.150Z",
    "__v": 0
  },
  {
    "_id": "683edea0ddfc83de2017f5f3",
    "valor": 800,
    "loja": {
      "_id": "68307990ddfc83de2017f4d9",
      "nome": "Casa & Jardim"
    },
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "produtos": [
      {
        "_id": "682f244eddfc83de2017f282",
        "nome": "Tinta Acrílica"
      }
    ],
    "cupons": [
      {
        "_id": "683edea0ddfc83de2017f5f4",
        "numero": "123456"
      },
      {
        "_id": "683edea0ddfc83de2017f5f5",
        "numero": "789012"
      },
      {
        "_id": "683edea0ddfc83de2017f5f6",
        "numero": "345678"
      }
    ],
    "cliente": {
      "_id": "683edea0ddfc83de2017f5e7",
      "nome": "Maria Santos",
      "cpf_cnpj": "98765432100",
      "data_nascimento": "1990-12-10T00:00:00.000Z",
      "telefone": "31999888777",
      "email": "maria.santos@email.com",
      "cidade": "Belo Horizonte"
    },
    "createdAt": "2025-06-01T14:22:15.456Z",
    "updatedAt": "2025-06-01T14:22:15.480Z",
    "__v": 0
  }
];

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: "",
    estado: "",
    cupom: "",
    loja: "",
    dataInicio: "",
    dataFim: ""
  });

  const filteredCompras = useMemo(() => {
    return mockCompras.filter(compra => {
      // Filter by cidade
      if (filters.cidade && !compra.cidade.toLowerCase().includes(filters.cidade.toLowerCase())) {
        return false;
      }

      // Filter by estado
      if (filters.estado && !compra.estado.toLowerCase().includes(filters.estado.toLowerCase())) {
        return false;
      }

      // Filter by cupom
      if (filters.cupom && !compra.cupons.some(cupom => 
        cupom.numero.toLowerCase().includes(filters.cupom.toLowerCase())
      )) {
        return false;
      }

      // Filter by loja
      if (filters.loja && !compra.loja.nome.toLowerCase().includes(filters.loja.toLowerCase())) {
        return false;
      }

      // Filter by date range
      const compraDate = new Date(compra.createdAt);
      if (filters.dataInicio) {
        const startDate = new Date(filters.dataInicio);
        if (compraDate < startDate) return false;
      }
      if (filters.dataFim) {
        const endDate = new Date(filters.dataFim);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (compraDate > endDate) return false;
      }

      return true;
    });
  }, [filters]);

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
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <StatsCards compras={filteredCompras} />

        {/* Filters */}
        <FilterBar onFilterChange={setFilters} />

        {/* Table */}
        <CupomTable compras={filteredCompras} />
      </div>
    </div>
  );
};

export default Index;