import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Chimly AI | Operational Intelligence for Teams",
  description:
    "Handle your daily tasks like a pro with our loaded AI features. Chimly helps you organize, automate, and optimize your workflow.",
  keywords: ["AI", "Task Management", "Productivity", "Automation", "Workflow"],
  authors: [{ name: "Chimly AI" }],
  creator: "Aj Fred",
  publisher: "Aj Fred",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chimly.ai",
    siteName: "Chimly AI",
    title: "Chimly AI | Operational Intelligence for Teams",
    description: "Simplify your life, one task at a time",
    images: [
      {
        url: "https://chimly.ai/assets/chimly.png",
        width: 1200,
        height: 630,
        alt: "Chimly AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chimly AI | Operational Intelligence for Teams",
    description: "Simplify your life, one task at a time",
    images: ["https://chimly.ai/assets/chimly.png"],
    creator: "@iamajfred_",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          property="og:title"
          content="Chimly AI | Operational Intelligence for Teams"
        />
        <meta
          property="og:description"
          content="Simplify your life, one task at a time"
        />
        <meta
          property="og:image"
          content="https://chimly.ai/assets/chimly.png"
        />
        <meta property="og:url" content="https://chimly.ai" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="twitter:title"
          content="Chimly AI | Operational Intelligence for Teams"
        />
        <meta
          name="twitter:description"
          content="Simplify your life, one task at a time"
        />
        <meta
          name="twitter:image"
          content="https://chimly.ai/assets/chimly.png"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
