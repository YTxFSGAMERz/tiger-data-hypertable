import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';

const SQL_SCRIPTS = [
  {
    title: '1. Create Standard Table',
    filename: '01_create_standard_table.sql',
    code: `-- 1. Create standard PostgreSQL table
CREATE TABLE IF NOT EXISTS sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(64) NOT NULL,
    device_type VARCHAR(32) NOT NULL,
    temperature DOUBLE PRECISION,
    cpu_utilization DOUBLE PRECISION,
    memory_usage_mb DOUBLE PRECISION,
    status_code INT
);

CREATE INDEX IF NOT EXISTS idx_sensor_telemetry_device 
ON sensor_telemetry (device_id, time DESC);`
  },
  {
    title: '2. Convert to Hypertable',
    filename: '02_create_hypertable.sql',
    code: `-- 2. Convert to Tiger Data Hypertable (Auto-partitioning across time)
SELECT create_hypertable(
    'sensor_telemetry',
    'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Inspect Hypertable metadata
SELECT hypertable_schema, hypertable_name, num_dimensions, num_chunks
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'sensor_telemetry';`
  },
  {
    title: '3. Ingest Time-Series Dataset',
    filename: '03_seed_time_series.sql',
    code: `-- 3. Insert 7 days of time-series records (triggers auto-partition creation)
INSERT INTO sensor_telemetry (time, device_id, device_type, temperature, cpu_utilization, memory_usage_mb, status_code)
SELECT
    NOW() - (i || ' minutes')::INTERVAL AS time,
    'edge-node-' || (1 + (i % 8)) AS device_id,
    'iot_sensor' AS device_type,
    20.0 + (RANDOM() * 15.0) AS temperature,
    15.0 + (RANDOM() * 70.0) AS cpu_utilization,
    1024.0 + (RANDOM() * 1024.0) AS memory_usage_mb,
    200 AS status_code
FROM generate_series(0, 10080) AS i;`
  },
  {
    title: '4. Fast Analytics with time_bucket()',
    filename: '04_time_bucket_queries.sql',
    code: `-- 4. Downsample with time_bucket() & verify Chunk Skipping
SELECT 
    time_bucket('1 hour', time) AS bucket,
    device_id,
    ROUND(AVG(temperature)::numeric, 2) AS avg_temp,
    ROUND(AVG(cpu_utilization)::numeric, 2) AS avg_cpu,
    COUNT(*) AS total_samples
FROM sensor_telemetry
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY bucket, device_id
ORDER BY bucket DESC;`
  }
];

export default function SqlInspectorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentScript = SQL_SCRIPTS[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Tiger Data SQL Scripts & Migrations
              </h2>
              <span className="badge badge-tiger">PostgreSQL 16+</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Complete SQL scripts to launch and query your first Tiger Data Hypertable
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '0.5rem', lineHeight: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          {SQL_SCRIPTS.map((script, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: activeTab === idx ? 'var(--accent-tiger)' : 'var(--bg-primary)',
                color: activeTab === idx ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {script.title}
            </button>
          ))}
        </div>

        {/* Script Code Block */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ color: '#38bdf8' }}>{currentScript.filename}</span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleCopy}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied SQL' : 'Copy Script'}</span>
            </button>
          </div>
          <pre style={{
            padding: '1.25rem',
            margin: 0,
            fontSize: '0.825rem',
            color: '#f8fafc',
            overflowX: 'auto',
            lineHeight: 1.6
          }}>
            {currentScript.code}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
