import "../src/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MyApp({ Component, pageProps }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-4">
          <SidebarTrigger />
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarProvider>
  );
}