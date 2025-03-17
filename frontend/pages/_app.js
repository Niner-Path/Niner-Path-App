import "../src/styles/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <SidebarProvider>
      <div className="flex">
        {router.pathname === "/dashboard" && <AppSidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarProvider>
  );
}
