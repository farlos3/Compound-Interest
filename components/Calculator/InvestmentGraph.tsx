'use client';

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type InvestmentGraphProps = {
  data: {
    year: number;
    totalAmount: number;
    principal: number;
    interest: number;
  }[];
};

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-4 border rounded-lg shadow-md text-sm">
        <p className="font-medium mb-2">Year {label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex justify-between gap-4 items-center mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
            </div>
            <span className="font-medium">
              {typeof entry.value === "number"
                ? formatCurrency(entry.value)
                : "N/A"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function InvestmentGraph({ data }: InvestmentGraphProps) {
  const [chartView, setChartView] = useState<'cumulative' | 'breakdown'>('cumulative');

  const renderCumulativeView = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis 
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '8px' }} />
        <Line
          type="monotone"
          dataKey="totalAmount"
          name="Total Amount"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="principal"
          name="Principal"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBreakdownView = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis 
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '8px' }} />
        <Line
          type="monotone"
          dataKey="totalAmount"
          name="Total Amount"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="principal"
          name="Principal"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="interest"
          name="Interest"
          stroke="hsl(var(--chart-4))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Investment Growth</CardTitle>
          <Tabs 
            defaultValue="cumulative" 
            value={chartView}
            onValueChange={(value) => setChartView(value as 'cumulative' | 'breakdown')}
            className="h-9"
          >
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartView === 'cumulative' ? renderCumulativeView() : renderBreakdownView()}
      </CardContent>
    </Card>
  );
}