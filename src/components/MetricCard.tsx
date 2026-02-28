interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    percent?: number;
    projectType?: 'kernel' | 'go' | 'linux' | 'system';
    icon?: React.ReactNode;
}

// Static values for deterministic rendering
const KERNEL_VERSIONS = ['5.15', '6.1', '6.6', '6.8', '6.10'];
const GO_VERSIONS = ['1.21', '1.22', '1.23'];
const PIDS = [1234, 5678, 9012, 3456, 7890, 2345, 6789];

const MetricCard = ({
    title,
    value,
    unit,
    subtitle,
    percent,
    projectType = 'system',
    icon,
}: MetricCardProps) => {

    const getColor = () => {
        if (percent === undefined) return "text-yellow-400 dark:text-gray-100";
        if (percent > 80) return "text-red-500";
        if (percent > 50) return "text-yellow-500";
        return "text-green-500";
    };

    const getProjectTypeStyles = () => {
        switch (projectType) {
            case 'kernel':
                return {
                    border: 'border-l-4 border-l-orange-500',
                    badge: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
                    accent: 'orange',
                    icon: '🐧'
                };
            case 'go':
                return {
                    border: 'border-l-4 border-l-cyan-500',
                    badge: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300',
                    accent: 'cyan',
                    icon: '🔷'
                };
            case 'linux':
                return {
                    border: 'border-l-4 border-l-yellow-600',
                    badge: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
                    accent: 'yellow',
                    icon: '⚡'
                };
            default:
                return {
                    border: 'border-l-4 border-l-gray-500',
                    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                    accent: 'gray',
                    icon: '💻'
                };
        }
    };

    const projectStyles = getProjectTypeStyles();

    // Use deterministic values based on title to ensure consistency
    const getDeterministicVersion = (type: 'kernel' | 'go') => {
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        if (type === 'kernel') {
            const index = hash % KERNEL_VERSIONS.length;
            return KERNEL_VERSIONS[index];
        } else {
            const index = hash % GO_VERSIONS.length;
            return GO_VERSIONS[index];
        }
    };

    const getDeterministicPID = () => {
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return PIDS[hash % PIDS.length];
    };

    return (
        <div className={`bg-linear-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-500 border border-gray-700 ${projectStyles.border} relative overflow-hidden group`}>

            {/* Terminal-style header */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-950/50 flex items-center px-4 space-x-2 border-b border-gray-700">
                <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2 font-mono">~/metrics</span>
            </div>

            {/* Project type indicator */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform">
                        {icon || projectStyles.icon}
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 rounded ${projectStyles.badge} border border-current/20`}>
                        {projectType.toUpperCase()}
                    </span>
                </div>

                {/* System status indicator */}
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 font-mono">active</span>
                </div>
            </div>

            {/* Main content */}
            <div className="mt-4">
                <h3 className="text-sm font-mono text-gray-400 flex items-center space-x-2">
                    <span className="text-gray-600">$</span>
                    <span>{title}</span>
                </h3>

                <div className="mt-2 flex items-baseline space-x-2">
                    <p className={`text-4xl font-bold font-mono tracking-tight ${getColor()}`}>
                        {value}
                    </p>
                    {unit && (
                        <span className="text-gray-500 text-sm font-mono">
                            {unit}
                        </span>
                    )}
                </div>

                {subtitle && (
                    <p className="text-xs font-mono text-gray-500 mt-2 flex items-center space-x-2">
                        <span className="text-gray-700">#</span>
                        <span>{subtitle}</span>
                    </p>
                )}
            </div>

            {/* Progress bar with kernel/Go styling */}
            {percent !== undefined && (
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-500">progress</span>
                        <span className={`
                ${projectType === 'kernel' ? 'text-orange-400' : ''}
                ${projectType === 'go' ? 'text-cyan-400' : ''}
                ${projectType === 'linux' ? 'text-yellow-400' : ''}
                ${projectType === 'system' ? 'text-blue-400' : ''}
            `}>
                            {percent}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className={`
                    h-2 rounded-full transition-all duration-700 relative
                    ${projectType === 'kernel' ? 'bg-linear-to-r from-orange-500 to-orange-400' : ''}
                    ${projectType === 'go' ? 'bg-linear-to-r from-cyan-500 to-cyan-400' : ''}
                    ${projectType === 'linux' ? 'bg-linear-to-r from-yellow-500 to-yellow-400' : ''}
                    ${projectType === 'system' ? 'bg-linear-to-r from-blue-500 to-blue-400' : ''}
                `}
                            style={{ width: `${percent}%` }}
                        >
                            {/* Animated scan line effect */}
                            <div className="absolute top-0 bottom-0 w-20 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Kernel/Go version indicator - now deterministic */}
            <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between text-xs font-mono text-gray-600">
                <span>v{getDeterministicVersion('kernel')}</span>
                <span>go{getDeterministicVersion('go')}</span>
                <span>PID: {getDeterministicPID()}</span>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                <pre className="text-xs font-mono text-white">
                    {`{...}`}
                </pre>
            </div>
        </div>
    );
};

export default MetricCard;