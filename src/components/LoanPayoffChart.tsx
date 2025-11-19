import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { generateAmortizationSchedule, formatCurrency } from "../utils";

interface LoanPayoffChartProps {
  loanAmount: number;
  interestRate: number;
  repaymentYears: number;
}

const LoanPayoffChart: React.FC<LoanPayoffChartProps> = ({
  loanAmount,
  interestRate,
  repaymentYears,
}) => {
  const schedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    repaymentYears
  );

  // Sample data points for visualization (every 12 months or all if less than 2 years)
  const sampleRate = repaymentYears <= 2 ? 1 : 12;
  const data = schedule
    .filter((_entry, index) => index % sampleRate === 0 || index === schedule.length - 1)
    .map((entry) => ({
      year: (entry.month / 12).toFixed(1),
      balance: entry.balance,
      month: entry.month,
    }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Loan Balance Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4299e1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            label={{ value: "Years", position: "insideBottom", offset: -10 }}
            tick={{ fontSize: 12, fill: "#4a5568" }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12, fill: "#4a5568" }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#4299e1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
            name="Remaining Balance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanPayoffChart;
