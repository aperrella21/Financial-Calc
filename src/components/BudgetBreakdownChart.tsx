import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CalculationResult } from "../types";
import { formatCurrency } from "../utils";

interface BudgetBreakdownChartProps {
  result: CalculationResult;
}

const COLORS = {
  loanPayment: "#e53e3e",
  remainingIncome: "#48bb78",
};

const BudgetBreakdownChart: React.FC<BudgetBreakdownChartProps> = ({
  result,
}) => {
  const data = [
    {
      name: "Loan Payment",
      value: result.monthlyPayment,
      color: COLORS.loanPayment,
    },
    {
      name: "Remaining Income",
      value: Math.max(0, result.remainingIncome),
      color: COLORS.remainingIncome,
    },
  ];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        Monthly Budget - {result.major} ({result.career})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              const item = data.find((d) => d.name === value);
              return `${value}: ${formatCurrency(item?.value || 0)}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetBreakdownChart;
