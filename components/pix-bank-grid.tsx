import React from 'react'
import { PixBankCard } from './pix-bank-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface PixBankData {
  bank_num: string
  bank_image_url: string
  f110_date: string
  active_amount: number
  expired_amount: number
  paid_amount: number
  active_count: number
  expired_count: number
  paid_count: number
  total_amount: number
  total_count: number
  active_percent: number
  expired_percent: number
  paid_percent: number
}

interface PixBankGridProps {
  data: PixBankData[]
  loading?: boolean
  error?: string | null
  onViewBankDetails?: (bankData: PixBankData) => void
}

export function PixBankGrid({ 
  data, 
  loading = false, 
  error = null, 
  onViewBankDetails 
}: PixBankGridProps) {
  
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum dado encontrado para o período selecionado.
        </AlertDescription>
      </Alert>
    )
  }

  // Agrupar dados por banco e data
  const groupedData = data.reduce((acc, item) => {
    const key = `${item.bank_num}-${item.f110_date}`
    if (!acc[key]) {
      acc[key] = item
    }
    return acc
  }, {} as Record<string, PixBankData>)

  const groupedArray = Object.values(groupedData)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupedArray.map((bankData, index) => (
          <PixBankCard
            key={`${bankData.bank_num}-${bankData.f110_date}-${index}`}
            bankData={bankData}
            onViewDetails={() => onViewBankDetails?.(bankData)}
          />
        ))}
      </div>
      
      {groupedArray.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nenhum dado encontrado</h3>
          <p>Não foram encontrados dados para os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}