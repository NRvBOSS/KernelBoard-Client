interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
}

const MetricCard = ({ title, value, unit }: MetricCardProps) => {
    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
                {value} {unit}
            </p>
        </div>
    );
};

export default MetricCard;