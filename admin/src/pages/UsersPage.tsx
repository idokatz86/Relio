import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';
import { api } from '../lib/api';

export function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [phase, setPhase] = useState('');

  useEffect(() => {
    api.users(page, 20, phase || undefined).then(setData).catch(console.error);
  }, [page, phase]);

  return (
    <div className="p-8">
      <PageHeader title="User Directory" description="Registered users — anonymized IDs, no raw messages" />

      <div className="flex gap-4 mb-6">
        <select value={phase} onChange={e => { setPhase(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">All Phases</option>
          <option value="dating">Dating</option>
          <option value="commitment">Commitment</option>
          <option value="crisis">Crisis</option>
          <option value="separation">Separation</option>
          <option value="post_divorce">Post-Divorce</option>
        </select>
        <span className="text-sm text-gray-500 self-center">{data?.total ?? 0} users</span>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Phase</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tier</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Paired</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((u: any, i: number) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-400">{u.id}</td>
                <td className="px-4 py-3 text-gray-900">{u.displayName}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 capitalize">{u.phase}</span></td>
                <td className="px-4 py-3 capitalize">{u.subscriptionTier?.replace('_', ' ')}</td>
                <td className="px-4 py-3">{u.hasPartner ? '👥' : '◯'}</td>
                <td className="px-4 py-3 text-gray-400">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50">Previous</button>
        <span className="text-sm text-gray-500">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 text-sm border rounded-lg">Next</button>
      </div>
    </div>
  );
}
