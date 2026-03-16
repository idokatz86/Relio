import React, { useEffect, useState } from 'react';
import { PageHeader, KpiCard } from '../components/ui';
import { api } from '../lib/api';

export function PipelinePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.pipeline().then(setData).catch(console.error); }, []);

  return (
    <div className="p-8">
      <PageHeader title="Pipeline Metrics" description="Message processing, latency, and LLM token usage" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Messages Today" value={data?.messagesToday ?? 0} />
        <KpiCard title="Avg Latency" value={`${data?.latency?.avg ?? 0}ms`} />
        <KpiCard title="P95 Latency" value={`${data?.latency?.p95 ?? 0}ms`} />
        <KpiCard title="Total Tokens" value={(data?.totalTokens ?? 0).toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Latency Percentiles</h3>
          <div className="space-y-3">
            {['p50', 'p95', 'p99'].map(p => (
              <div key={p} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-12 uppercase">{p}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{
                    width: `${Math.min(100, (data?.latency?.[p] ?? 0) / 100)}%`
                  }}></div>
                </div>
                <span className="text-sm font-mono w-20 text-right">{data?.latency?.[p] ?? 0}ms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Token Usage by Agent</h3>
          {data?.tokenUsage && data.tokenUsage.length > 0 ? (
            <div className="space-y-2">
              {Object.entries(
                data.tokenUsage.reduce((acc: any, t: any) => {
                  acc[t.agent] = (acc[t.agent] || 0) + t.tokens;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([agent, tokens]: any) => (
                <div key={agent} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-mono">{agent}</span>
                  <span className="text-gray-900 font-mono">{tokens.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No token data yet</p>}
        </div>
      </div>
    </div>
  );
}
