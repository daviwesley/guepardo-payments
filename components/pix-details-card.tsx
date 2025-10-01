import { PixDetails } from '@/types/pix-details'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePixHistory } from '@/hooks/usePixHistory'
import { PixHistoryList } from '@/components/pix-history-list'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Hash,
  Building,
  FileText,
  Clock,
  AlertCircle,
  Copy,
  Info,
  Activity,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

interface PixDetailsCardProps {
  details: PixDetails
}

interface DetailedInfoDialogProps {
  details: PixDetails
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return dateString
  }
}

const formatDateTime = (dateString: string) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy às HH:mm', { locale: ptBR })
  } catch {
    return dateString
  }
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ATIVA':
    case 'ATIVO':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
    case 'PAGO':
    case 'CONCLUIDA':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
    case 'CANCELADO':
    case 'CANCELADA':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
    case 'REJEITADO':
    case 'REJEITADA':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
    case 'EXPIRADO':
    case 'EXPIRADA':
      return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
  }
}

const getBankName = (bankNum: string) => {
  const bankMap: Record<string, string> = {
    '001': 'Banco do Brasil',
    '033': 'Banco Santander',
    '104': 'Caixa Econômica Federal',
    '237': 'Banco Bradesco',
    '341': 'Banco Itaú',
    '356': 'Banco Real',
    '399': 'HSBC Bank Brasil',
    '422': 'Banco Safra',
    '655': 'Banco Votorantim',
    '745': 'Banco Citibank'
  }
  return bankMap[bankNum] || `Banco ${bankNum}`
}

