import { useState } from 'react';
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/authContext';
import 'tailwindcss/tailwind.css';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';

// Context
import { PortfolioProvider } from '../context/portfolioContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute='class'>
            <PortfolioProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
            </PortfolioProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
