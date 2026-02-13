"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  new_lead: "#f59e0b",
  contacted: "#3b82f6",
  engaged: "#8b5cf6",
  qualified: "#06b6d4",
  negotiation: "#ec4899",
  converted: "#22c55e",
  dormant: "#94a3b8",
};

const STATUS_LABELS: Record<string, string> = {
  new_lead: "New lead",
  contacted: "Contacted",
  engaged: "Engaged",
  qualified: "Qualified",
  negotiation: "Negotiation",
  converted: "Converted",
  dormant: "Dormant",
};

type PipelineData = { status: string; label: string; count: number };
type TimeSeriesData = { date: string; contacts: number };
type SourceData = { source: string; count: number };

export function AnalyticsCharts({
  pipelineData,
  leadsOverTime,
  sourceData,
}: {
  pipelineData: PipelineData[];
  leadsOverTime: TimeSeriesData[];
  sourceData: SourceData[];
}) {
  const pipelineChartData = pipelineData.map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] ?? "#94a3b8",
  }));

  return (
    <div className="space-y-8">
      {/* Pipeline bar chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Pipeline by status
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pipelineChartData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis
                type="category"
                dataKey="label"
                width={70}
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => v}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number | undefined) => [value ?? 0, "Contacts"]}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline donut */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Pipeline distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineChartData}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    (percent ?? 0) > 0.05 ? `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)` : ""
                  }
                >
                  {pipelineChartData.filter((d) => d.count > 0).map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined, name?: string) => [
                    value ?? 0,
                    `${name ?? ""} (${value ?? 0} contacts)`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads over time */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            New contacts (last 30 days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={leadsOverTime}
                margin={{ top: 5, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [value ?? 0, "Contacts"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="contacts"
                  stroke="#ef641c"
                  strokeWidth={2}
                  dot={{ fill: "#ef641c", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Source breakdown */}
      {sourceData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Contacts by source
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="source"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(v: string) =>
                    v.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
                  }
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [value ?? 0, "Contacts"]}
                />
                <Bar
                  dataKey="count"
                  fill="#ef641c"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
