'use client'

import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface TimelineItem {
  id: string
  timestamp: string
  title: string
  description?: string
  status: 'success' | 'error' | 'warning' | 'info' | 'pending'
  user?: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800',
        badgeColor: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        lineColor: 'bg-green-200 dark:bg-green-800'
      }
    case 'error':
      return {
        icon: <XCircle className="h-4 w-4" />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        badgeColor: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
        lineColor: 'bg-red-200 dark:bg-red-800'
      }
    case 'warning':
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
        lineColor: 'bg-yellow-200 dark:bg-yellow-800'
      }
    case 'info':
      return {
        icon: <Activity className="h-4 w-4" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        lineColor: 'bg-blue-200 dark:bg-blue-800'
      }
    default:
      return {
        icon: <Clock className="h-4 w-4" />,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        borderColor: 'border-gray-200 dark:border-gray-700',
        badgeColor: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
        lineColor: 'bg-gray-200 dark:bg-gray-700'
      }
  }
}

const formatDateTime = (dateString: string) => {
  try {
    const date = parseISO(dateString)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch (error) {
    return dateString
  }
}

export function Timeline({ items, className }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Activity className="h-8 w-8 mb-2" />
        <p className="text-sm">Nenhum evento encontrado</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const config = getStatusConfig(item.status)
        const isLast = index === items.length - 1

        return (
          <div key={item.id} className="relative flex">
            {/* Linha vertical */}
            {!isLast && (
              <div 
                className={cn(
                  'absolute left-6 top-12 w-0.5 h-full -ml-px',
                  config.lineColor
                )}
              />
            )}

            {/* Ícone do status */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center z-10',
              config.bgColor,
              config.borderColor
            )}>
              <div className={config.color}>
                {config.icon}
              </div>
            </div>

            {/* Conteúdo do evento */}
            <div className="flex-1 ml-4 pb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow">
                {/* Header com título e status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-medium text-gray-900 dark:text-gray-100 leading-tight"
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn('flex-shrink-0 text-xs', config.badgeColor)}
                  >
                    {item.status}
                  </Badge>
                </div>

                {/* Descrição */}
                {item.description && (
                  <p 
                    className="text-sm text-muted-foreground mb-3 leading-relaxed"
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      maxWidth: '100%'
                    }}
                  >
                    {item.description}
                  </p>
                )}

                {/* Footer com timestamp e usuário */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(item.timestamp)}</span>
                  </div>
                  {item.user && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{item.user}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline