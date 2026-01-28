'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

type PollOption = { id: string; text: string; votes: number; percent: number };
type ActivePoll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
};

export default function PollWidget({ initialPoll }: { initialPoll?: ActivePoll | null }) {
  const [poll, setPoll] = useState<ActivePoll | null>(initialPoll ?? null);
  const [loading, setLoading] = useState(!initialPoll);
  const [selected, setSelected] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const sortedOptions = useMemo(() => {
    if (!poll) return [];
    return [...poll.options].sort((a, b) => b.votes - a.votes);
  }, [poll]);

  useEffect(() => {
    if (initialPoll) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/poll/active');
        const data = await res.json();
        if (!cancelled) setPoll(data.poll || null);
      } catch {
        if (!cancelled) setPoll(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [initialPoll]);

  const vote = async () => {
    if (!poll || !selected) return;
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll.id, optionId: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to vote');
        return;
      }
      setPoll(data.poll);
      setSuccess('Vote submitted!');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-afro-primary/20 text-afro-primary rounded-lg">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-2xl font-bold font-display text-white">Poll of the Week</h3>
        </div>
        <div className="text-gray-400">Loading poll...</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-afro-primary/20 text-afro-primary rounded-lg">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-2xl font-bold font-display text-white">Poll of the Week</h3>
        </div>
        <p className="text-gray-400 text-sm">No active poll right now.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-afro-primary/20 text-afro-primary rounded-lg">
          <BarChart3 size={24} />
        </div>
        <h3 className="text-2xl font-bold font-display text-white">Poll of the Week</h3>
      </div>

      <h4 className="text-xl font-bold text-white mb-6">{poll.question}</h4>

      <div className="space-y-3">
        {poll.options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setSelected(o.id)}
            disabled={submitting}
            className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
              selected === o.id
                ? 'border-afro-primary bg-afro-primary/10 text-white'
                : 'border-gray-700 bg-gray-950/40 text-gray-200 hover:border-gray-600'
            } ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold">{o.text}</span>
              <span className="text-xs text-gray-400">{o.votes} votes</span>
            </div>
            <div className="mt-2 h-2 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-afro-primary" style={{ width: `${o.percent}%` }} />
            </div>
            <div className="mt-1 text-xs text-gray-500">{o.percent}%</div>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Total votes: {poll.totalVotes}
        </div>
        <button
          type="button"
          onClick={vote}
          disabled={!selected || submitting}
          className="bg-afro-primary text-black font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Vote'}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle size={18} className="mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          <CheckCircle size={18} className="mt-0.5" />
          <div>{success}</div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500">
        Live results update after you vote.
      </div>
    </div>
  );
}

