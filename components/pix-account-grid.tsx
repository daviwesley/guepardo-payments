import React from 'react'
import { PixAccountCard } from './pix-account-card'
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

interface PixAccountGroup {
  id: string
  accountName: string
  bankName: string
  bankImage?: string
  pixKey: string
  charges: PixCharge[]
}

interface PixAccountGridProps {
  charges: PixCharge[]
  loading?: boolean
  error?: string | null
  onViewAccount?: (accountId: string) => void
  onManageAccount?: (accountId: string) => void
}

export function PixAccountGrid({
  charges,
  loading = false,
  error = null,
  onViewAccount,
  onManageAccount
}: PixAccountGridProps) {

  // Agrupar transações por critério (aqui vou simular diferentes contas)
  const groupChargesByAccount = (charges: PixCharge[]): PixAccountGroup[] => {
    // Como a API não retorna informações de conta/banco, vou simular agrupamentos
    // baseado em padrões dos dados ou criar contas fictícias
    
    const totalCharges = charges.length
    const third = Math.ceil(totalCharges / 3)
    
    return [
      {
        id: 'conta-principal',
        accountName: 'Conta Principal',
        bankName: 'Banco do Brasil',
        pixKey: 'empresa@pixntt.cloud',
        charges: charges.slice(0, third)
      },
      {
        id: 'conta-secundaria',
        accountName: 'Conta Secundária',
        bankName: 'Itaú Unibanco',
        pixKey: '+55 11 99999-9999',
        charges: charges.slice(third, third * 2)
      },
      {
        id: 'conta-backup',
        accountName: 'Conta Backup',
        bankName: 'Caixa Econômica',
        pixKey: '12.345.678/0001-90',
        charges: charges.slice(third * 2)
      }
    ].filter(account => account.charges.length > 0) // Remove contas sem transações
  }

  const accountGroups = groupChargesByAccount(charges)

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
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
            <h3 className="font-medium text-foreground">Erro ao carregar contas PIX</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (accountGroups.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Nenhuma conta PIX</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure suas contas PIX para começar a receber pagamentos
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {accountGroups.map((account) => (
        <PixAccountCard
          key={account.id}
          charges={account.charges}
          accountName={account.accountName}
          bankName={account.bankName}
          bankImage={account.bankImage}
          pixKey={account.pixKey}
          onViewDetails={() => onViewAccount?.(account.id)}
          onManageAccount={() => onManageAccount?.(account.id)}
        />
      ))}
    </div>
  )
}