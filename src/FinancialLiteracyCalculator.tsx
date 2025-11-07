import React, { useState } from "react";
import "./FinancialLiteracyCalculator.css";
import { FormInputs, CalculationResult, ValidationErrors } from "./types";
import {
  SCHOOLS,
  MAJORS_AND_CAREERS,
  SALARY_DATA,
  DEFAULT_YEARS,
  DEFAULT_REPAYMENT_TERM,
} from "./constants";
import {
  validateInputs,
  calculateGrade,
  calculateMonthlyPayment,
  formatCurrency,
  formatPercentage,
  getAmortizationSummary,
} from "./utils";
import IncomeComparisonChart from "./components/IncomeComparisonChart";
import BudgetBreakdownChart from "./components/BudgetBreakdownChart";
import LoanPayoffChart from "./components/LoanPayoffChart";
import AmortizationTable from "./components/AmortizationTable";
import ExtraPaymentCalculator from "./components/ExtraPaymentCalculator";

const FinancialLiteracyCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<FormInputs>({
    school: "",
    financialAid: "",
    years: DEFAULT_YEARS,
    major1: "",
    major2: "",
    career1: "",
    career2: "",
    interestRate: "",
    repaymentTerm: DEFAULT_REPAYMENT_TERM,
  });

  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [comparison, setComparison] = useState<string | null>(null);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs, [name]: value };

      // Clear career selection when major changes
      if (name === "major1") newInputs.career1 = "";
      if (name === "major2") newInputs.career2 = "";

      return newInputs;
    });

    // Clear error for this field when user starts typing
    if (showErrors && errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  

  const calculateTotalLoanAmount = (): number => {
    const tuition = SCHOOLS[inputs.school];
    const years = parseInt(inputs.years);
    const financialAid = parseFloat(inputs.financialAid) || 0;
    const totalCost = tuition * years;
    const loanAmount = totalCost - financialAid * years;
    return Math.max(0, loanAmount);
  };

  const handleCalculate = () => {
    // Validate inputs
    const validationErrors = validateInputs(inputs);
    setErrors(validationErrors);
    setShowErrors(true);

    // If there are errors, don't proceed with calculation
    if (Object.keys(validationErrors).length > 0) {
      setResults(null);
      setComparison(null);
      setTotalLoanAmount(null);
      return;
    }

    // Calculate loan amount
    const loanAmount = calculateTotalLoanAmount();
    setTotalLoanAmount(loanAmount);

    // Get salary data for both careers
    const career1Income = SALARY_DATA[inputs.major1]?.[inputs.career1];
    const career2Income = SALARY_DATA[inputs.major2]?.[inputs.career2];

    // Safety check - should not happen with validation, but defensive programming
    if (!career1Income || !career2Income) {
      console.error("Invalid career income data");
      return;
    }

    // Calculate monthly payment with edge case handling
    const interestRate = parseFloat(inputs.interestRate);
    const repaymentTerm = parseInt(inputs.repaymentTerm);
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      repaymentTerm
    );

    // Build results for both career options
    const calculationResults: CalculationResult[] = [
      {
        major: inputs.major1,
        career: inputs.career1,
        annualIncome: career1Income,
        monthlyIncome: career1Income / 12,
        monthlyPayment: monthlyPayment,
        remainingIncome: career1Income / 12 - monthlyPayment,
        debtToIncomeRatio: loanAmount / career1Income,
        grade: calculateGrade(loanAmount / career1Income),
      },
      {
        major: inputs.major2,
        career: inputs.career2,
        annualIncome: career2Income,
        monthlyIncome: career2Income / 12,
        monthlyPayment: monthlyPayment,
        remainingIncome: career2Income / 12 - monthlyPayment,
        debtToIncomeRatio: loanAmount / career2Income,
        grade: calculateGrade(loanAmount / career2Income),
      },
    ];

    setResults(calculationResults);

    // Generate comparison text
    const betterOption =
      calculationResults[0].debtToIncomeRatio <
      calculationResults[1].debtToIncomeRatio
        ? 0
        : 1;
    const worseOption = betterOption === 0 ? 1 : 0;

    const comparisonText = `The ${
      calculationResults[betterOption].major
    } major with a career as a ${
      calculationResults[betterOption].career
    } (Grade: ${
      calculationResults[betterOption].grade
    }) appears to be a better financial choice compared to the ${
      calculationResults[worseOption].major
    } major with a career as a ${calculationResults[worseOption].career} (Grade: ${
      calculationResults[worseOption].grade
    }). The ${
      calculationResults[betterOption].major
    } option has a lower debt-to-income ratio of ${formatPercentage(
      calculationResults[betterOption].debtToIncomeRatio
    )} compared to ${formatPercentage(
      calculationResults[worseOption].debtToIncomeRatio
    )} for the ${calculationResults[worseOption].major} option.`;

    setComparison(comparisonText);
  };

  return (
    <div className="container">
      <h1 className="title">Financial Literacy Calculator</h1>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculate();
        }}
      >
        <div className="form-field">
          <label htmlFor="school" className="form-label">
            School
          </label>
          <select
            id="school"
            name="school"
            value={inputs.school}
            onChange={handleInputChange}
            className={`form-select ${
              showErrors && errors.school ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.school}
            aria-describedby={errors.school ? "school-error" : undefined}
          >
            <option value="">Select School</option>
            {Object.entries(SCHOOLS).map(([school, tuition]) => (
              <option key={school} value={school}>
                {school} - {formatCurrency(tuition)}/year
              </option>
            ))}
          </select>
          {showErrors && errors.school && (
            <span id="school-error" className="error-message" role="alert">
              {errors.school}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="financialAid" className="form-label">
            Annual Financial Aid
          </label>
          <input
            id="financialAid"
            name="financialAid"
            type="number"
            placeholder="0"
            value={inputs.financialAid}
            onChange={handleInputChange}
            className={`form-input ${
              showErrors && errors.financialAid ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.financialAid}
            aria-describedby={
              errors.financialAid ? "financialAid-error" : undefined
            }
          />
          {showErrors && errors.financialAid && (
            <span
              id="financialAid-error"
              className="error-message"
              role="alert"
            >
              {errors.financialAid}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="years" className="form-label">
            Years of Study
          </label>
          <input
            id="years"
            name="years"
            type="number"
            placeholder="4"
            value={inputs.years}
            onChange={handleInputChange}
            className={`form-input ${
              showErrors && errors.years ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.years}
            aria-describedby={errors.years ? "years-error" : undefined}
          />
          {showErrors && errors.years && (
            <span id="years-error" className="error-message" role="alert">
              {errors.years}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="major1" className="form-label">
            Major 1
          </label>
          <select
            id="major1"
            name="major1"
            value={inputs.major1}
            onChange={handleInputChange}
            className={`form-select ${
              showErrors && errors.major1 ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.major1}
            aria-describedby={errors.major1 ? "major1-error" : undefined}
          >
            <option value="">Select Major 1</option>
            {Object.keys(MAJORS_AND_CAREERS).map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          {showErrors && errors.major1 && (
            <span id="major1-error" className="error-message" role="alert">
              {errors.major1}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="major2" className="form-label">
            Major 2
          </label>
          <select
            id="major2"
            name="major2"
            value={inputs.major2}
            onChange={handleInputChange}
            className={`form-select ${
              showErrors && errors.major2 ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.major2}
            aria-describedby={errors.major2 ? "major2-error" : undefined}
          >
            <option value="">Select Major 2</option>
            {Object.keys(MAJORS_AND_CAREERS).map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          {showErrors && errors.major2 && (
            <span id="major2-error" className="error-message" role="alert">
              {errors.major2}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="career1" className="form-label">
            Career 1
          </label>
          <select
            id="career1"
            name="career1"
            value={inputs.career1}
            onChange={handleInputChange}
            className={`form-select ${
              showErrors && errors.career1 ? "form-error" : ""
            }`}
            disabled={!inputs.major1}
            aria-required="true"
            aria-invalid={showErrors && !!errors.career1}
            aria-describedby={errors.career1 ? "career1-error" : undefined}
          >
            <option value="">
              {inputs.major1 ? "Select Career 1" : "Select Major 1 First"}
            </option>
            {inputs.major1 &&
              MAJORS_AND_CAREERS[inputs.major1].map((career) => (
                <option key={career} value={career}>
                  {career}
                </option>
              ))}
          </select>
          {showErrors && errors.career1 && (
            <span id="career1-error" className="error-message" role="alert">
              {errors.career1}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="career2" className="form-label">
            Career 2
          </label>
          <select
            id="career2"
            name="career2"
            value={inputs.career2}
            onChange={handleInputChange}
            className={`form-select ${
              showErrors && errors.career2 ? "form-error" : ""
            }`}
            disabled={!inputs.major2}
            aria-required="true"
            aria-invalid={showErrors && !!errors.career2}
            aria-describedby={errors.career2 ? "career2-error" : undefined}
          >
            <option value="">
              {inputs.major2 ? "Select Career 2" : "Select Major 2 First"}
            </option>
            {inputs.major2 &&
              MAJORS_AND_CAREERS[inputs.major2].map((career) => (
                <option key={career} value={career}>
                  {career}
                </option>
              ))}
          </select>
          {showErrors && errors.career2 && (
            <span id="career2-error" className="error-message" role="alert">
              {errors.career2}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="interestRate" className="form-label">
            Interest Rate (%)
          </label>
          <input
            id="interestRate"
            name="interestRate"
            type="number"
            step="0.01"
            placeholder="5.5"
            value={inputs.interestRate}
            onChange={handleInputChange}
            className={`form-input ${
              showErrors && errors.interestRate ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.interestRate}
            aria-describedby={
              errors.interestRate ? "interestRate-error" : undefined
            }
          />
          {showErrors && errors.interestRate && (
            <span
              id="interestRate-error"
              className="error-message"
              role="alert"
            >
              {errors.interestRate}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="repaymentTerm" className="form-label">
            Repayment Term (years)
          </label>
          <input
            id="repaymentTerm"
            name="repaymentTerm"
            type="number"
            placeholder="10"
            value={inputs.repaymentTerm}
            onChange={handleInputChange}
            className={`form-input ${
              showErrors && errors.repaymentTerm ? "form-error" : ""
            }`}
            aria-required="true"
            aria-invalid={showErrors && !!errors.repaymentTerm}
            aria-describedby={
              errors.repaymentTerm ? "repaymentTerm-error" : undefined
            }
          />
          {showErrors && errors.repaymentTerm && (
            <span
              id="repaymentTerm-error"
              className="error-message"
              role="alert"
            >
              {errors.repaymentTerm}
            </span>
          )}
        </div>

        <button type="submit" className="calculate-button">
          Calculate
        </button>
      </form>
  
      {totalLoanAmount !== null && results && (
        <>
          <div className="results-container" role="region" aria-label="Loan Details">
            <h2 className="result-title">Total Loan Amount</h2>
            <p className="result-value">{formatCurrency(totalLoanAmount)}</p>

            {/* Loan Summary Stats */}
            <div className="loan-summary">
              {(() => {
                const summary = getAmortizationSummary(
                  totalLoanAmount,
                  parseFloat(inputs.interestRate),
                  parseInt(inputs.repaymentTerm)
                );
                return (
                  <div className="summary-cards">
                    <div className="summary-card">
                      <div className="summary-label">Total Amount Paid</div>
                      <div className="summary-value">{formatCurrency(summary.totalPaid)}</div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-label">Total Interest</div>
                      <div className="summary-value highlight-red">
                        {formatCurrency(summary.totalInterest)}
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-label">Monthly Payment</div>
                      <div className="summary-value">
                        {formatCurrency(results[0].monthlyPayment)}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Visual Comparisons Section */}
          <div className="visualizations-section">
            <h2 className="section-title">Visual Comparison</h2>

            {/* Income Comparison Chart */}
            <div className="visualization-row">
              <IncomeComparisonChart results={results} />
            </div>

            {/* Budget Breakdown Charts */}
            <div className="visualization-row two-column">
              <BudgetBreakdownChart result={results[0]} />
              <BudgetBreakdownChart result={results[1]} />
            </div>

            {/* Loan Details Section */}
            <div className="visualization-row">
              <LoanPayoffChart
                loanAmount={totalLoanAmount}
                interestRate={parseFloat(inputs.interestRate)}
                repaymentYears={parseInt(inputs.repaymentTerm)}
              />
            </div>

            <div className="visualization-row">
              <AmortizationTable
                loanAmount={totalLoanAmount}
                interestRate={parseFloat(inputs.interestRate)}
                repaymentYears={parseInt(inputs.repaymentTerm)}
              />
            </div>

            {/* Extra Payment What-If Scenarios */}
            <div className="visualization-row">
              <ExtraPaymentCalculator
                loanAmount={totalLoanAmount}
                interestRate={parseFloat(inputs.interestRate)}
                repaymentYears={parseInt(inputs.repaymentTerm)}
              />
            </div>
          </div>

          {/* Career Comparison Cards */}
          <div className="results-container" role="region" aria-label="Comparison Results">
            <h2 className="result-title">Detailed Career Analysis</h2>
            <div className="results-grid">
              {results.map((result, index) => (
                <div key={index} className="result-card">
                  <h3 className="result-card-title">
                    {result.major} - {result.career}
                  </h3>
                  <div className="result-details">
                    <p>
                      <strong>Annual Income:</strong>{" "}
                      {formatCurrency(result.annualIncome)}
                    </p>
                    <p>
                      <strong>Monthly Income:</strong>{" "}
                      {formatCurrency(result.monthlyIncome)}
                    </p>
                    <p>
                      <strong>Monthly Loan Payment:</strong>{" "}
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                    <p>
                      <strong>Remaining Income:</strong>{" "}
                      {formatCurrency(result.remainingIncome)}
                    </p>
                    <p>
                      <strong>Debt-to-Income Ratio:</strong>{" "}
                      {formatPercentage(result.debtToIncomeRatio)}
                    </p>
                    <p className={`result-grade grade-${result.grade}`}>
                      <strong>Grade:</strong> {result.grade}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="comparison">
              <h3 className="comparison-title">Financial Analysis</h3>
              <p className="comparison-text">{comparison}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialLiteracyCalculator;