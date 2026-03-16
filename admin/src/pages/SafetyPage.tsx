import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';
import { api } from '../lib/api';

export function SafetyPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.safety().then(setData).catch(console.error); }, []);
  const dist = data?.severityDistribution ?? {};
  const colors: Record<string, string> = {
    SAFE: 'bg-green-100 text-green-800', LOW: 'bg-yellow-100 text-yellow-800',
    MEDIUM: 'bg-orange-100 text-orange-800', HIGH: 'bg-red-100 text-red-800', CRITICAL: 'bg-red-200 text-red-900',
  };

  return (
    <div className="p-8">
      <PageHeader title="Safety Events" description="Safety Guardian halt history — anonymized, no user IDs for LOW/MEDIUM" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500">Total Events</p><p className="text-3xl font-bold">{data?.totalEvents ?? 0}</p></div>
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500">Halts</p><p className="text-3xl font-bold text-red-600">{data?.halts ?? 0}</p></div>
        <div className="bg-white rounded-xl border p-6"><p className="text-sm text-gray-500">Halt Rate</p><p className="text-3xl font-bold">{data?.haltRate ?? 0}%</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Severity Distribution</h3>
          <div className="space-y-2">
            {Object.entries(dist).map(([sev, count]: any) => (
              <div key={sev} className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${colors[sev] || ''} w-20 text-center`}>{sev}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Recent Events</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {data?.recentEvents?.map((e: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm py-1">
                <span className={`px-1.5 py-0.5 rounded text-xs ${colors[e.severity] || ''}`}>{e.severity}</span>
                <span className="text-gray-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
                {e.halt && <span className="text-red-500 text-xs font-bold">HALT</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
