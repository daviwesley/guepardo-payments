'use client'

import { PixHistoryLog } from '@/hooks/usePixHistory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Activity
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PixHistoryListProps {
  data: PixHistoryLog[]
  loading: boolean
  error: string | null
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case 'info':
      return <Activity className="h-4 w-4 text-blue-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const formatDateTime = (dateString: string) => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd/MM/yyyy às HH:mm:ss', { locale: ptBR })
  } catch {
    return dateString
  }
}

export function PixHistoryList({ data, loading, error }: PixHistoryListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Erro ao carregar histórico
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum histórico encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há logs de histórico disponíveis para esta cobrança PIX.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Histórico de Atividades
        </h3>
        <Badge variant="outline">
          {data.length} {data.length === 1 ? 'evento' : 'eventos'}
        </Badge>
      </div>

      <div className="space-y-3 w-full max-w-full overflow-hidden">
        {data.map((log, index) => (
          <Card key={log.id} className="transition-all hover:shadow-md overflow-hidden w-full max-w-full">
            <CardContent className="p-4 w-full max-w-full overflow-hidden">
              <div className="flex items-start gap-3">
                {/* Ícone de status */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(log.status)}
                </div>
                
                {/* Conteúdo principal */}
                <div 
                  className="flex-1 min-w-0"
                  style={{
                    maxWidth: 'calc(100% - 2rem)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-sm leading-5"
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {log.title}
                      </h4>
                      <p 
                        className="text-sm text-muted-foreground mt-1"
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto',
                          maxWidth: '100%'
                        }}
                      >
                        {log.desc}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Metadados */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{formatDateTime(log.date_time)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{log.username}</span>
                    </span>
                    <span className="hidden sm:inline truncate">
                      {log.method}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}