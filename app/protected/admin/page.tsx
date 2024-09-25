import { getStats } from "@app/actions/jobs";
import { Dashboard } from "./dashboard";
import type { StatsProps } from "@src/entities/models/Job";

export default async function Page() {
  const stats = await getStats();
  return (
    <>
      <Dashboard statsData={stats} />
    </>
  );
}
