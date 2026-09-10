import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"] });

export const metadata = {
  title: {
    default: "SciSim — Interactive Science Simulations for the Classroom",
    template: "%s | SciSim",
  },
  description:
    "SciSim turns physics, chemistry and biology into hands-on, interactive simulations. Change the variables, watch the results live, and help students build real intuition — free and in the browser.",
  keywords: [
    "science simulation",
    "physics simulation",
    "chemistry lab",
    "interactive learning",
    "STEM education",
    "virtual lab",
    "classroom",
  ],
  openGraph: {
    title: "SciSim — Interactive Science Simulations for the Classroom",
    description:
      "Free, interactive science simulations that run right in your browser.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();",
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
