import React from 'react';
import { Database, Zap, FileCode, BarChart3, FileCheck, Layers } from 'lucide-react';

export default function Navbar({ onOpenSqlModal, onOpenMLHGuide, isHypertable }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
          }}>
            <Database size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                Tiger Data Cloud Studio
              </span>
              <span className="badge badge-tiger">Challenge 1</span>
              <span className="badge badge-mlh">Builders Week</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Launch Your First Tiger Data Hypertable
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isHypertable ? (
            <span className="badge badge-success">
              <Zap size={12} />
              Hypertable Active
            </span>
          ) : (
            <span className="badge badge-warning">
              <Layers size={12} />
              Standard Table
            </span>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenSqlModal}
            title="Inspect SQL create_hypertable scripts"
          >
            <FileCode size={15} color="#f97316" />
            <span>SQL Scripts</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenMLHGuide}
            title="MLH Submission Guide & Copyable text"
          >
            <FileCheck size={15} color="#10b981" />
            <span>MLH Submission</span>
          </button>
        </div>
      </div>
    </header>
  );
}
