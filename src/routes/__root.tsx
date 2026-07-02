/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { Desktop } from "~/components/desktop/Desktop";
import { healthCheck } from "~/server/health";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...seo({
        title: "Idonnu — find something worth watching",
        description:
          "Answer five questions. Get one perfect recommendation. No scrolling required.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=VT323&family=DM+Sans:wght@400;500;700&display=swap",
      },
    ],
  }),
  loader: () => healthCheck(),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children: _children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Desktop>
            <Outlet />
          </Desktop>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                border: "2px solid var(--vapor-rose)",
                boxShadow: "4px 4px 0px var(--vapor-rose)",
                borderRadius: "0",
                background: "var(--background)",
                color: "var(--foreground)",
              },
            }}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
