import { createFileRoute, redirect } from "@tanstack/react-router";

// Landing — immediately send to /ask
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/ask" });
  },
});
