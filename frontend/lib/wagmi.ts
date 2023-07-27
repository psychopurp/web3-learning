import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli,
} from "wagmi/chains";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const localChain: Chain = {
  id: 1337,
  name: "Local",
  network: "Local",
  nativeCurrency: {
    name: "Noah",
    symbol: "NOAH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
      webSocket: undefined,
    },
    public: {
      http: [],
      webSocket: undefined,
    },
  },
};

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Noah DApp",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { wagmiConfig, chains };
