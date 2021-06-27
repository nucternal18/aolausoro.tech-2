import { AppProps } from 'next/app';
import { AuthProvider } from '../context/authContext';
import 'tailwindcss/tailwind.css';
import { ThemeProvider } from 'next-themes';
import NotificationContextProvider from '../context/notificationContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class'>
      <NotificationContextProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </NotificationContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
