import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';
import { LayoutProvider } from '@/contexts/layout-context';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Enterprise Template',
  description: 'Modern enterprise front-end template built with Next.js, shadcn/ui, and Tailwind CSS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LayoutProvider>
              {children}
              <Toaster />
            </LayoutProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
