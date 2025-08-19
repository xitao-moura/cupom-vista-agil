import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Users, Store, DollarSign } from "lucide-react";

interface Compra {
  _id: string;
  valor: number;
  loja: { _id: string; nome: string };
  cidade: string;
  estado: string;
  produtos: Array<{ _id: string; nome: string }>;
  cupons: Array<{ _id: string; numero: string }>;
  cliente: { _id: string; nome: string; cpf_cnpj: string; data_nascimento: string; telefone: string; email: string; cidade: string };
  createdAt: string;
  updatedAt: string;
}

interface StatsCardsProps {
  compras: Compra[];
}

const StatsCards = ({ compras }: any) => {
  console.log(compras)
  // const totalCupons = compras.reduce((acc, compra) => acc + compra.cupons.length, 0);
  // const clientesUnicos = new Set(compras.map(compra => compra.cliente._id)).size;
  // const lojasUnicas = new Set(compras.map(compra => compra.loja._id)).size;
  // const valorTotal = compras.reduce((acc, compra) => acc + compra.valor, 0);
  const totalCupons = compras.stats.totalCupons
  const clientesUnicos = compras.stats.quantidadeClientesUnicos
  const lojasUnicas = compras.stats.quantidadeLojas
  const valorTotal = compras.stats.valorTotal

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const stats = [
    {
      title: "Total de Cupons",
      value: totalCupons.toLocaleString('pt-BR'),
      icon: Receipt,
      gradient: "from-primary to-accent"
    },
    {
      title: "Clientes Únicos",
      value: clientesUnicos.toLocaleString('pt-BR'),
      icon: Users,
      gradient: "from-accent to-primary"
    },
    {
      title: "Lojas Ativas",
      value: lojasUnicas.toLocaleString('pt-BR'),
      icon: Store,
      gradient: "from-primary/80 to-accent/80"
    },
    {
      title: "Valor Total",
      value: formatCurrency(valorTotal),
      icon: DollarSign,
      gradient: "from-accent/90 to-primary/90"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;