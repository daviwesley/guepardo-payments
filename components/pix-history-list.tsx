'use client'

import { PixHistoryLog } from '@/hooks/usePixHistory'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Timeline, TimelineItem } from '@/components/timeline'
import { XCircle, Clock, Activity } from 'lucide-react'

interface PixHistoryListProps {
  data: PixHistoryLog[]
  loading: boolean
  error: string | null
}

// Função para converter logs do PIX para itens de timeline
const convertToTimelineItems = (logs: PixHistoryLog[]): TimelineItem[] => {
  return logs.map((log) => ({
    id: log.id,
    timestamp: log.date_time,
    title: log.title,
    description: log.desc,
    status: log.status as 'success' | 'error' | 'warning' | 'info' | 'pending',
    user: log.username || undefined,
  }))
}

export function PixHistoryList({ data, loading, error }: PixHistoryListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative flex">
            {/* Skeleton da linha vertical */}
            {i < 4 && (
              <div className="absolute left-6 top-12 w-0.5 h-full -ml-px bg-gray-200 dark:bg-gray-700" />
            )}

            {/* Skeleton do ícone */}
            <Skeleton className="flex-shrink-0 w-12 h-12 rounded-full" />

            {/* Skeleton do conteúdo */}
            <div className="flex-1 ml-4 pb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>
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

  // Converte os dados para o formato Timeline
  const timelineItems = convertToTimelineItems(data)

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

      {/* Timeline Component */}
      <Timeline items={timelineItems} className="mt-4" />
    </div>
  )
}