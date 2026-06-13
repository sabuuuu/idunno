import { ErrorWindow } from "~/components/ErrorWindow";

export function NotFound() {
  return (
    <ErrorWindow
      message="This page doesn't exist."
      subtitle="you wandered off the map ♡"
      body="Whatever you were looking for isn't here. Head back and try again."
      onSecondary={() => { window.location.href = "/ask"; }}
    />
  );
}
