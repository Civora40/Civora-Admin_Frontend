import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civora Admin Console | Intelligent Construction. Clearer Control.",
  description:
    "Administrative, governance, and identity control plane for the Civora Construction Intelligence Platform.",
  icons: {
    icon: [
      { url: 'https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png', type: 'image/png' },
    ],
    apple: [
      { url: 'https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png', type: 'image/png' },
    ],
    shortcut: 'https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png" type="image/png" />
        <link rel="shortcut icon" href="https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/depeqzb6z/image/upload/v1792417773/Group_1216401107_1_vuicvo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Encode+Sans+Condensed:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-[#001237] antialiased overflow-x-hidden selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
        {children}
      </body>
    </html>
  );
}
