import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Script from "next/script";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/nprogress/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BKS SHIPMAN",
  description: "TOTAL SHIP MANAGEMENT SOLUTIONS",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen w-full">
          <MantineProvider
            defaultColorScheme="light"
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
