import type { Metadata } from "next";
import "./globals.css";
import { poiret } from "./fonts";


export const metadata: Metadata = {
  title: "Лидия Анте",
  description: "Лидия Анте, автор и исполнитель песен",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8VKK714VGN" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8VKK714VGN');
            `,
          }}
        />
      </head>

      <body
        className={`${poiret.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
