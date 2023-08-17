import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiConfig, chains } from "./lib/wagmi.ts";
import App from "@/src/App.tsx";

import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
