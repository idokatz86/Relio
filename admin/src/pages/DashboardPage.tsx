import React, { useEffect, useState } from 'react';
import { KpiCard, PageHeader } from '../components/ui';
import { api } from '../lib/api';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any>(null);
  const [safety, setSafety] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.overview(), api.subscriptions(), api.safety()])
      .then(([overview, subs, safe]) => {
        setData(overview);
        setSubscriptions(subs);
        setSafety(safe);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <PageHeader title="Dashboard" description="Relio backoffice — real-time overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Users" value={data?.totalUsers ?? 0} />
        <KpiCard title="Active Couples" value={data?.activeCouples ?? 0} />
        <KpiCard title="Solo Users" value={data?.soloUsers ?? 0} />
        <KpiCard title="Messages Today" value={data?.messagesToday ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="MRR" value={`$${subscriptions?.mrr ?? 0}`} />
        <KpiCard title="Paid Users" value={subscriptions?.paidUsers ?? 0} />
        <KpiCard title="Conversion Rate" value={`${subscriptions?.conversionRate ?? 0}%`} />
        <KpiCard title="Safety Halts Today" value={data?.safetyHaltsToday ?? 0} trend={data?.safetyHaltsToday > 0 ? 'up' : 'neutral'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Health</h3>
          <p className="text-sm text-gray-500">Avg Latency: <span className="font-mono text-gray-900">{data?.avgPipelineLatencyMs ?? 0}ms</span></p>
          <p className="text-sm text-gray-500 mt-1">Safety Halt Rate: <span className="font-mono text-gray-900">{safety?.haltRate ?? 0}%</span></p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
          {subscriptions?.tiers && Object.entries(subscriptions.tiers).map(([tier, count]: any) => (
            <div key={tier} className="flex justify-between text-sm py-1">
              <span className="text-gray-600 capitalize">{tier.replace('_', ' ')}</span>
              <span className="font-mono text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
