/* ============================================
   Rate My Resume — Root Layout
   ============================================ */
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// SEO Metadata
export const metadata = {
  title: 'Rate My Resume — AI-Powered Resume Analysis',
  description:
    'Upload your resume and get an instant AI-powered score, actionable improvement suggestions, and career insights. Optimize your resume for ATS and stand out to recruiters.',
  keywords: ['resume', 'AI', 'analysis', 'score', 'career', 'job', 'ATS', 'optimization'],
  openGraph: {
    title: 'Rate My Resume — AI-Powered Resume Analysis',
    description: 'Get instant AI feedback on your resume. Score, suggestions, and career insights.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
