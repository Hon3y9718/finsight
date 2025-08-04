
"use client"

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';


// export const metadata: Metadata = {
//   title: 'FinSight',
//   description: 'Your personal finance tracker.',
// };

const AuthRoutes = ['/login', '/register', '/forgot-password'];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ConditionalLayout>
                {children}
            </ConditionalLayout>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = AuthRoutes.includes(pathname);

    if (isAuthRoute) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
    )
}
