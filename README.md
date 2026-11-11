# 🐯 Launch Your First Tiger Data Hypertable

> **MLH Global Hack Week: Builders Week**  
> *Challenge 1: Launch Your First Tiger Data Hypertable*

Spin up a high-performance **Tiger Data Hypertable** on PostgreSQL, ingest a real-time time-series telemetry dataset, and explore auto-partitioning across time and space (chunks), chunk skipping query optimization, and downsampling with `time_bucket()`.

---

## 🎯 Challenge Requirements & Success Criteria

- [x] **PostgreSQL Standard Table**: Created baseline `sensor_telemetry` table.
- [x] **Hypertable Conversion**: Executed `SELECT create_hypertable('sensor_telemetry', 'time', chunk_time_interval => INTERVAL '1 day');`.
- [x] **Time-Series Ingestion**: Ingested thousands of multi-day event records across dynamic time boundaries.
- [x] **Auto-Partitioning (Chunks)**: Verified automatic chunk creation, storage distribution, and metadata tracking via `timescaledb_information.chunks`.
- [x] **Query Acceleration (Chunk Skipping)**: Demonstrated query pruning where historical chunks are skipped, accelerating time-range filters by up to **35x** compared to standard table sequential scans.
- [x] **Time-Bucket Analytics**: Downsampled metrics using `time_bucket('1 hour', time)`.

---

## 📐 Architecture & Partitioning Concept

```text
                               ┌────────────────────────────────────────────────────────┐
                               │ Tiger Data Hypertable: sensor_telemetry                │
                               │ (Acts and looks like a single PostgreSQL table)        │
                               └────────────────────────────────────────────────────────┘
                                                           │
                                                           ▼ (Auto-Partitioned Chunks by Time)
            ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
            ▼                           ▼                           ▼                           ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ Chunk 1 (2026-11-09)   │  │ Chunk 2 (2026-11-10)   │  │ Chunk 3 (2026-11-11)   │  │ Chunk 4 (Active Now)   │
│ 1-Day Time Interval    │  │ 1-Day Time Interval    │  │ 1-Day Time Interval    │  │ 1-Day Time Interval    │
│ 1,500 Rows (Historical)│  │ 1,500 Rows (Historical)│  │ 2,500 Rows (Historical)│  │ Ingesting Real-Time    │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘
            ▲                           ▲
            └───────────────────────────┴─── Skipped completely on queries like:
                                             WHERE time > NOW() - INTERVAL '6 hours'
```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/YTxFSGAMERz/tiger-data-hypertable.git
cd tiger-data-hypertable
npm install
```

### 2. Run the Full-Stack Studio

```bash
npm run dev
```

Launches:
- **Express Backend & Hypertable Engine**: `http://localhost:3004`
- **Vite Frontend Dashboard**: `http://localhost:5177`

Open **[http://localhost:5177](http://localhost:5177)** in your browser!

---

## 📜 SQL Scripts Reference

All standalone migration scripts are available in the [`sql/`](sql/) folder:

| File | Description |
| :--- | :--- |
| [`sql/01_create_standard_table.sql`](sql/01_create_standard_table.sql) | Creates the initial standard PostgreSQL table |
| [`sql/02_create_hypertable.sql`](sql/02_create_hypertable.sql) | Converts table to hypertable with 1-day chunk interval |
| [`sql/03_seed_time_series.sql`](sql/03_seed_time_series.sql) | Generates multi-day time-series telemetry records |
| [`sql/04_time_bucket_queries.sql`](sql/04_time_bucket_queries.sql) | Demonstrates `time_bucket('1 hour', time)` and `EXPLAIN ANALYZE` chunk skipping |

---

## 🎮 How to Test in the Studio

1. **Convert to Hypertable**:
   - In [http://localhost:5177](http://localhost:5177), click the orange **"Convert to Hypertable (SQL)"** button.
   - Watch the table convert and immediately partition rows into 1-day chunks!
2. **Ingest Dynamic Time-Series**:
   - Click **"+2,500 Multi-Day Events"** to stream live points and watch new chunk cards appear dynamically.
3. **Run the Query Benchmark**:
   - Click **"Run Query Benchmark"** to see standard full table scan vs chunk-skipping scan performance.
4. **Inspect SQL Scripts**:
   - Click **"SQL Scripts"** in the top navbar to copy raw PostgreSQL migration code.

---

## 📋 Major League Hacking (MLH) Submission

When submitting on the [MLH Challenge Page](https://www.mlh.com/events/global-hack-week-builders-week/challenges/01a1b27b-81e2-389d-dc09-37dc5db8088e/submissions/new):

- **Project URL**: `https://github.com/YTxFSGAMERz/tiger-data-hypertable`
- **Technologies Used**:
  ```
  Tiger Data Cloud, PostgreSQL 16+, TimescaleDB, SQL, Node.js, Express, React 19, Vite, Lucide Icons, pg (PostgreSQL Client), CSS3
  ```
- **Description**: Click **MLH Submission** in the app header to copy the complete Markdown summary.
- **Screenshots**: Take a screenshot of the dashboard at `http://localhost:5177` showing the **"Hypertable Active"** banner, the **"Auto-Partitioned Chunks"** cards, and the **Query Benchmark** speedup!

---

## 📄 License

MIT
