"use client";

import { useEffect, useState } from "react";
import { getCPU, getLoad, getMemory, getUptime } from "../lib/api";
import MetricCard from "./MetricCard";
import { CPUStats, LoadStats, MemoryStats, UptimeStats } from "../types/metrics";

// Static values for deterministic rendering
const PIDS = [1234, 5678, 9012, 3456, 7890, 2345, 6789, 4321, 8765, 2468];

export default function Dashboard() {
    const [cpu, setCpu] = useState<CPUStats | null>(null);
    const [memory, setMemory] = useState<MemoryStats | null>(null);
    const [uptime, setUptime] = useState<UptimeStats | null>(null);
    const [load, setLoad] = useState<LoadStats | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [bootTime, setBootTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [cpuData, memoryData, uptimeData, loadData] = await Promise.all([
                    getCPU(),
                    getMemory(),
                    getUptime(),
                    getLoad(),
                ]);

                setCpu(cpuData);
                setMemory(memoryData);
                setUptime(uptimeData);
                setLoad(loadData);
                setLastUpdated(new Date());

                // Calculate boot time only once when we first get uptime data
                if (uptimeData && !bootTime) {
                    const now = new Date();
                    const boot = new Date(now.getTime() - uptimeData.uptimeseconds * 1000);
                    setBootTime(boot);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchAll();
        const interval = setInterval(fetchAll, 2000);

        return () => clearInterval(interval);
    }, [bootTime]); // Add bootTime to dependency array

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hrs = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hrs}h ${mins}m`;
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const getLoadColor = (load1: number, cores: number) => {
        const perCoreLoad = load1 / cores;
        if (perCoreLoad > 0.7) return 85; // High load
        if (perCoreLoad > 0.4) return 60;  // Medium load
        return 30;                          // Low load
    };

    // Format boot time consistently
    const getBootTimeString = () => {
        if (!bootTime) return "calculating...";

        // Format as time only (HH:MM:SS AM/PM)
        return bootTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Get deterministic PID based on some stable value
    const getDeterministicPID = () => {
        const now = new Date();
        const minuteHash = now.getMinutes() + now.getHours() * 60;
        return PIDS[minuteHash % PIDS.length];
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
            {/* Header with system info */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl">🐧</span>
                        <h1 className="text-2xl font-mono font-bold text-white">
                            Kernel<span className="text-blue-500">/</span>Go
                        </h1>
                        <span className="text-2xl">🔷</span>
                    </div>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <div className="flex items-center space-x-2 text-sm font-mono">
                        <span className="text-gray-500">$</span>
                        <span className="text-gray-400">system_monitor</span>
                        <span className="text-gray-600">--live</span>
                    </div>
                </div>

                {/* Last updated indicator */}
                <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-400 font-mono">live</span>
                    </div>
                    <span className="text-gray-600 font-mono text-xs">
                        {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cpu && (
                    <MetricCard
                        title="CPU Usage"
                        value={cpu.usage.toFixed(1)}
                        unit="%"
                        subtitle={`${cpu.cores} cores`}
                        percent={cpu.usage}
                        projectType="kernel"
                        icon="⚡"
                    />
                )}

                {memory && (
                    <MetricCard
                        title="Memory Usage"
                        value={memory.usage_percent}
                        unit="%"
                        subtitle={`${memory.used_gb} / ${memory.total_gb} GB`}
                        percent={memory.usage_percent}
                        projectType="system"
                        icon="🧠"
                    />
                )}

                {uptime && (
                    <MetricCard
                        title="System Uptime"
                        value={formatUptime(uptime.uptimeseconds)}
                        subtitle={`since ${getBootTimeString()}`}
                        projectType="linux"
                        icon="⏰"
                    />
                )}

                {load && (
                    <MetricCard
                        title="Load Average"
                        value={`${load.load1.toFixed(2)}`}
                        unit="1m"
                        subtitle={`${load.load5.toFixed(2)} / ${load.load15.toFixed(2)} (${load.cores} cores)`}
                        percent={getLoadColor(load.load1, load.cores)}
                        projectType="go"
                        icon="📊"
                    />
                )}
            </div>

            {/* System Info Footer */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <SystemInfoTile
                    label="Kernel Version"
                    value="6.1.0-18-amd64"
                    icon="🐧"
                />
                <SystemInfoTile
                    label="Go Version"
                    value="1.22.2"
                    icon="🔷"
                />
                <SystemInfoTile
                    label="Architecture"
                    value="x86_64"
                    icon="💻"
                />
                <SystemInfoTile
                    label="Hostname"
                    value="kernel-go-server"
                    icon="🖥️"
                />
            </div>

            {/* Terminal-style status bar */}
            <div className="mt-6 p-3 bg-gray-950/50 rounded-lg border border-gray-800 font-mono text-xs">
                <div className="flex items-center space-x-4 text-gray-500">
                    <span>───</span>
                    <span className="text-green-500">●</span>
                    <span>system ready |</span>
                    <span>metrics @ 2s |</span>
                    <span>pid: {getDeterministicPID()} |</span>
                    <span className="text-blue-400">goroutines: 24</span>
                </div>
            </div>
        </div>
    );
}

// Helper component for system info tiles
const SystemInfoTile = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors">
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-xl">{icon}</span>
            <div>
                <p className="text-xs font-mono text-gray-500">{label}</p>
                <p className="text-sm font-mono text-gray-300">{value}</p>
            </div>
        </div>
    </div>
);