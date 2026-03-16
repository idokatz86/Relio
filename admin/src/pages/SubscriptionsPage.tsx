import React, { useEffect, useState } from 'react';
import { PageHeader, KpiCard } from '../components/ui';
import { api } from '../lib/api';

export function SubscriptionsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.subscriptions().then(setData).catch(console.error); }, []);

  const tiers = data?.tiers ?? {};

  return (
    <div className="p-8">
      <PageHeader title="Subscription Analytics" description="Revenue metrics, conversion, and tier breakdown" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="MRR" value={`$${data?.mrr ?? 0}`} />
        <KpiCard title="ARR" value={`$${data?.arr ?? 0}`} />
        <KpiCard title="Conversion Rate" value={`${data?.conversionRate ?? 0}%`} subtitle="Free → Paid" />
        <KpiCard title="Paid Users" value={data?.paidUsers ?? 0} />
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tier Breakdown</h3>
        <div className="space-y-4">
          {[
            { key: 'free', label: 'Free', price: '$0', color: '#94A3B8' },
            { key: 'premium_solo', label: 'Premium Solo', price: '$9.99/mo', color: '#6B705C' },
            { key: 'premium_couples', label: 'Premium Couples', price: '$14.99/mo', color: '#B08968' },
            { key: 'premium_plus', label: 'Premium+', price: '$24.99/mo', color: '#7FB069' },
          ].map(tier => {
            const count = tiers[tier.key] ?? 0;
            const total = Object.values(tiers).reduce((s: number, v: any) => s + (typeof v === 'number' ? v : 0), 0);
            const pct = total > 0 && typeof count === 'number' ? Math.round((count / total) * 100) : 0;
            return (
              <div key={tier.key} className="flex items-center gap-4">
                <div className="w-40">
                  <p className="font-medium text-gray-900">{tier.label}</p>
                  <p className="text-xs text-gray-400">{tier.price}</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(3, pct)}%`, backgroundColor: tier.color }}></div>
                </div>
                <span className="text-sm font-mono w-16 text-right">{count}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
