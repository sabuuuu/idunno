import React, { useState } from "react";
import { loginServerFn } from "~/server/auth";
import { useWindowManager } from "~/components/desktop/useWindowManager";

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
          // Open info dialog
          openWindow({
            id: "info-dialog",
            title: "INFO.EXE",
            componentType: "generic",
            x: typeof window !== "undefined" ? window.innerWidth / 2 - 150 : 200,
            y: typeof window !== "undefined" ? window.innerHeight / 2 - 100 : 200,
            width: 300,
            height: 150,
            props: {
              content: (
                <div className="flex flex-col items-center justify-center p-4 h-full text-center bg-[#f4eceb]">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="font-sans text-sm mb-4">Welcome, new user! Please keep your password safe!</p>
                  <button 
                    onClick={() => closeWindow("info-dialog")}
                    className="px-4 py-1 border border-[#1c1b1b] bg-[#d4a0a8] shadow-[inset_1px_1px_0_#f4eceb,inset_-1px_-1px_0_#7a4a52] active:shadow-[inset_1px_1px_0_#7a4a52,inset_-1px_-1px_0_#f4eceb] font-sans text-xs"
                  >
                    OK
                  </button>
                </div>
              )
            }
          });
        }
        // Force reload to update session state in the app
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-[#f4eceb] h-full font-sans text-[#1c1b1b]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-[#8a4853] shadow-[inset_1px_1px_0_#1c1b1b,inset_-1px_-1px_0_#e0aeb6]">
          <span className="text-2xl" style={{ filter: "grayscale(100%)" }}>🔑</span>
        </div>
        <div>
          <h2 className="font-bold text-sm">Welcome to IDONNU.EXE</h2>
          <p className="text-xs text-[#524345]">Type a user name and password to log on.</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-right">User name:</label>
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="flex-1 px-1 py-0.5 border border-[#1c1b1b] shadow-[inset_1px_1px_0_#1c1b1b] text-xs bg-white" 
            autoFocus
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-20 text-xs text-right">Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="flex-1 px-1 py-0.5 border border-[#1c1b1b] shadow-[inset_1px_1px_0_#1c1b1b] text-xs bg-white" 
          />
        </div>

        {error && <p className="text-red-600 text-xs ml-22">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-20 px-4 py-1 border border-[#1c1b1b] bg-[#d4a0a8] shadow-[inset_1px_1px_0_#f4eceb,inset_-1px_-1px_0_#7a4a52] active:shadow-[inset_1px_1px_0_#7a4a52,inset_-1px_-1px_0_#f4eceb] font-sans text-xs disabled:opacity-50"
          >
            {loading ? "..." : "OK"}
          </button>
          <button 
            type="button"
            onClick={() => closeWindow("login-window")}
            className="w-20 px-4 py-1 border border-[#1c1b1b] bg-[#d4a0a8] shadow-[inset_1px_1px_0_#f4eceb,inset_-1px_-1px_0_#7a4a52] active:shadow-[inset_1px_1px_0_#7a4a52,inset_-1px_-1px_0_#f4eceb] font-sans text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
