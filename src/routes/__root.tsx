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
import { RetroDesktop } from "~/components/RetroDesktop";
import { healthCheck } from "~/server/health";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries:   { retry: 1,  staleTime: 30_000 },
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
          "Answer three questions. Get one perfect recommendation. No scrolling required.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Retro fonts — Space Mono (navbar, labels) + VT323 (display text)
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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <RetroDesktop>
            <Outlet />
          </RetroDesktop>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                border: "2px solid #B76E79",
                boxShadow: "4px 4px 0px #B76E79",
                borderRadius: "0",
                background: "#F4ECEB",
                color: "#1c1b1b",
              },
            }}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
