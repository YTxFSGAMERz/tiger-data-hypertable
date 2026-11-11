import React, { useState } from 'react';
import { Gauge, Zap, BarChart2, CheckCircle2, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';

export default function BenchmarkPanel({ isHypertable }) {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBenchmark = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/hypertable/benchmark');
      const data = await res.json();
      setBenchmarkData(data);
    } catch (err) {
      console.error('Failed to run benchmark:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Gauge size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Query Performance & Chunk Skipping Proof</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              Standard Sequential Scan vs Tiger Data Hypertable
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={runBenchmark}
          disabled={isRunning}
        >
          <Play size={14} />
          <span>{isRunning ? 'Benchmarking...' : 'Run Query Benchmark'}</span>
        </button>
      </div>

      {benchmarkData ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Query Code */}
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#38bdf8'
          }}>
            {benchmarkData.query}
          </div>

          {/* Comparison Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {/* Standard Table */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#f87171' }}>Standard PostgreSQL Scan</span>
                <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Full Table Scan</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {benchmarkData.standardTable.executionTimeMs} ms
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Rows Examined: <strong>{benchmarkData.standardTable.rowsExamined.toLocaleString()} (100% of table)</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '4px' }}>
                {benchmarkData.standardTable.plan}
              </div>
            </div>

            {/* Hypertable Scan */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#34d399' }}>Tiger Data Hypertable Scan</span>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{benchmarkData.hypertable.speedup}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                {benchmarkData.hypertable.executionTimeMs} ms
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Chunks Scanned: <strong>{benchmarkData.hypertable.chunksScanned}</strong> &bull; Chunks Skipped: <strong style={{ color: '#10b981' }}>{benchmarkData.hypertable.chunksSkipped} skipped</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontFamily: 'var(--font-mono)', background: 'var(--bg-primary)', padding: '0.4rem', borderRadius: '4px' }}>
                {benchmarkData.hypertable.plan}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Click <strong>"Run Query Benchmark"</strong> to execute a simulated time-interval scan and view the exact speedup from Tiger Data's <code>Custom Scan (ChunkAppend)</code> partition skipping.
        </p>
      )}
    </div>
  );
}
