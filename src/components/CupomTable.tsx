import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Cliente {
  _id: string;
  nome: string;
  cpf_cnpj: string;
  data_nascimento: string;
  telefone: string;
  email: string;
  cidade: string;
}

interface Loja {
  _id: string;
  nome: string;
}

interface Produto {
  _id: string;
  nome: string;
}

interface Cupom {
  _id: string;
  numero: string;
}

interface Compra {
  _id: string;
  valor: number;
  loja: Loja;
  cidade: string;
  estado: string;
  produtos: Produto[];
  cupons: Cupom[];
  cliente: Cliente;
  createdAt: string;
  updatedAt: string;
}

interface CupomRow {
  compraId: string;
  cliente: Cliente;
  loja: Loja;
  cidade: string;
  estado: string;
  produtos: Produto[];
  cupom: Cupom;
  valor: number;
  data: string;
}

interface CupomTableProps {
  compras: Compra[];
  isLoading?: boolean;
  error?: Error | null;
}

const CupomTable = ({ compras, isLoading, error }: CupomTableProps) => {
  // Transform data to show one row per coupon
  const cupomRows: CupomRow[] = compras.flatMap(compra => 
    compra.cupons.map(cupom => ({
      compraId: compra._id,
      cliente: compra.cliente,
      loja: compra.loja,
      cidade: compra.cidade,
      estado: compra.estado,
      produtos: compra.produtos,
      cupom,
      valor: compra.valor,
      data: compra.createdAt
    }))
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCpfCnpj = (cpfCnpj: string) => {
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  return (
    <Card className="shadow-medium border-0 bg-gradient-subtle">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Lista de Cupons
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar os dados: {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="font-semibold">Cupom</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">CPF/CNPJ</TableHead>
                <TableHead className="font-semibold">Telefone</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Loja</TableHead>
                <TableHead className="font-semibold">Cidade</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Produtos</TableHead>
                <TableHead className="font-semibold">Valor</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 11 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : cupomRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Nenhum cupom encontrado
                  </TableCell>
                </TableRow>
              ) : (
                cupomRows.map((row, index) => (
                  <TableRow 
                    key={`${row.compraId}-${row.cupom._id}`}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {row.cupom.numero}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{row.cliente.nome}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatCpfCnpj(row.cliente.cpf_cnpj)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{row.cliente.telefone}</TableCell>
                    <TableCell className="text-sm">{row.cliente.email}</TableCell>
                    <TableCell className="font-medium">{row.loja.nome}</TableCell>
                    <TableCell>{row.cidade}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.produtos.map(produto => (
                          <Badge key={produto._id} variant="outline" className="text-xs">
                            {produto.nome}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-accent">
                      {formatCurrency(row.valor)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(row.data)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CupomTable;