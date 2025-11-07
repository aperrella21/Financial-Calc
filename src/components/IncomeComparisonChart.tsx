import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CalculationResult } from "../types";
import { formatCurrency } from "../utils";

interface IncomeComparisonChartProps {
  results: CalculationResult[];
}

const COLORS = ["#4299e1", "#9f7aea"];

const IncomeComparisonChart: React.FC<IncomeComparisonChartProps> = ({
  results,
}) => {
  const data = results.map((result, index) => ({
    name: `${result.career}`,
    income: result.annualIncome,
    major: result.major,
    color: COLORS[index],
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Annual Income Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-15}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12, fill: "#4a5568" }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12, fill: "#4a5568" }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(_value, entry) => (entry as unknown as { payload: { major: string } }).payload.major}
          />
          <Bar dataKey="income" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeComparisonChart;
