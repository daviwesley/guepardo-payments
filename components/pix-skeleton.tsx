import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function PixPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-9 w-16 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter controls skeleton */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-72" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Bank list skeleton */}
      <PixBankListSkeleton />
    </div>
  )
}

export function PixDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton */}
      <nav className="flex items-center space-x-1">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </nav>

      {/* Back button skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* PIX Details Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status e Valores Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status badges */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            
            {/* QR Code area */}
            <div className="flex flex-col items-center space-y-3 py-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-48 w-48 rounded-lg" />
              <div className="text-center space-y-2 w-full">
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-16 w-full rounded" />
              </div>
            </div>
            
            {/* Valores */}
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>

            {/* Observação */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 mt-0.5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Cliente Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Cliente info */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
            
            {/* Contato */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            
            {/* Endereço */}
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 mt-0.5" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Bancários Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Banco info */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
            
            {/* PIX Keys com botões copy */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-16 mb-1" />
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Botão Informações Detalhadas */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  )
}

export function PixAllTransactionsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Search and filters skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Transaction table skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-10" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="text-left p-2">
                    <Skeleton className="h-4 w-12" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PixBankListSkeleton() {
  return (
    <div className="space-y-4">
      {/* List header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>
      
      {/* Bank items skeleton */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Bank logo skeleton */}
                <Skeleton className="h-12 w-12 rounded-full" />
                
                <div className="space-y-2">
                  {/* Bank name skeleton */}
                  <Skeleton className="h-5 w-40" />
                  {/* Bank code skeleton */}
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                {/* Stats columns skeleton */}
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-8" />
                </div>
                
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-6 w-12" />
                </div>
                
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-8" />
                </div>
                
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-6 w-24" />
                </div>
                
                {/* Actions skeleton */}
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PixBankCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-3 flex-1">
          {/* Logo skeleton */}
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            {/* Bank name skeleton */}
            <Skeleton className="h-5 w-32" />
            {/* Bank code skeleton */}
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        {/* Menu button skeleton */}
        <Skeleton className="h-8 w-8" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-6 w-16 mx-auto" />
            </div>
          ))}
        </div>
        
        {/* Progress bars skeleton */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex space-x-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}