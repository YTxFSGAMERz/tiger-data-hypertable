-- ============================================================================
-- 4. Fast Analytics with time_bucket() & Chunk Skipping
-- ============================================================================

-- Query 1: Downsample to 1-Hour Aggregations with time_bucket()
SELECT 
    time_bucket('1 hour', time) AS bucket,
    device_id,
    ROUND(AVG(temperature)::numeric, 2) AS avg_temp,
    ROUND(MAX(temperature)::numeric, 2) AS max_temp,
    ROUND(AVG(cpu_utilization)::numeric, 2) AS avg_cpu,
    COUNT(*) AS total_samples
FROM sensor_telemetry
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY bucket, device_id
ORDER BY bucket DESC, avg_temp DESC;

-- Query 2: Performance Proof with EXPLAIN ANALYZE (Chunk Skipping)
-- Notice how the query planner only targets chunks covering the requested time interval,
-- skipping all historical chunks completely without full table scans!
EXPLAIN ANALYZE
SELECT COUNT(*), AVG(temperature)
FROM sensor_telemetry
WHERE time > NOW() - INTERVAL '6 hours';
