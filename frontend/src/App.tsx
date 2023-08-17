import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/src/components/Layout";
import { Spinner } from "@nextui-org/react";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/index.tsx"),
  },
  {
    path: "/examples",
    element: <Layout />,
    children: [
      {
        path: "simple-wallet",
        lazy: () => import("@/src/pages/simple-wallet/page.tsx"),
      },
      {
        path: "airdrop",
        lazy: () => import("@/src/pages/airdrop/page.tsx"),
      },
      {
        path: "wallet-generator",
        lazy: () => import("@/src/pages/wallet-generator/page.tsx"),
      },
      {
        path: "wallet-genuine-number-generator",
        lazy: () =>
          import("@/src/pages/wallet-genuine-number-generator/page.tsx"),
      },
      {
        path: "faucet",
        lazy: () => import("@/src/pages/faucet/page.tsx"),
      },
      {
        path: "faucet-with-backend",
        lazy: () => import("@/src/pages/faucet-with-backend/page.tsx"),
      },
      {
        path: "noah-nft",
        lazy: () => import("@/src/pages/noah-nft/page.tsx"),
      },
      {
        path: "noah-token",
        lazy: () => import("@/src/pages/noah-token/page.tsx"),
      },
    ],
  },
]);

function FallBack() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} fallbackElement={<FallBack />} />;
}
