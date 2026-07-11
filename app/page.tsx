import { Dashboard } from "@/components/Dashboard";
import { getLiveDashboardData } from "@/lib/dashboard/riot-data";
import type { DashboardMatchRange } from "@/types/dashboard";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    range?: string | string[];
  }>;
};

function parseMatchRange(value: string | string[] | undefined): DashboardMatchRange {
  const resolvedValue = Array.isArray(value) ? value[0] : value;
  return resolvedValue === "10" ? 10 : 20;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const matchRange = parseMatchRange(params.range);
  const data = await getLiveDashboardData(matchRange);

  return <Dashboard {...data} />;
}