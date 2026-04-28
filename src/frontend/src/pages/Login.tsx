import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const ASCII_LOGO = `
 ██████╗ ██████╗  ██████╗ ██╗   ██╗███████╗ ██████╗████████╗ ██████╗
 ██╔══██╗██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝╚══██╔══╝██╔═══██╗
 ██████╔╝██████╔╝██║   ██║ ╚████╔╝ █████╗  ██║        ██║   ██║   ██║
 ██╔═══╝ ██╔══██╗██║   ██║  ╚██╔╝  ██╔══╝  ██║        ██║   ██║   ██║
 ██║     ██║  ██║╚██████╔╝   ██║   ███████╗╚██████╗   ██║   ╚██████╔╝
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝    ╚═════╝

  ███████╗ ██████╗ ██████╗ ███████╗██████╗  █████╗ ███╗   ██╗██╗ █████╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗  ██║██║██╔══██╗
  ███████╗██║   ██║██████╔╝█████╗  ██████╔╝███████║██╔██╗ ██║██║███████║
  ╚════██║██║   ██║██╔══██╗██╔══╝  ██╔══██╗██╔══██║██║╚██╗██║██║██╔══██║
  ███████║╚██████╔╝██████╔╝███████╗██║  ██║██║  ██║██║ ╚████║██║██║  ██║
  ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝`.trim();

const BOOT_LINES = [
  "INITIALIZING EGGROLL PROTOCOL v0.1.0...",
  "LOADING BRAIN CANISTER INTERFACE........",
  "CONNECTING TO ICP MAINNET...............",
  "VERIFYING NODE SIGNATURES...............",
  "DECENTRALIZED AI TRAINING READY.........",
  "",
  "[ AUTHENTICATION REQUIRED ]",
];

export default function Login() {
  const { login, isAuthenticated, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-mono overflow-hidden animate-flicker"
      data-ocid="login.page"
    >
      {/* ASCII Logo */}
      <div className="mb-8 overflow-x-auto w-full flex justify-center">
        <pre
          className="text-primary crt-glow text-[0.45rem] sm:text-[0.55rem] leading-tight whitespace-pre select-none"
          aria-label="Proyecto Soberanía"
        >
          {ASCII_LOGO}
        </pre>
      </div>

      {/* Boot sequence */}
      <div
        className="w-full max-w-xl mb-8 border border-border bg-card p-4 crt-box-glow"
        data-ocid="login.boot_panel"
      >
        <p className="text-muted-foreground text-xs tracking-widest mb-3">
          ┌─ BOOT SEQUENCE ──────────────────────────────────
        </p>
        {BOOT_LINES.map((line, i) => (
          <p
            key={`boot-${i}-${line.slice(0, 8)}`}
            className={`text-xs tracking-wider font-mono leading-relaxed ${
              line === ""
                ? "h-3"
                : line.startsWith("[")
                  ? "text-secondary crt-glow-amber font-bold mt-2"
                  : "text-primary"
            }`}
          >
            {line && !line.startsWith("[") && (
              <span className="text-muted-foreground mr-2">&gt;</span>
            )}
            {line}
          </p>
        ))}
        <p className="text-muted-foreground text-xs tracking-widest mt-3">
          └──────────────────────────────────────────────────
        </p>
      </div>

      {/* Auth panel */}
      <div
        className="w-full max-w-xl border border-border bg-card p-6 crt-border crt-box-glow"
        data-ocid="login.auth_panel"
      >
        <div className="mb-4">
          <p className="text-muted-foreground text-xs tracking-widest mb-1">
            ┌─ INTERNET IDENTITY AUTHENTICATION
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This protocol requires cryptographic authentication via Internet
            Identity. Your identity is self-sovereign and stored on the Internet
            Computer.
          </p>
          <p className="text-muted-foreground text-xs tracking-widest mt-2">
            └──────────────────────────────────────────────────
          </p>
        </div>

        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn || isInitializing}
          className={`w-full py-4 px-6 text-sm font-bold tracking-[0.2em] uppercase transition-smooth border ${
            isLoggingIn || isInitializing
              ? "border-muted text-muted-foreground cursor-not-allowed bg-muted/30"
              : "border-primary text-primary bg-primary/10 hover:bg-primary/20 crt-glow crt-box-glow hover:text-primary"
          }`}
          data-ocid="login.connect_button"
          aria-busy={isLoggingIn}
        >
          {isInitializing ? (
            <span className="cursor-blink">INITIALIZING</span>
          ) : isLoggingIn ? (
            <span className="cursor-blink">AUTHENTICATING</span>
          ) : (
            "[ CONNECT WITH INTERNET IDENTITY ]"
          )}
        </button>

        <div className="mt-4 text-xs text-muted-foreground tracking-wide space-y-1">
          <p>► No account needed — your ICP wallet IS your identity</p>
          <p>► Fully decentralized, no third-party auth servers</p>
          <p>► Your principal ID is your protocol address</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground tracking-widest space-y-1">
        <p>PROYECTO SOBERANÍA · DECENTRALIZED AI ON ICP</p>
        <p>
          Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:crt-glow transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
