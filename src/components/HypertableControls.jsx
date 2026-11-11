import React, { useState } from 'react';
import { Zap, Layers, RefreshCw, PlusCircle, CheckCircle2, ArrowRight, Activity, Clock, ShieldCheck } from 'lucide-react';

export default function HypertableControls({ status, onConvert, onIngest, onReset, isConverting, isIngesting }) {
  const isHyper = status?.isHypertable;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: isHyper ? 'rgba(249, 115, 22, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHyper ? '#f97316' : '#f59e0b'
          }}>
            {isHyper ? <Zap size={26} /> : <Layers size={26} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isHyper ? 'Tiger Data Hypertable (Active)' : 'Standard PostgreSQL Table'}
              </h2>
              {isHyper ? (
                <span className="badge badge-success">Auto-Partitioning Enabled</span>
              ) : (
                <span className="badge badge-warning">Non-Partitioned</span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Table: <code>{status?.tableName || 'sensor_telemetry'}</code> &bull; Partition Column: <code>{status?.timeColumn || 'time'}</code>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!isHyper ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConvert}
              disabled={isConverting}
            >
              <Zap size={18} />
              <span>{isConverting ? 'Creating Hypertable...' : 'Convert to Hypertable (SQL)'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onIngest(500)}
                disabled={isIngesting}
              >
                <PlusCircle size={16} />
                <span>+500 Events</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onIngest(2500)}
                disabled={isIngesting}
              >
                <Activity size={16} />
                <span>+2,500 Multi-Day Events</span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onReset}
                title="Reset table to standard baseline"
              >
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Total Ingested Rows
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {(status?.totalRows || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Time-series telemetry points
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Auto-Partitioned Chunks
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isHyper ? '#f97316' : 'var(--text-muted)' }}>
            {isHyper ? status?.totalChunks : '0 (Single Table)'}
          </div>
          <div style={{ fontSize: '0.725rem', color: isHyper ? '#10b981' : 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {isHyper ? 'Partitioned across time boundaries' : 'Needs create_hypertable()'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Chunk Time Interval
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {status?.chunkTimeInterval || '1 day'}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Automatic rotation threshold
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Compression Engine
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: isHyper ? '#10b981' : 'var(--text-secondary)' }}>
            {isHyper ? '92.4% Ratio' : 'None'}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Delta-of-delta & Gorilla algorithm
          </div>
        </div>
      </div>
    </div>
  );
}
