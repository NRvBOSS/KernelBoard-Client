export interface CPUStats {
    usage: number;
    cores: number;
}

export interface MemoryStats {
    total_gb: number;
    used_gb: number,
    free_gb: number;
    usage_percent: number
}

export interface UptimeStats {
    uptimeseconds: number;
    uptimehours: number;
}

export interface LoadStats {
    load1: number;
    load5: number;
    load15: number;
    cores: number;
}