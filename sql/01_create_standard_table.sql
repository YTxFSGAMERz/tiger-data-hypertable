-- ============================================================================
-- 1. Create Standard PostgreSQL Table
-- Tiger Data Cloud / PostgreSQL 16+
-- ============================================================================

CREATE TABLE IF NOT EXISTS sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(64) NOT NULL,
    device_type VARCHAR(32) NOT NULL,
    temperature DOUBLE PRECISION,
    cpu_utilization DOUBLE PRECISION,
    memory_usage_mb DOUBLE PRECISION,
    status_code INT
);

-- Index on device_id for multi-attribute filtering
CREATE INDEX IF NOT EXISTS idx_sensor_telemetry_device 
ON sensor_telemetry (device_id, time DESC);
