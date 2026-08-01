/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

// Shadcn dynamic theme binding
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "#0f172a", // Dark blue-gray for light mode
      dark: "#f8fafc", // Off-white for dark mode
    },
  },
  sessions: {
    label: "Sessions",
    theme: {
      light: "#94a3b8", // Muted slate
      dark: "#475569", // Deeper slate
    },
  },
} satisfies ChartConfig;

function StatBadge({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
        {label}
      </span>
      <span
        className={`text-2xl font-head tracking-tight ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

export function TutorAnalyticsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const totalRevenue = data.reduce((sum, d) => sum + (d.revenue ?? 0), 0);
  const totalSessions = data.reduce((sum, d) => sum + (d.sessions ?? 0), 0);
  const avgRevenue = Math.round(totalRevenue / data.length) || 0;

  return (
    <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col gap-8 transition-all hover:shadow-md">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-8 divide-x divide-border w-full sm:w-auto">
          <StatBadge
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            highlight
          />

          <div className="mx-5 sm:mx-8 h-12 w-px bg-border/80 shrink-0" />

          <StatBadge
            label="Monthly Avg"
            value={`$${avgRevenue.toLocaleString()}`}
          />

          <div className="mx-5 sm:mx-8 h-12 w-px bg-border/80 shrink-0" />

          <StatBadge
            label="Total Sessions"
            value={totalSessions.toLocaleString()}
          />
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="w-full h-[350px]">
        {/* 👉 Upgraded from BarChart to ComposedChart for mixed geometry! */}
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Custom SVG Gradient for the Area Chart */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            className="stroke-border opacity-50"
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={12}
            axisLine={false}
            tick={{ fontSize: 11, fontWeight: 600 }}
          />

          {/* Left Y-Axis (Revenue) */}
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
            }
            tick={{ fontSize: 11, fontWeight: 500 }}
          />

          {/* Right Y-Axis (Sessions) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fontWeight: 500 }}
          />

          <ChartTooltip
            cursor={{
              stroke: "var(--color-revenue)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
              opacity: 0.5,
            }}
            content={
              <ChartTooltipContent className="rounded-2xl border-border bg-background/95 backdrop-blur-md shadow-xl p-3" />
            }
          />

          <ChartLegend
            content={<ChartLegendContent />}
            className="mt-4 text-[11px] font-bold uppercase tracking-widest"
          />

          {/* 👉 Bar Chart for Sessions (Sits in the background) */}
          <Bar
            yAxisId="right"
            dataKey="sessions"
            fill="var(--color-sessions)"
            fillOpacity={0.3}
            radius={[6, 6, 0, 0]}
            maxBarSize={24}
          />

          {/* 👉 Area Chart for Revenue (Smooth, glowing line over the bars) */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-revenue)" }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
