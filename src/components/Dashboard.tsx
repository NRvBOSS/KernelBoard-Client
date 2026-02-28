"use client";
import { useEffect, useState } from "react";
import { getCPU, getDisk, getLoad, getMemory, getUptime } from "../lib/api";
import MetricCard from "./MetricCard";
import { CPUStats, DiskStats, LoadStats, MemoryStats, UptimeStats } from "../types/metrics";

export default function Dashboard() {
    const [cpu, setCpu] = useState<CPUStats | null>(null);
    const [memory, setMemory] = useState<MemoryStats | null>(null);
    const [disk, setDisk] = useState<DiskStats | null>(null);
    const [uptime, setUptime] = useState<UptimeStats | null>(null);
    const [load, setLoad] = useState<LoadStats | null>(null);

    useEffect(() => {
        getCPU().then((data) => {
            setCpu(data)
        }).catch(console.error);
        getMemory().then((data) => {
            setMemory(data)
        }).catch(console.error);
        getDisk().then((data) => {
            setDisk(data)
        }).catch(console.error);
        getUptime().then((data) => {
            setUptime(data)
        }).catch(console.error);
        getLoad().then((data) => {
            setLoad(data)
        }).catch(console.error);
    }, []);
    return (
        <div>
            {cpu ? (
                <MetricCard title="CPU Usage" value={cpu.usage.toFixed(2)} unit="%" />
            ) : (
                <p>Loading...</p>
            )}
            {memory ? (
                <MetricCard title="Memory Usage" value={memory.total_gb} unit="GB" />
            ) : (
                <p>Loading...</p>
            )}
            {disk ? (
                <MetricCard title="Disk Usage" value={disk.usage_percent.toFixed(2)} unit="%" />
            ) : (
                <p>Loading...</p>
            )}
            {uptime ? (
                <MetricCard title="Uptime" value={uptime.uptime_hours.toFixed(2)} unit="hours" />
            ) : (
                <p>Loading...</p>
            )}
            {load ? (
                <MetricCard title="Load (1m)" value={load.load1} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}