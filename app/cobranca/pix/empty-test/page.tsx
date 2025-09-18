'use client'

import { EmptyDataDemo } from '@/components/empty-data-demo'

export default function EmptyDataTestPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teste: Tratamento de Dias Vazios</h1>
        <p className="text-gray-600 mt-2">
          Esta página demonstra como a aplicação lida com dias onde a API retorna "Pesquisa não retornou dados".
        </p>
      </div>
      
      <EmptyDataDemo />
    </div>
  )
}