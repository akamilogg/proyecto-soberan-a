import { u as useInternetIdentity, a as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DVlwnvdG.js";
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
  "[ AUTHENTICATION REQUIRED ]"
];
function Login() {
  const { login, isAuthenticated, isLoggingIn, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center p-4 font-mono overflow-hidden animate-flicker",
      "data-ocid": "login.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 overflow-x-auto w-full flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "text-primary crt-glow text-[0.45rem] sm:text-[0.55rem] leading-tight whitespace-pre select-none",
            "aria-label": "Proyecto Soberanía",
            children: ASCII_LOGO
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full max-w-xl mb-8 border border-border bg-card p-4 crt-box-glow",
            "data-ocid": "login.boot_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mb-3", children: "┌─ BOOT SEQUENCE ──────────────────────────────────" }),
              BOOT_LINES.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-xs tracking-wider font-mono leading-relaxed ${line === "" ? "h-3" : line.startsWith("[") ? "text-secondary crt-glow-amber font-bold mt-2" : "text-primary"}`,
                  children: [
                    line && !line.startsWith("[") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mr-2", children: ">" }),
                    line
                  ]
                },
                `boot-${i}-${line.slice(0, 8)}`
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mt-3", children: "└──────────────────────────────────────────────────" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full max-w-xl border border-border bg-card p-6 crt-border crt-box-glow",
            "data-ocid": "login.auth_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mb-1", children: "┌─ INTERNET IDENTITY AUTHENTICATION" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "This protocol requires cryptographic authentication via Internet Identity. Your identity is self-sovereign and stored on the Internet Computer." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mt-2", children: "└──────────────────────────────────────────────────" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: login,
                  disabled: isLoggingIn || isInitializing,
                  className: `w-full py-4 px-6 text-sm font-bold tracking-[0.2em] uppercase transition-smooth border ${isLoggingIn || isInitializing ? "border-muted text-muted-foreground cursor-not-allowed bg-muted/30" : "border-primary text-primary bg-primary/10 hover:bg-primary/20 crt-glow crt-box-glow hover:text-primary"}`,
                  "data-ocid": "login.connect_button",
                  "aria-busy": isLoggingIn,
                  children: isInitializing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "INITIALIZING" }) : isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "AUTHENTICATING" }) : "[ CONNECT WITH INTERNET IDENTITY ]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-xs text-muted-foreground tracking-wide space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "► No account needed — your ICP wallet IS your identity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "► Fully decentralized, no third-party auth servers" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "► Your principal ID is your protocol address" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center text-xs text-muted-foreground tracking-widest space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "PROYECTO SOBERANÍA · DECENTRALIZED AI ON ICP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Built with",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:crt-glow transition-smooth",
                children: "caffeine.ai"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  Login as default
};
