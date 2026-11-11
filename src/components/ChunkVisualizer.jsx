import React from 'react';
import { Layers, Clock, Database, HardDrive, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ChunkVisualizer({ chunks, isHypertable }) {
  if (!isHypertable || chunks.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: '#f59e0b'
        }}>
          <Layers size={26} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Table is currently a Standard PostgreSQL Table
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
          All data resides in a single unpartitioned flat table. Click <strong>"Convert to Hypertable"</strong> above to trigger auto-partitioning across time and watch Tiger Data generate dynamic chunks!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
            <Layers size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hypertable Auto-Partitioned Chunks</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              Dynamic time-series intervals managed by Tiger Data
            </span>
          </div>
        </div>
        <span className="badge badge-tiger">
          {chunks.length} Active Chunks
        </span>
      </div>

      {/* Grid of Chunk Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {chunks.map((chunk, idx) => {
          const isLatest = idx === 0;

          return (
            <div
              key={chunk.chunkName}
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: `1.5px solid ${isLatest ? 'rgba(249, 115, 22, 0.6)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: isLatest ? '0 0 15px rgba(249, 115, 22, 0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f97316', fontSize: '0.85rem' }}>
                  {chunk.chunkName}
                </span>
                {isLatest ? (
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    Active Ingestion
                  </span>
                ) : (
                  <span className="badge badge-tiger" style={{ fontSize: '0.65rem' }}>
                    Historical Partition
                  </span>
                )}
              </div>

              {/* Time Range */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={13} color="#94a3b8" />
                  <span>Start: <strong>{new Date(chunk.rangeStart).toLocaleDateString()} {new Date(chunk.rangeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={13} color="#94a3b8" />
                  <span>End: <strong>{new Date(chunk.rangeEnd).toLocaleDateString()} {new Date(chunk.rangeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
              </div>

              {/* Row Count & Storage Bytes */}
              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Rows: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{chunk.rowCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Size: </span>
                  <strong style={{ color: '#38bdf8' }}>{Math.round((chunk.tableBytes + chunk.indexBytes) / 1024)} KB</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
