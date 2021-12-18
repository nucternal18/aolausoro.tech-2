import { useState } from "react";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/authContext";
import { ToastContainer } from "react-toastify";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";

// Context
import { PortfolioProvider } from "../context/portfolioContext";

interface WorkaroundAppProps extends AppProps {
  err: any;
}

function MyApp({ Component, pageProps, err }: WorkaroundAppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class">
          <PortfolioProvider>
            <SessionProvider session={pageProps.session}>
              <AuthProvider>
                <Component {...pageProps} err={err} />
              </AuthProvider>
            </SessionProvider>
          </PortfolioProvider>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
