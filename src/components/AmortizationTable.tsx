import React, { useState } from "react";
import { generateAmortizationSchedule, formatCurrency } from "../utils";

interface AmortizationTableProps {
  loanAmount: number;
  interestRate: number;
  repaymentYears: number;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({
  loanAmount,
  interestRate,
  repaymentYears,
}) => {
  const [showAll, setShowAll] = useState(false);
  const schedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    repaymentYears
  );

  // Show first 12 months by default
  const displaySchedule = showAll ? schedule : schedule.slice(0, 12);

  return (
    <div className="amortization-container">
      <h3 className="chart-title">Loan Amortization Schedule</h3>
      <div className="amortization-table-wrapper">
        <table className="amortization-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {displaySchedule.map((entry) => (
              <tr key={entry.month}>
                <td>{entry.month}</td>
                <td>{formatCurrency(entry.payment)}</td>
                <td>{formatCurrency(entry.principal)}</td>
                <td>{formatCurrency(entry.interest)}</td>
                <td>{formatCurrency(entry.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schedule.length > 12 && (
        <button
          type="button"
          className="show-more-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? "Show Less"
            : `Show All ${schedule.length} Months`}
        </button>
      )}
    </div>
  );
};

export default AmortizationTable;
