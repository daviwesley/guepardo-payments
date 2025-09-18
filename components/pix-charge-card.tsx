import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QrCode, Copy, Eye, Calendar, User, CreditCard, FileText } from 'lucide-react'

interface PixCharge {
  id: string
  amount: number
  status: string
  created_at: string
  paid_at?: string
  description?: string
  customer_name?: string
  customer_document?: string
}

interface PixChargeCardProps {
  charge: PixCharge
  onView?: (charge: PixCharge) => void
  onCopy?: (chargeId: string) => void
}

export function PixChargeCard({ charge, onView, onCopy }: PixChargeCardProps) {
  // Função para formatar valor em Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100) // API retorna em centavos
  }

  // Função para formatar data
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Função para obter status em português
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'expired': 'Expirado',
      'cancelled': 'Cancelado',
      'processing': 'Processando'
    }
    return statusMap[status] || status
  }

  // Função para obter cor do status
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default'
      case 'pending': return 'secondary'
      case 'processing': return 'secondary'
      case 'expired': return 'destructive'
      case 'cancelled': return 'outline'
      default: return 'secondary'
    }
  }

  // Função para formatar documento
  const formatDocument = (document?: string) => {
    if (!document) return null
    
    // CPF: 000.000.000-00
    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    
    // CNPJ: 00.000.000/0000-00
    if (document.length === 14) {
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    
    return document
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm font-medium">
              #{charge.id.slice(-8)}
            </span>
            <Badge variant={getStatusVariant(charge.status)}>
              {getStatusLabel(charge.status)}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {formatCurrency(charge.amount)}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {/* Cliente */}
          {charge.customer_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{charge.customer_name}</span>
              {charge.customer_document && (
                <span className="text-xs">
                  ({formatDocument(charge.customer_document)})
                </span>
              )}
            </div>
          )}

          {/* Descrição */}
          {charge.description && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span className="truncate">{charge.description}</span>
            </div>
          )}

          {/* Data de criação */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Criado: {formatDateTime(charge.created_at)}</span>
          </div>

          {/* Data de pagamento */}
          {charge.paid_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              <span>Pago: {formatDateTime(charge.paid_at)}</span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t">
          {onCopy && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(charge.id)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar ID
            </Button>
          )}
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(charge)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}