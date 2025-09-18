'use client'

import { PerformanceDemo } from '@/components/performance-demo'

export default function PerformancePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Demonstração de Otimização</h1>
        <p className="text-gray-600 mt-2">
          Esta página demonstra como as requisições paralelas otimizam o carregamento de dados da API PIX.
        </p>
      </div>
      
      <PerformanceDemo />
    </div>
  )
}