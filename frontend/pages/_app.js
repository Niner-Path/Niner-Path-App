import "@/styles/globals.css";
import { useRouter } from "next/router";
import AppSidebar from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  return (
    <div className={`h-screen w-screen ${isDashboard ? "flex" : ""}`}>
      {isDashboard && <AppSidebar />}

      <div className="flex-1 flex flex-col">
        {isDashboard && <AppNavbar />}
        <main
          className={`p-6 ${
            isDashboard
              ? "flex-1 overflow-y-auto"
              : "flex justify-center items-center"
          }`}
        >
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
