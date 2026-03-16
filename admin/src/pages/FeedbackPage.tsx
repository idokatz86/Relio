import React, { useEffect, useState } from 'react';
import { PageHeader, KpiCard } from '../components/ui';
import { api } from '../lib/api';

export function FeedbackPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');

  useEffect(() => {
    api.feedback(page, 20, type || undefined).then(setData).catch(console.error);
  }, [page, type]);

  return (
    <div className="p-8">
      <PageHeader title="Feedback Center" description="User ratings, NPS, and sentiment — comments PII-redacted" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard title="Avg Rating" value={data?.avgRating ?? '—'} subtitle="out of 5 (session) / 10 (NPS)" />
        <KpiCard title="NPS Score" value={data?.npsScore ?? '—'} subtitle="Promoters - Detractors" />
        <KpiCard title="Total Feedback" value={data?.total ?? 0} />
      </div>

      <div className="flex gap-4 mb-6">
        <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">All Types</option>
          <option value="session_rating">Session Ratings</option>
          <option value="weekly_pulse">Weekly Pulse</option>
          <option value="nps">NPS</option>
          <option value="churn">Churn</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Comment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Phase</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.feedback?.map((f: any, i: number) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-400">{f.userId}</td>
                <td className="px-4 py-3 capitalize">{f.type.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  <span className="font-bold">{f.rating}</span>
                  <span className="text-gray-300">{'★'.repeat(Math.min(5, f.rating))}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{f.comment || '—'}</td>
                <td className="px-4 py-3 capitalize">{f.phase}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!data?.feedback || data.feedback.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No feedback yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
