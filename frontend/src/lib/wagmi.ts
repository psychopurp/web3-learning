import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Chain, configureChains, createConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const localChain: Chain = {
  id: 31337,
  name: "Local",
  network: "Local",
  nativeCurrency: {
    name: "Noah",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
      webSocket: undefined,
    },
    public: {
      http: ["http://127.0.0.1:8545"],
      webSocket: undefined,
    },
  },
};

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora, localChain],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Noah DApp",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { wagmiConfig, chains };
