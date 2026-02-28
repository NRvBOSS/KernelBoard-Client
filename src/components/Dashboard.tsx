"use client";

import { useEffect, useState } from "react";
import { getCPU, getLoad, getMemory, getUptime, getSystem } from "../lib/api";
import MetricCard from "./MetricCard";
import { CPUStats, LoadStats, MemoryStats, UptimeStats, SystemStats } from "../types/metrics";

// Static values for deterministic rendering
const PIDS = [1234, 5678, 9012, 3456, 7890, 2345, 6789, 4321, 8765, 2468];

export default function Dashboard() {
    const [cpu, setCpu] = useState<CPUStats | null>(null);
    const [memory, setMemory] = useState<MemoryStats | null>(null);
    const [uptime, setUptime] = useState<UptimeStats | null>(null);
    const [load, setLoad] = useState<LoadStats | null>(null);
    const [systemInfo, setSystemInfo] = useState<SystemStats | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [bootTime, setBootTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [cpuData, memoryData, uptimeData, loadData, systemData] = await Promise.all([
                    getCPU(),
                    getMemory(),
                    getUptime(),
                    getLoad(),
                    getSystem(),
                ]);

                console.log("Uptime data:", uptimeData); // Debug üçün

                setCpu(cpuData);
                setMemory(memoryData);
                setUptime(uptimeData);
                setLoad(loadData);
                setSystemInfo(systemData);
                setLastUpdated(new Date());

                // Uptime datasını yoxla - uptime_seconds istifadə et!
                if (uptimeData && uptimeData.uptime_seconds) {
                    const now = new Date();
                    const boot = new Date(now.getTime() - uptimeData.uptime_seconds * 1000);
                    setBootTime(boot);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchAll();
        const interval = setInterval(fetchAll, 2000);

        return () => clearInterval(interval);
    }, []); // bootTime dependency-ni çıxart

    const formatUptime = (seconds: number | undefined) => {
        if (!seconds || isNaN(seconds) || seconds < 0) {
            return "0m";
        }

        const days = Math.floor(seconds / 86400);
        const hrs = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hrs}h ${mins}m`;
        if (hrs > 0) return `${hrs}h ${mins}m`;
        if (mins > 0) return `${mins}m`;
        return "< 1m";
    };

    const getLoadColor = (load1: number, cores: number) => {
        if (!load1 || !cores) return 0;
        const perCoreLoad = load1 / cores;
        if (perCoreLoad > 0.7) return 85;
        if (perCoreLoad > 0.4) return 60;
        return 30;
    };

    const getBootTimeString = () => {
        if (!bootTime) return ""; // Boş qaytar, heç nə göstərmə

        // Invalid Date yoxlaması
        if (isNaN(bootTime.getTime())) {
            return "";
        }

        try {
            return bootTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return "";
        }
    };

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
                            <span className="text-emerald-400">{systemInfo?.hostname || 'kernel'}</span>
                            <span className="text-blue-500">/</span>Go
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
                    {lastUpdated && (
                        <span className="text-gray-600 font-mono text-xs">
                            {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cpu && cpu.usage !== undefined ? (
                    <MetricCard
                        title="CPU Usage"
                        value={cpu.usage.toFixed(1)}
                        unit="%"
                        subtitle={`${cpu.cores || '?'} cores`}
                        percent={cpu.usage}
                        projectType="kernel"
                        icon="⚡"
                    />
                ) : (
                    <MetricCard
                        title="CPU Usage"
                        value="..."
                        unit="%"
                        subtitle="loading"
                        projectType="kernel"
                        icon="⚡"
                    />
                )}

                {memory && memory.usage_percent !== undefined ? (
                    <MetricCard
                        title="Memory Usage"
                        value={memory.usage_percent}
                        unit="%"
                        subtitle={`${memory.used_gb || '0'} / ${memory.total_gb || '0'} GB`}
                        percent={memory.usage_percent}
                        projectType="system"
                        icon="🧠"
                    />
                ) : (
                    <MetricCard
                        title="Memory Usage"
                        value="..."
                        unit="%"
                        subtitle="loading"
                        projectType="system"
                        icon="🧠"
                    />
                )}

                {uptime && uptime.uptime_seconds ? (
                    <MetricCard
                        title="System Uptime"
                        value={formatUptime(uptime.uptime_seconds)}
                        subtitle={getBootTimeString() ? `since ${getBootTimeString()}` : ""}
                        projectType="linux"
                        icon="⏰"
                    />
                ) : (
                    <MetricCard
                        title="System Uptime"
                        value="..."
                        subtitle="loading"
                        projectType="linux"
                        icon="⏰"
                    />
                )}

                {load && load.load1 !== undefined ? (
                    <MetricCard
                        title="Load Average"
                        value={load.load1.toFixed(2)}
                        unit="1m"
                        subtitle={`${load.load5?.toFixed(2) || '0'} / ${load.load15?.toFixed(2) || '0'} (${load.cores || '?'} cores)`}
                        percent={getLoadColor(load.load1, load.cores || 1)}
                        projectType="go"
                        icon="📊"
                    />
                ) : (
                    <MetricCard
                        title="Load Average"
                        value="..."
                        unit="1m"
                        subtitle="loading"
                        projectType="go"
                        icon="📊"
                    />
                )}
            </div>

            {/* System Info Footer */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <SystemInfoTile
                    label="Kernel Version"
                    value={systemInfo?.kernel_version || '6.1.0'}
                    icon="🐧"
                />
                <SystemInfoTile
                    label="Go Version"
                    value={systemInfo?.go_version || '1.22.2'}
                    icon="🔷"
                />
                <SystemInfoTile
                    label="Architecture"
                    value={systemInfo?.architecture || 'x86_64'}
                    icon="💻"
                />
                <SystemInfoTile
                    label="Hostname"
                    value={systemInfo?.hostname || 'kernel-go-server'}
                    icon="🖥️"
                />
            </div>

            {/* Terminal-style status bar */}
            <div className="mt-6 p-3 bg-gray-950/50 rounded-lg border border-gray-800 font-mono text-xs">
                <div className="flex items-center space-x-4 text-gray-500">
                    <span>───</span>
                    <span className="text-green-500">●</span>
                    <span>system {uptime ? 'ready' : 'starting'} |</span>
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
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors group">
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
            <div>
                <p className="text-xs font-mono text-gray-500">{label}</p>
                <p className="text-sm font-mono text-gray-300 truncate max-w-60" title={value}>
                    {value}
                </p>
            </div>
        </div>
    </div>
);