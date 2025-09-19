'use client'

import { PixTransactionsList } from '@/components/pix-transactions-list'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { PixPageSkeleton } from '@/components/pix-skeleton'
import Link from 'next/link'

function TransacoesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const bankNum = searchParams.get('bank_num')
  const bankName = searchParams.get('bank_name')
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  const isGrouped = searchParams.get('is_grouped') === 'true'

  if (!bankNum || !bankName) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Parâmetros inválidos</h1>
          <p className="text-muted-foreground mt-2">
            Banco ou nome não informado. Volte à página anterior.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Link
          href="/cobranca/pix"
          className="hover:text-foreground transition-colors"
        >
          PIX
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          Transações - {bankName} {isGrouped ? '(Agrupado)' : ''}
        </span>
      </nav>

      {/* Botão voltar */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/cobranca/pix')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para PIX
        </Button>
      </div>

      <PixTransactionsList
        bankNum={bankNum}
        bankName={bankName}
        dateFrom={dateFrom || undefined}
        dateTo={dateTo || undefined}
        isGrouped={isGrouped}
      />
    </div>
  )
}

export default function TransacoesPage() {
  return (
    <Suspense fallback={<PixPageSkeleton />}>
      <TransacoesContent />
    </Suspense>
  )
}