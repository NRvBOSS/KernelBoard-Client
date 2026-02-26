import Dashboard from "../components/Dashboard";


export default function Page() {
    return (
        <main>
            <h1>Hello KernelBoard</h1>
            <p>Welcome to KernelBoard, your system monitoring dashboard.</p>
            <p>Navigate to the <a href="/dashboard">Dashboard</a> to view real-time CPU and Memory usage.</p>
            <Dashboard />
        </main>
    )
}