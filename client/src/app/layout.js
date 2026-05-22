import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '../components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NeuralDesk Workspace',
  description: 'A production-ready full-stack notes application featuring AI summarization.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
