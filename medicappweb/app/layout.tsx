// app/layout.tsx
import './globals.css'; // Tus estilos globales de Tailwind CSS
import { Inter } from 'next/font/google'; // O la fuente que estés utilizando
import { cn } from '@/lib/utils'; // Si usas la utilidad 'cn' de shadcn/ui
import { ThemeProvider } from '@/components/ui/theme-provider'; // Tu ThemeProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Define una variable CSS para la fuente
});

// Si también tienes una fuente mono (como indica el texto "geist_mono"), impórtala también:
// import { Fira_Code } from 'next/font/google'; // Ejemplo de fuente mono
// const firaCode = Fira_Code({
//   subsets: ['latin'],
//   variable: '--font-mono',
// });

export const metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción de mi aplicación.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn( // Usa 'cn' si lo tienes, o simplemente las clases de Tailwind y la variable de la fuente.
          'min-h-screen bg-background font-sans antialiased', // Clases base de Shadcn UI
          inter.variable, // Esto aplica la variable CSS de la fuente.
          // Si tienes una fuente mono, agrégala también:
          // firaCode.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}