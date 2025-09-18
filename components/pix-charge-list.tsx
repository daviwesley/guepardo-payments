import React from 'react'
import { PixChargeCard } from './pix-charge-card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

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

interface PixChargeListProps {
  charges: PixCharge[]
  loading?: boolean
  error?: string | null
  onViewCharge?: (charge: PixCharge) => void
  onCopyId?: (chargeId: string) => void
  emptyMessage?: string
  showSkeleton?: boolean
  skeletonCount?: number
}

export function PixChargeList({
  charges,
  loading = false,
  error = null,
  onViewCharge,
  onCopyId,
  emptyMessage = "Nenhuma transação encontrada",
  showSkeleton = true,
  skeletonCount = 5
}: PixChargeListProps) {
  
  // Função para copiar ID
  const handleCopyId = async (chargeId: string) => {
    try {
      await navigator.clipboard.writeText(chargeId)
      // Aqui você pode adicionar uma notificação de sucesso
      console.log('ID copiado:', chargeId)
    } catch (err) {
      console.error('Erro ao copiar ID:', err)
    }
    
    // Chama callback customizado se fornecido
    if (onCopyId) {
      onCopyId(chargeId)
    }
  }

  // Loading state
  if (loading && showSkeleton) {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-medium text-foreground">Erro ao carregar transações</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && charges.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Nenhuma transação</h3>
            <p className="text-sm text-muted-foreground mt-1">{emptyMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="space-y-4">
      {charges.map((charge) => (
        <PixChargeCard
          key={charge.id}
          charge={charge}
          onView={onViewCharge}
          onCopy={handleCopyId}
        />
      ))}
    </div>
  )
}