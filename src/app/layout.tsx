import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NASA Solar System Orrery | Anti-Gravity 3D Explorer',
  description: 'Interactive 3D Solar System Orrery built with React Three Fiber, realistic NASA textures, zero-gravity anti-gravity floating mechanics, and atmospheric fresnel glows.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
