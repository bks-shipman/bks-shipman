import { Geist, Geist_Mono, Poppins } from "next/font/google";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "BKS SHIPMAN",
  description: "TOTAL SHIP MANAGEMENT SOLUTIONS",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
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
