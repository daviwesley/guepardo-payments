import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PixBankCardSkeleton } from '@/components/pix-skeleton'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Building2 
} from 'lucide-react'
import Image from 'next/image'

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

interface PixBankCardProps {
  bankData: PixBankData
  onViewDetails?: () => void
}

export function PixBankCard({ bankData, onViewDetails }: PixBankCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getBankName = (bankNum: string) => {
    const bankNames: { [key: string]: string } = {
      '033': 'Banco Santander S.A.',
      '077': 'Banco Inter S.A.',
      '341': 'Itaú Unibanco S.A.',
      '237': 'Banco Bradesco S.A.',
      '104': 'Caixa Econômica Federal',
      '001': 'Banco do Brasil S.A.'
    }
    return bankNames[bankNum] || `Banco ${bankNum}`
  }

  const getBankColor = (bankNum: string) => {
    const bankColors: { [key: string]: string } = {
      '033': 'bg-red-600',    // Santander - Vermelho
      '077': 'bg-orange-500', // Inter - Laranja
      '341': 'bg-blue-600',   // Itaú - Azul
      '237': 'bg-red-600',    // Bradesco - Vermelho
      '104': 'bg-blue-800',   // Caixa - Azul escuro
      '001': 'bg-yellow-500'  // Banco do Brasil - Amarelo
    }
    return bankColors[bankNum] || 'bg-gray-400'
  }

  const getBankLogo = (bankNum: string) => {
    // URLs mais confiáveis para logos dos bancos
    const bankLogos: { [key: string]: string } = {
      '033': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg',
      '077': 'https://www.bancointer.com.br/images/inter-logo.svg',
      '341': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Logo_Itau_2016.svg',
      '237': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bradesco_logo.svg',
      '104': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Caixa_Econ%C3%B4mica_Federal_logo.svg',
      '001': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Banco_do_Brasil_Logo.svg'
    }
    
    // Se não encontrar o logo específico, tenta usar a URL da API (corrigida)
    return bankLogos[bankNum] || bankData.bank_image_url.replace(/\\\//g, '/')
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`relative w-12 h-12 rounded-lg overflow-hidden ${getBankColor(bankData.bank_num)} flex items-center justify-center`}>
              <Image
                src={getBankLogo(bankData.bank_num)}
                alt={getBankName(bankData.bank_num)}
                fill
                className="object-contain p-1 bg-white/90 rounded-lg"
                onError={(e) => {
                  // Remove a imagem e mostra apenas o ícone de banco
                  e.currentTarget.style.display = 'none'
                }}
              />
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{getBankName(bankData.bank_num)}</CardTitle>
              <p className="text-sm text-muted-foreground">
                <Calendar className="inline w-4 h-4 mr-1" />
                {formatDate(bankData.f110_date)}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Building2 className="w-3 h-3 mr-1" />
            {bankData.bank_num}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Valor Total */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Total</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(bankData.total_amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                {bankData.total_count} transações
              </div>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Ativo */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm font-medium text-green-600">Ativo</div>
            <div className="text-lg font-bold text-green-700">
              {formatCurrency(bankData.active_amount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {bankData.active_count} ({bankData.active_percent.toFixed(0)}%)
            </div>
          </div>

          {/* Pago */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-blue-600">Pago</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(bankData.paid_amount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {bankData.paid_count} ({bankData.paid_percent.toFixed(0)}%)
            </div>
          </div>

          {/* Expirado */}
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex justify-center mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-sm font-medium text-red-600">Expirado</div>
            <div className="text-lg font-bold text-red-700">
              {formatCurrency(bankData.expired_amount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {bankData.expired_count} ({bankData.expired_percent.toFixed(0)}%)
            </div>
          </div>
        </div>

        {/* Botão de detalhes */}
        {onViewDetails && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={onViewDetails}
          >
            Ver Detalhes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}