// Componente separado para o Dialog de informações detalhadas
export function DetailedInfoDialog({ details }: DetailedInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Ver Informações Detalhadas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações Detalhadas
          </DialogTitle>
          <DialogDescription>
            Informações técnicas e contábeis do PIX
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {/* Datas */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Datas e Prazos
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Criação:</span>
                <p>{formatDateTime(details.date_time)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vencimento:</span>
                <p>{formatDate(details.due_date)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data F110:</span>
                <p>{formatDate(details.f110_date)}</p>
              </div>
            </div>
          </div>

          {/* Dados Contábeis */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Dados Contábeis
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Doc. Contábil:</span>
                <p>{details.accounting_doc}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ano:</span>
                <p>{details.accounting_doc_year}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Empresa:</span>
                <p>{details.company_code}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Lote:</span>
                <p>{details.batch}</p>
              </div>
            </div>
          </div>

          {/* Outros */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Outras Informações
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Texto Cobrança:</span>
                <p>{details.charge_text}</p>
              </div>
              <div>
                <span className="text-muted-foreground">NF:</span>
                <p>{details.nf_number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo Pagamento:</span>
                <p>{details.payment_type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Enviar Email:</span>
                <p>{details.send_email === 'X' ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PixDetailsCard({ details }: PixDetailsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Hook para buscar histórico
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = usePixHistory(details.pix_id)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} copiado para área de transferência`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Erro ao copiar texto')
    }
  }

  return (
    <Tabs defaultValue="status" className="w-full max-w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="status" className="text-xs sm:text-sm">
          Status & QR Code
        </TabsTrigger>
        <TabsTrigger value="customer" className="text-xs sm:text-sm">
          Cliente
        </TabsTrigger>
        <TabsTrigger value="banking" className="text-xs sm:text-sm">
          Bancários
        </TabsTrigger>
        <TabsTrigger value="history" className="text-xs sm:text-sm">
          Histórico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="status" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Status e Valores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Grid de duas colunas: Status/Valores à esquerda, QR Code à direita */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Coluna esquerda: Status e Valores */}
              <div className="space-y-4">
                {/* Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={getStatusColor(details.status)}>
                      {details.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status QR Code:
                    </span>
                    <Badge className={getStatusColor(details.status_qrcode)}>
                      {details.status_qrcode}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Valores */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Valor Original:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(details.original_value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Valor Final:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(details.value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Desconto:
                    </span>
                    <span className="text-blue-600">
                      {formatCurrency(details.discount_value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Multa:
                    </span>
                    <span className="text-red-600">
                      {formatCurrency(details.multa)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Juros:
                    </span>
                    <span className="text-red-600">
                      {formatCurrency(details.juros)}
                    </span>
                  </div>
                </div>

                {/* Observação */}
                {details.note && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Observação:</span>
                        <p className="text-sm text-muted-foreground">
                          {details.note}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Coluna direita: QR Code */}
              <div className="flex flex-col items-center justify-start space-y-4">
                {details.qr_code?.imagemQrcode ? (
                  <>
                    <h4 className="font-medium text-center">QR Code PIX</h4>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-white p-3 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                            <img
                              src={details.qr_code.imagemQrcode}
                              alt="QR Code PIX"
                              className="w-40 h-40 lg:w-48 lg:h-48"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="max-w-xs p-4"
                          sideOffset={10}
                        >
                          <div className="space-y-3">
                            <p className="text-sm font-medium">Código PIX:</p>
                            <div className="bg-muted p-2 rounded text-xs font-mono break-all max-h-24 overflow-y-auto">
                              {details.qr_code.qrcode}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  details.qr_code!.qrcode,
                                  'Código PIX'
                                )
                              }
                              className="w-full flex items-center gap-2"
                            >
                              <Copy
                                className={`h-3 w-3 ${copiedField === 'Código PIX' ? 'text-green-600' : ''}`}
                              />
                              Copiar Código PIX
                            </Button>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(details.qr_code!.qrcode, 'Código QR')
                      }
                      className="flex items-center gap-2"
                    >
                      <Copy
                        className={`h-4 w-4 ${copiedField === 'Código QR' ? 'text-green-600' : ''}`}
                      />
                      Copiar QR
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <span className="text-sm">QR Code não disponível</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customer" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Nome:</span>
                <p className="font-medium">{details.customer_name}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <p className="text-sm">{details.customer_juridic_type}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Número Cliente:
                </span>
                <p className="text-sm">{details.customer_number}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">CPF/CNPJ:</span>
                <p className="text-sm">
                  {details.customer_cpf || details.customer_cnpj}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{details.customer_email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {details.customer_phone ||
                    details.customer_cellphone ||
                    'Não informado'}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Endereço:
              </span>
              <div className="text-sm space-y-1 ml-6">
                <p>{details.customer_street}</p>
                <p>{details.customer_district}</p>
                <p>
                  {details.customer_city} - {details.customer_state_code}
                </p>
                <p>{details.customer_zipcode}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="banking" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Dados Bancários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Banco:</span>
                <p className="font-medium">
                  {getBankName(details.bank_num)} ({details.bank_num})
                </p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Agência:</span>
                <p className="text-sm">{details.bank_branch}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Conta:</span>
                <p className="text-sm">{details.bank_account}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">PIX Key:</span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm font-mono break-all flex-1 bg-muted p-2 rounded">
                    {details.pix_key}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(details.pix_key, 'PIX Key')}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <Copy
                      className={`h-4 w-4 ${copiedField === 'PIX Key' ? 'text-green-600' : ''}`}
                    />
                    Copiar
                  </Button>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">PIX ID:</span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm font-mono break-all flex-1 bg-muted p-2 rounded">
                    {details.pix_id}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(details.pix_id, 'PIX ID')}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <Copy
                      className={`h-4 w-4 ${copiedField === 'PIX ID' ? 'text-green-600' : ''}`}
                    />
                    Copiar
                  </Button>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">TXID:</span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm font-mono break-all flex-1 bg-muted p-2 rounded">
                    {details.txid}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(details.txid, 'TXID')}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <Copy
                      className={`h-4 w-4 ${copiedField === 'TXID' ? 'text-green-600' : ''}`}
                    />
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="history"
        className="space-y-4 w-full max-w-full overflow-hidden"
      >
        <PixHistoryList
          data={historyData}
          loading={historyLoading}
          error={historyError}
        />
      </TabsContent>
    </Tabs>
  )
}