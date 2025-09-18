import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PixBankListSkeleton } from '@/components/pix-skeleton'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Building2,
  ChevronRight
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

interface PixBankListProps {
  data: PixBankData[]
  loading?: boolean
  error?: string | null
  isGrouped?: boolean
  onViewBankDetails?: (bankData: PixBankData) => void
}

export function PixBankList({ 
  data, 
  loading = false, 
  error = null, 
  isGrouped = false,
  onViewBankDetails 
}: PixBankListProps) {

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
    const bankLogos: { [key: string]: string } = {
      '033': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg',
      '077': 'https://www.bancointer.com.br/images/inter-logo.svg',
      '341': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Logo_Itau_2016.svg',
      '237': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bradesco_logo.svg',
      '104': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Caixa_Econ%C3%B4mica_Federal_logo.svg',
      '001': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Banco_do_Brasil_Logo.svg'
    }
    
    return bankLogos[bankNum] || data[0]?.bank_image_url?.replace(/\\\//g, '/') || ''
  }

  if (loading) {
    return <PixBankListSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <XCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Erro ao carregar dados: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado encontrado para o período selecionado.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>{isGrouped ? 'Dados Consolidados por Banco' : 'Dados por Banco e Data'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((bankData, index) => (
            <div
              key={`${bankData.bank_num}-${bankData.f110_date}-${index}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewBankDetails?.(bankData)}
            >
              {/* Layout Desktop */}
              <div className="hidden md:flex items-center justify-between">
                {/* Logo e Info do Banco - Largura fixa */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className={`relative w-10 h-10 rounded-lg overflow-hidden ${getBankColor(bankData.bank_num)} flex items-center justify-center flex-shrink-0`}>
                    <Image
                      src={getBankLogo(bankData.bank_num)}
                      alt={getBankName(bankData.bank_num)}
                      fill
                      className="object-contain p-1 bg-white/90 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{getBankName(bankData.bank_num)}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {isGrouped ? 'Dados Consolidados' : formatDate(bankData.f110_date)}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs flex-shrink-0">
                        {bankData.bank_num}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Valor Total - Largura fixa */}
                <div className="text-right w-32 flex-shrink-0">
                  <div className="font-bold text-lg">
                    {formatCurrency(bankData.total_amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {bankData.total_count} transações
                  </div>
                </div>

                {/* Status compacto - Largura fixa */}
                <div className="flex items-center space-x-4 text-sm w-48 flex-shrink-0 justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.active_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Ativo</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-blue-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.paid_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Pago</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.expired_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Expirado</div>
                  </div>
                </div>

                {/* Seta para detalhes - Largura fixa */}
                <div className="w-6 flex-shrink-0 flex justify-center">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Layout Mobile */}
              <div className="md:hidden space-y-3">
                {/* Header com logo e nome do banco */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`relative w-8 h-8 rounded-lg overflow-hidden ${getBankColor(bankData.bank_num)} flex items-center justify-center flex-shrink-0`}>
                      <Image
                        src={getBankLogo(bankData.bank_num)}
                        alt={getBankName(bankData.bank_num)}
                        fill
                        className="object-contain p-1 bg-white/90 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm">{getBankName(bankData.bank_num)}</div>
                      <Badge variant="outline" className="text-xs">
                        {bankData.bank_num}
                      </Badge>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>

                {/* Valor total em destaque */}
                <div className="text-center py-2 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">
                    {formatCurrency(bankData.total_amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {bankData.total_count} transações
                  </div>
                  {!isGrouped && (
                    <div className="text-xs text-muted-foreground flex items-center justify-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(bankData.f110_date)}
                    </div>
                  )}
                </div>

                {/* Status em linha */}
                <div className="flex justify-between text-sm">
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.active_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Ativo</div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center text-blue-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.paid_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Pago</div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span className="font-medium">{bankData.expired_count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Expirado</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}