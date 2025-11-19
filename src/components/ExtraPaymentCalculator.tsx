import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  calculateAcceleratedPayoff,
  generateAmortizationSchedule,
  formatCurrency,
} from "../utils";

interface ExtraPaymentCalculatorProps {
  loanAmount: number;
  interestRate: number;
  repaymentYears: number;
}

const ExtraPaymentCalculator: React.FC<ExtraPaymentCalculatorProps> = ({
  loanAmount,
  interestRate,
  repaymentYears,
}) => {
  const [extraPayment, setExtraPayment] = useState<string>("100");

  const extraPaymentAmount = parseFloat(extraPayment) || 0;

  // Calculate standard payoff
  const standardSchedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    repaymentYears
  );

  // Calculate accelerated payoff
  const acceleratedResult = calculateAcceleratedPayoff(
    loanAmount,
    interestRate,
    repaymentYears,
    extraPaymentAmount
  );

  // Prepare data for comparison chart
  const sampleRate = Math.max(1, Math.floor(standardSchedule.length / 50));

  const chartData = standardSchedule
    .filter((_entry, index) => index % sampleRate === 0 || index === standardSchedule.length - 1)
    .map((entry) => {
      const acceleratedEntry = acceleratedResult.schedule.find(
        (e) => e.month === entry.month
      );
      return {
        month: entry.month,
        standard: entry.balance,
        accelerated: acceleratedEntry?.balance || 0,
      };
    });

  const yearsToPayoff = (acceleratedResult.monthsToPayoff / 12).toFixed(1);
  const yearsSaved = (acceleratedResult.timeSavedMonths / 12).toFixed(1);

  return (
    <div className="extra-payment-container">
      <h3 className="chart-title">What-If Scenario: Extra Payments</h3>

      <div className="extra-payment-controls">
        <div className="control-group">
          <label htmlFor="extraPayment" className="control-label">
            Extra Monthly Payment
          </label>
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              id="extraPayment"
              type="number"
              min="0"
              step="50"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              className="extra-payment-input"
            />
          </div>
        </div>
      </div>

      {extraPaymentAmount > 0 && (
        <>
          <div className="savings-summary">
            <div className="savings-grid">
              <div className="savings-card highlight">
                <div className="savings-icon">💰</div>
                <div className="savings-label">Interest Saved</div>
                <div className="savings-value success">
                  {formatCurrency(acceleratedResult.interestSaved)}
                </div>
              </div>

              <div className="savings-card highlight">
                <div className="savings-icon">⏰</div>
                <div className="savings-label">Time Saved</div>
                <div className="savings-value success">
                  {yearsSaved} years
                </div>
              </div>

              <div className="savings-card">
                <div className="savings-icon">📅</div>
                <div className="savings-label">Payoff Time</div>
                <div className="savings-value">
                  {yearsToPayoff} years
                  <span className="savings-subtext">
                    (vs {repaymentYears} years)
                  </span>
                </div>
              </div>

              <div className="savings-card">
                <div className="savings-icon">💵</div>
                <div className="savings-label">Total Paid</div>
                <div className="savings-value">
                  {formatCurrency(acceleratedResult.totalPaid)}
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-chart-container">
            <h4 className="comparison-chart-title">Payoff Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  label={{ value: "Months", position: "insideBottom", offset: -10 }}
                  tick={{ fontSize: 12, fill: "#4a5568" }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12, fill: "#4a5568" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Month ${label}`}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  name="Standard Payoff"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="accelerated"
                  stroke="#48bb78"
                  strokeWidth={2}
                  name={`With $${extraPaymentAmount} Extra`}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {extraPaymentAmount === 0 && (
        <div className="no-extra-payment-message">
          <p>Enter an extra monthly payment amount above to see potential savings!</p>
        </div>
      )}
    </div>
  );
};

export default ExtraPaymentCalculator;
