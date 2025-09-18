'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ComponentsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-8 text-primary hover:text-primary/80"
        >
          ← Voltar ao início
        </Link>
        
        <h1 className="text-4xl font-bold mb-6">Componentes shadcn/ui</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Demonstração dos componentes do shadcn/ui integrados na aplicação.
        </p>
        
        <div className="grid gap-8">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Diferentes variações de botões disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>
                Componentes de card para organizar conteúdo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Card Exemplo 1</CardTitle>
                    <CardDescription>
                      Um card simples com título e descrição.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Conteúdo do primeiro card.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Card Exemplo 2</CardTitle>
                    <CardDescription>
                      Outro card com conteúdo diferente.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Conteúdo do segundo card.</p>
                    <Button className="mt-4" size="sm">Ação</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Campos de entrada de dados estilizados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input id="name" placeholder="Digite seu nome" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <Input id="message" placeholder="Sua mensagem..." />
                </div>
                <Button className="w-fit">Enviar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Example */}
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Cores</CardTitle>
              <CardDescription>
                As cores do sistema de design do shadcn/ui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                    <p className="text-sm font-medium">Primary</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
                    <p className="text-sm font-medium">Secondary</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted text-muted-foreground">
                    <p className="text-sm font-medium">Muted</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent text-accent-foreground">
                    <p className="text-sm font-medium">Accent</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}