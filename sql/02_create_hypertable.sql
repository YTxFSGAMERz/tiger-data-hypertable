-- ============================================================================
-- 2. Convert Standard Table into a Tiger Data Hypertable
-- Unlocks auto-partitioning across time and space (chunks)
-- ============================================================================

SELECT create_hypertable(
    'sensor_telemetry',
    'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Inspect Hypertable Metadata in Tiger Data / Timescale catalog
SELECT hypertable_schema, hypertable_name, owner, num_dimensions, num_chunks
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'sensor_telemetry';
