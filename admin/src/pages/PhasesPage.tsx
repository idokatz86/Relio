import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';
import { api } from '../lib/api';

export function PhasesPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.phases().then(setData).catch(console.error); }, []);

  const phases = data?.distribution ?? {};
  const colors: Record<string, string> = {
    dating: 'bg-pink-100 text-pink-800',
    commitment: 'bg-purple-100 text-purple-800',
    crisis: 'bg-red-100 text-red-800',
    separation: 'bg-amber-100 text-amber-800',
    post_divorce: 'bg-gray-100 text-gray-800',
    unknown: 'bg-gray-50 text-gray-500',
  };

  const total = data?.total ?? 0;

  return (
    <div className="p-8">
      <PageHeader title="Phase Distribution" description="Couples by relationship stage — k-anonymity applied for groups < 5" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(phases).map(([phase, count]: any) => (
          <div key={phase} className="bg-white rounded-xl border p-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors[phase] || colors.unknown} capitalize mb-2`}>
              {phase.replace('_', ' ')}
            </span>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            {typeof count === 'number' && total > 0 && (
              <p className="text-xs text-gray-400 mt-1">{Math.round((count / total) * 100)}%</p>
            )}
            {typeof count === 'string' && <p className="text-xs text-amber-500 mt-1">k-anonymity</p>}
          </div>
        ))}
      </div>

      {/* Bar chart visualization */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Distribution Bar</h3>
        <div className="space-y-3">
          {Object.entries(phases).map(([phase, count]: any) => {
            const numericCount = typeof count === 'number' ? count : 2;
            const maxCount = Math.max(...Object.values(phases).map((v: any) => typeof v === 'number' ? v : 5));
            const width = maxCount > 0 ? Math.max(5, (numericCount / maxCount) * 100) : 5;
            return (
              <div key={phase} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 capitalize">{phase.replace('_', ' ')}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className="h-full bg-sage-600 rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: '#6B705C' }}></div>
                </div>
                <span className="text-sm font-mono text-gray-600 w-10 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
