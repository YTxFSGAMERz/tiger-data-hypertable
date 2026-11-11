import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HypertableControls from './components/HypertableControls';
import ChunkVisualizer from './components/ChunkVisualizer';
import BenchmarkPanel from './components/BenchmarkPanel';
import TimeBucketChart from './components/TimeBucketChart';
import SqlInspectorModal from './components/SqlInspectorModal';
import MLHGuide from './components/MLHGuide';

export default function App() {
  const [status, setStatus] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isMLHGuideOpen, setIsMLHGuideOpen] = useState(false);

  const fetchStatusAndChunks = () => {
    fetch('/api/hypertable/status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.warn('Could not fetch status:', err));

    fetch('/api/hypertable/chunks')
      .then((res) => res.json())
      .then((data) => {
        if (data.chunks) setChunks(data.chunks);
      })
      .catch((err) => console.warn('Could not fetch chunks:', err));
  };

  useEffect(() => {
    fetchStatusAndChunks();
  }, []);

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const res = await fetch('/api/hypertable/convert', { method: 'POST' });
      const data = await res.json();
      fetchStatusAndChunks();
    } catch (err) {
      console.error('Failed to convert hypertable:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleIngest = async (count) => {
    setIsIngesting(true);
    try {
      await fetch('/api/hypertable/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      fetchStatusAndChunks();
    } catch (err) {
      console.error('Failed to ingest batch:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/hypertable/reset', { method: 'POST' });
      fetchStatusAndChunks();
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        isHypertable={status?.isHypertable}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenMLHGuide={() => setIsMLHGuideOpen(true)}
      />

      <main className="main-content">
        <HypertableControls
          status={status}
          onConvert={handleConvert}
          onIngest={handleIngest}
          onReset={handleReset}
          isConverting={isConverting}
          isIngesting={isIngesting}
        />

        <ChunkVisualizer
          chunks={chunks}
          isHypertable={status?.isHypertable}
        />

        <BenchmarkPanel
          isHypertable={status?.isHypertable}
        />

        <TimeBucketChart />
      </main>

      <SqlInspectorModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <MLHGuide
        isOpen={isMLHGuideOpen}
        onClose={() => setIsMLHGuideOpen(false)}
      />
    </div>
  );
}
