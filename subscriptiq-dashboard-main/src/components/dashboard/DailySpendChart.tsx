import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface DailySpend {
    date: string;
    amount: number;
}

interface DailySpendChartProps {
    userId?: string;
}

const DailySpendChart = ({ userId }: DailySpendChartProps) => {
    const [data, setData] = useState<DailySpend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = userId ? `/analytics/daily-spend?userId=${userId}` : '/analytics/daily-spend';
                const response = await api.get(url);
                // Format date to be short (e.g., "Oct 24")
                const formattedData = response.data.map((item: DailySpend) => ({
                    ...item, // date is already YYYY-MM-DD
                    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Failed to fetch daily spend data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No payment data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                    dataKey="displayDate"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    cursor={{ stroke: '#f472b6', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#f472b6"
                    fillOpacity={1}
                    fill="url(#colorSpend2)"
                    strokeWidth={3}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#f472b6' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default DailySpendChart;
