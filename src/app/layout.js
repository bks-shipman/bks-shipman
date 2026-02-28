import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Script from "next/script";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/nprogress/styles.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bks-shipman.vercel.app'),
  title: {
    default: "BKS SHIPMAN - Total Ship Management Solutions",
    template: "%s | BKS SHIPMAN",
  },
  description: "BKS SHIPMAN menyediakan solusi manajemen kapal profesional termasuk manajemen teknis, kru, dan komersial.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "BKS SHIPMAN",
    images: [
      {
        url: "/og-image.png", // Taruh file ini di folder public
        width: 1200,
        height: 630,
        alt: "BKS SHIPMAN Corporate",
      },
    ],
  },
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      {/* <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head> */}
      <body
        className={`${poppins.variable} antialiased`}
      >
        <main className="min-h-screen w-full">
          <MantineProvider
            defaultColorScheme="auto"
            withGlobalStyles
            withNormalizeCSS
          >
            <NavigationProgress color="blue" />
            <Notifications />
            <ModalsProvider>
              {children}
            </ModalsProvider>
          </MantineProvider>
        </main>
      </body>
    </html>
  );
}
