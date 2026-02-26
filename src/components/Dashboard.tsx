"use client";
import { useEffect, useState } from "react";
import { getCPU, getMemory } from "../lib/api";
import MetricCard from "./MetricCard";
import { CPUStats, MemoryStats } from "../types/metrics";

export default function Dashboard() {
    const [cpu, setCpu] = useState<CPUStats | null>(null);
    const [memory, setMemory] = useState<MemoryStats | null>(null);

    useEffect(() => {
        getCPU().then((data) => {
            setCpu(data)
        }).catch(console.error);
        getMemory().then((data) => {
            setMemory(data)
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
                <MetricCard title="Memory Usage" value={memory.usage_percent} unit="GB" />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}