'use client'

import { usePixDetails } from '@/hooks/usePixDetails'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PixDetailsSkeleton } from '@/components/pix-skeleton'
import Link from 'next/link'
import { PixDetailsCard, DetailedInfoDialog } from '@/components/pix-details-card'

interface PixDetailPageProps {
  params: {
    pix_id: string
  }
}

export default function PixDetailPage({ params }: PixDetailPageProps) {
  const router = useRouter()
  const { details, loading, error, refetch } = usePixDetails(params.pix_id)

  if (loading) {
    return <PixDetailsSkeleton />
  }

  if (error) {
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
            Detalhes
          </span>
        </nav>

        {/* Botão voltar */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para PIX
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Erro ao carregar detalhes</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            onClick={refetch}
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!details) {
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
            Detalhes
          </span>
        </nav>

        {/* Botão voltar */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para PIX
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">PIX não encontrado</h1>
          <p className="text-muted-foreground mt-2">
            Não foi possível encontrar os detalhes para este PIX.
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
          Detalhes - {details.customer_name}
        </span>
      </nav>

      {/* Botão voltar */}
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para PIX
        </Button>
        
        <DetailedInfoDialog details={details} />
      </div>
      
      {/* Detalhes do PIX */}
      <PixDetailsCard details={details} />
    </div>
  )
}