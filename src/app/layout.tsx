import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/frontend/theme/muiTheme';
import { AuthProvider } from '@/frontend/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Phone Sale - Los Mejores iPhones al Mejor Precio',
  description:
    'Encuentra los últimos modelos de iPhone con las mejores ofertas. iPhone 15 Pro Max, iPhone 15 Pro, iPhone 14 y más. Garantía y envío incluido.',
  keywords: 'iPhone, iPhone 15, iPhone 14, venta de celulares, smartphones',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
