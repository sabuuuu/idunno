import React, { useState } from "react";
import { logoutServerFn } from "~/server/auth";
import { useWindowManager } from "~/components/desktop/useWindowManager";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";

export function LogoutWindow() {
  const [loading, setLoading] = useState(false);
  const { closeWindow } = useWindowManager();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutServerFn();
      await queryClient.invalidateQueries({ queryKey: ["session-user"] });
      closeWindow("logout-window");
    } catch (err) {
      console.error("Logout failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-vapor-cream h-full text-center">
      <img src="/exit.png" alt="Exit" className="size-[100px] [image-rendering:pixelated]" />
      <p className="font-bold text-sm text-vapor-dark">
        Are you sure you want to log out?
      </p>

      <div className="flex gap-4 mt-4">
        <Button
          variant="vapor"
          className="font-pixel text-micro tracking-wide w-20"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "..." : "YES"}
        </Button>
        <Button
          variant="vapor"
          className="font-pixel text-micro tracking-wide w-20"
          onClick={() => closeWindow("logout-window")}
          disabled={loading}
        >
          NO
        </Button>
      </div>
    </div>
  );
}
