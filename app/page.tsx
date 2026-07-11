import { Dashboard } from "@/components/Dashboard";
import { getLiveDashboardData } from "@/lib/dashboard/riot-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getLiveDashboardData();

  return <Dashboard {...data} />;
}