import React, { useState } from "react";
import { loginServerFn } from "~/server/auth";
import { useWindowManager } from "~/components/desktop/useWindowManager";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function LoginWindow() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { closeWindow, openWindow } = useWindowManager();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await loginServerFn({ data: { username, password } });
      if (res.success) {
        closeWindow("login-window");
        if (res.isNewUser) {
          openWindow({
            id: "info-dialog",
            title: "INFO.EXE",
            componentType: "generic",
            x: typeof window !== "undefined" ? window.innerWidth / 2 - 150 : 200,
            y: typeof window !== "undefined" ? window.innerHeight / 2 - 100 : 200,
            width: 300,
            height: 350,
            props: {
              content: (
                <div className="flex flex-col items-center justify-center p-4 h-full text-center bg-vapor-cream">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="font-sans text-sm mb-4">Welcome, new user! Please keep your password safe!</p>
                  <Button
                    variant="vapor"
                    onClick={() => closeWindow("info-dialog")}
                  >
                    OK
                  </Button>
                </div>
              )
            }
          });
        }
        window.location.reload();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-vapor-cream h-full font-sans text-vapor-dark">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-vapor-rose-dark shadow-win98-in">
          <span className="text-2xl grayscale">🔑</span>
        </div>
        <div>
          <h2 className="font-bold text-sm">Welcome to IDONNU.EXE</h2>
          <p className="text-xs text-vapor-dark opacity-80">Type a user name and password to log on.</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-right">User name:</label>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="flex-1 px-1 py-0.5 text-xs"
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-right">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 px-1 py-0.5 text-xs"
          />
        </div>

        {error && <p className="text-red-600 text-xs ml-22">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="submit"
            disabled={loading}
            variant="vapor"
            className="w-20 disabled:opacity-50"
          >
            {loading ? "..." : "OK"}
          </Button>
          <Button
            type="button"
            onClick={() => closeWindow("login-window")}
            variant="vapor"
            className="w-20"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
