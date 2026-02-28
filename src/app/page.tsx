import Dashboard from "../components/Dashboard";

export default function Page() {
    return (
        <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 py-8 sm:py-16 text-white">

            {/* Header with terminal-style prompt */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-600">kernelboard@system:~</span>
                </div>

                <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-white flex flex-wrap items-center gap-3">
                    <span className="text-slate-400">$</span>
                    <span>Hello</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                        KernelBoard
                    </span>
                    <span className="text-2xl sm:text-3xl animate-pulse">▊</span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400 font-mono border-l-2 border-emerald-400/30 pl-4">
                    {/* Terminal-style comment */}
                    <span className="text-slate-600">#</span> Welcome to KernelBoard, your real-time system monitoring dashboard
                    <span className="block mt-1 text-xs text-slate-500">
                        Tracking CPU, Memory, Uptime & Load Average • Live updates every 2s
                    </span>
                </p>

                {/* Quick status bar */}
                <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono">
                    <span className="px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700 text-emerald-400">
                        ● LIVE
                    </span>
                    <span className="px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300">
                        🐧 Linux 7.0-rc1
                    </span>
                    <span className="px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300">
                        🔷 Go 1.26
                    </span>
                    <span className="px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300">
                        ⚡ Real-time
                    </span>
                </div>
            </div>

            {/* Dashboard Component */}
            <div className="mt-8 sm:mt-12">
                <Dashboard />
            </div>

            {/* Footer */}
            <footer className="mt-12 max-w-7xl mx-auto text-center text-xs font-mono text-slate-600 border-t border-slate-800/50 pt-6">
                <p>
                    <span className="text-emerald-400/60">kernelboard</span> © 2026 •
                    monitoring your system with ❤️ and Go routines
                </p>
            </footer>
        </main>
    );
}