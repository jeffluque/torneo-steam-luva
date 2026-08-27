import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { router } from "./routes";
import "../styles/fonts.css";
import "../styles/theme.css";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function App() {
  useEffect(() => {
    let currentPage = `${router.state.location.pathname}${router.state.location.search}`;

    return router.subscribe((state) => {
      const nextPage = `${state.location.pathname}${state.location.search}`;

      if (nextPage !== currentPage) {
        currentPage = nextPage;
        window.fbq?.("track", "PageView");
      }
    });
  }, []);

  return <RouterProvider router={router} />;
}
