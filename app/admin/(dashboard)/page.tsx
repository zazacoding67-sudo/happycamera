import { getAdminMetrics } from "@/lib/adminMetrics";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const initial = await getAdminMetrics();
  return <DashboardClient initial={initial} />;
}
