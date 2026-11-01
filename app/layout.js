
import './globals.css';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import { StoreProviders } from '@/lib/storeProvider';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import StoreProvider from './StoreProvider';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = { title: 'Ashlar University Portal', description: 'Course and student management' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <StoreProviders>
          <StoreProvider>
            {children}
          </StoreProvider>
        </StoreProviders>
      </body>
    </html>
  );
}
