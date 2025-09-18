import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function Loading({ className, size = 'md', text = 'Carregando...' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        <div className={cn(
          'animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto',
          sizeClasses[size]
        )}></div>
        {text && (
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )
}