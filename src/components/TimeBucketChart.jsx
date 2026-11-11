import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Thermometer, Cpu, Layers } from 'lucide-react';

export default function TimeBucketChart() {
  const [buckets, setBuckets] = useState([]);
  const [metric, setMetric] = useState('temperature'); // 'temperature' | 'cpu'

  const fetchAnalytics = () => {
    fetch('/api/hypertable/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.buckets) setBuckets(data.buckets);
      })
      .catch((err) => console.warn('Could not load analytics:', err));
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 6000);
    return () => clearInterval(interval);
  }, []);

  const maxValue = metric === 'temperature' ? 40 : 100;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
            <BarChart3 size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Time-Bucket Aggregations (time_bucket)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              SELECT time_bucket('1 hour', time), AVG(...)
            </span>
          </div>
        </div>

        {/* Metric Selector */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => setMetric('temperature')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: metric === 'temperature' ? 'var(--accent-tiger)' : 'var(--bg-primary)',
              color: metric === 'temperature' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            Temperature (°C)
          </button>
          <button
            type="button"
            onClick={() => setMetric('cpu')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: metric === 'cpu' ? '#38bdf8' : 'var(--bg-primary)',
              color: metric === 'cpu' ? '#090d16' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            CPU Utilization (%)
          </button>
        </div>
      </div>

      {/* Bar Chart Bars */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.5rem',
        height: '140px',
        padding: '1rem 0.5rem 0',
        borderBottom: '1px solid var(--border-color)',
        overflowX: 'auto'
      }}>
        {buckets.map((b, i) => {
          const val = metric === 'temperature' ? b.avgTemperature : b.avgCpu;
          const heightPercent = Math.min(100, Math.max(15, (val / maxValue) * 100));

          return (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
              title={`Time: ${new Date(b.bucket).toLocaleTimeString()}\nValue: ${val}${metric === 'temperature' ? '°C' : '%'}\nSamples: ${b.samplesCount}`}
            >
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {Math.round(val)}
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  borderRadius: '4px 4px 0 0',
                  background: metric === 'temperature'
                    ? 'linear-gradient(180deg, #f97316 0%, rgba(249, 115, 22, 0.4) 100%)'
                    : 'linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.4) 100%)',
                  transition: 'height 0.3s ease'
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span>Past 16 Hours (Hourly Buckets)</span>
        <span>Generated with Timescale/Tiger Data <code>time_bucket('1 hour', time)</code></span>
      </div>
    </div>
  );
}
