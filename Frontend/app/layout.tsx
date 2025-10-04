import type { Metadata } from 'next' 
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Sales System',
  description: 'Sistema profesional para el control de inventario y ventas',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

/*
Layout principal de la app en Next.js con estilos globales y metadatos.
*/
