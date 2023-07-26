import { Layout } from "@/components/Layout";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Layout>{children}</Layout>
      <div>layout</div>
    </div>
  );
}
