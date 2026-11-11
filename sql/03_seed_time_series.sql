-- ============================================================================
-- 3. Ingest Sample Time-Series Dataset Across Multiple Days
-- Automatically triggers dynamic partition/chunk allocation
-- ============================================================================

INSERT INTO sensor_telemetry (time, device_id, device_type, temperature, cpu_utilization, memory_usage_mb, status_code)
SELECT
    NOW() - (i || ' minutes')::INTERVAL AS time,
    'edge-node-' || (1 + (i % 8)) AS device_id,
    CASE 
        WHEN (i % 3) = 0 THEN 'iot_sensor'
        WHEN (i % 3) = 1 THEN 'compute_cluster'
        ELSE 'gateway_router'
    END AS device_type,
    20.0 + (RANDOM() * 15.0) + SIN(i / 60.0) * 5.0 AS temperature,
    15.0 + (RANDOM() * 70.0) AS cpu_utilization,
    512.0 + (RANDOM() * 2048.0) AS memory_usage_mb,
    200 AS status_code
FROM generate_series(0, 10080) AS i; -- 7 days of per-minute time-series records

-- Inspect all auto-partitioned chunks created across time:
SELECT 
    chunk_name, 
    range_start, 
    range_end, 
    table_bytes, 
    index_bytes, 
    total_bytes
FROM timescaledb_information.chunks
WHERE hypertable_name = 'sensor_telemetry'
ORDER BY range_start DESC;
