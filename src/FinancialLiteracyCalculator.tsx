import React, { useState } from "react";
import "./FinancialLiteracyCalculator.css";  // Import the CSS file

const FinancialLiteracyCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    school: "",
    financialAid: "",
    years: "4",
    major1: "",
    major2: "",
    career1: "",
    career2: "",
    interestRate: "",
    repaymentTerm: "10",
  });

  const [results, setResults] = useState<any[] | null>(null);
  const [comparison, setComparison] = useState<string | null>(null);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number | null>(null);

  const schools = {
    "University A": 30000,
    "University B": 25000,
    "University C": 35000,
  };

  const majorsAndCareers = {
    "Computer Science": ["Software Developer", "Data Scientist", "IT Manager"],
    "Business Administration": [
      "Financial Analyst",
      "Marketing Manager",
      "Human Resources Specialist",
    ],
    "Mechanical Engineering": [
      "Mechanical Engineer",
      "Project Engineer",
      "Manufacturing Engineer",
    ],
    Nursing: ["Registered Nurse", "Nurse Practitioner", "Nurse Manager"],
    Psychology: [
      "Clinical Psychologist",
      "School Counselor",
      "Research Psychologist",
    ],
    Education: [
      "Elementary Teacher",
      "High School Teacher",
      "Education Administrator",
    ],
    English: ["Editor", "Technical Writer", "Public Relations Specialist"],
    Biology: ["Biologist", "Environmental Scientist", "Biochemist"],
    Art: ["Graphic Designer", "Art Director", "Art Teacher"],
  };

  const salaryData = {
    "Computer Science": {
      "Software Developer": 110000,
      "Data Scientist": 120000,
      "IT Manager": 140000,
    },
    "Business Administration": {
      "Financial Analyst": 75000,
      "Marketing Manager": 95000,
      "Human Resources Specialist": 65000,
    },
    "Mechanical Engineering": {
      "Mechanical Engineer": 85000,
      "Project Engineer": 80000,
      "Manufacturing Engineer": 78000,
    },
    Nursing: {
      "Registered Nurse": 75000,
      "Nurse Practitioner": 110000,
      "Nurse Manager": 95000,
    },
    Psychology: {
      "Clinical Psychologist": 85000,
      "School Counselor": 65000,
      "Research Psychologist": 90000,
    },
    Education: {
      "Elementary Teacher": 60000,
      "High School Teacher": 65000,
      "Education Administrator": 85000,
    },
    English: {
      Editor: 55000,
      "Technical Writer": 65000,
      "Public Relations Specialist": 60000,
    },
    Biology: {
      Biologist: 65000,
      "Environmental Scientist": 62000,
      Biochemist: 92000,
    },
    Art: {
      "Graphic Designer": 60000,
      "Art Director": 85000,
      "Art Teacher": 55000,
    },
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
  
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs, [name]: value };
  
      if (name === "major1") newInputs.career1 = ""; // Clear career1 if major1 changes
      if (name === "major2") newInputs.career2 = ""; // Clear career2 if major2 changes
  
      return newInputs;
    });
  };
  

  const calculateTotalLoanAmount = () => {
    const tuition = schools[inputs.school as keyof typeof schools]; // Type assertion
    const years = parseInt(inputs.years);
    const financialAid = parseFloat(inputs.financialAid) || 0;
    const totalCost = tuition * years;
    const loanAmount = totalCost - financialAid * years;
    setTotalLoanAmount(Math.max(0, loanAmount));
    return Math.max(0, loanAmount);
  };
  
  const calculateGrade = (debtToIncomeRatio: number) => {
    if (debtToIncomeRatio <= 0.5) return "A";
    if (debtToIncomeRatio <= 1) return "B";
    if (debtToIncomeRatio <= 1.5) return "C";
    if (debtToIncomeRatio <= 2) return "D";
    return "F";
  };

  const calculateResults = () => {
    const loanAmount = calculateTotalLoanAmount();
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12;
    const repaymentTerm = parseInt(inputs.repaymentTerm) * 12;

    const monthlyPayment =
      (loanAmount * interestRate * Math.pow(1 + interestRate, repaymentTerm)) /
      (Math.pow(1 + interestRate, repaymentTerm) - 1);

    const career1Income = salaryData[inputs.major1][inputs.career1];
    const career2Income = salaryData[inputs.major2][inputs.career2];

    const results = [
      {
        major: inputs.major1,
        career: inputs.career1,
        annualIncome: career1Income,
        monthlyIncome: career1Income / 12,
        monthlyPayment: monthlyPayment,
        remainingIncome: career1Income / 12 - monthlyPayment,
        debtToIncomeRatio: loanAmount / career1Income,
      },
      {
        major: inputs.major2,
        career: inputs.career2,
        annualIncome: career2Income,
        monthlyIncome: career2Income / 12,
        monthlyPayment: monthlyPayment,
        remainingIncome: career2Income / 12 - monthlyPayment,
        debtToIncomeRatio: loanAmount / career2Income,
      },
    ];

    results.forEach((result) => {
      result.grade = calculateGrade(result.debtToIncomeRatio);
    });

    setResults(results);

    const betterOption =
      results[0].debtToIncomeRatio < results[1].debtToIncomeRatio ? 0 : 1;
    const worseOption = betterOption === 0 ? 1 : 0;

    const comparisonText = `The ${
      results[betterOption].major
    } major with a career as a ${results[betterOption].career} (Grade: ${
      results[betterOption].grade
    }) appears to be a better financial choice compared to the ${
      results[worseOption].major
    } major with a career as a ${results[worseOption].career} (Grade: ${
      results[worseOption].grade
    }). The ${
      results[betterOption].major
    } option has a lower debt-to-income ratio of ${(
      results[betterOption].debtToIncomeRatio * 100
    ).toFixed(2)}% compared to ${(
      results[worseOption].debtToIncomeRatio * 100
    ).toFixed(2)}% for the ${results[worseOption].major} option.`;

    setComparison(comparisonText);
  };

  return (
    <div className="container">
      <h1 className="title">Enhanced Financial Literacy Calculator</h1>
  
      <div className="form-grid">
        <select
          name="school"
          value={inputs.school}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Select School</option>
          {Object.entries(schools).map(([school, tuition]) => (
            <option key={school} value={school}>
              {school} - ${tuition.toLocaleString()}/year
            </option>
          ))}
        </select>
  
        <input
          name="financialAid"
          type="number"
          placeholder="Annual Financial Aid"
          value={inputs.financialAid}
          onChange={handleInputChange}
          className="form-input"
        />
  
        <input
          name="years"
          type="number"
          placeholder="Years of Study"
          value={inputs.years}
          onChange={handleInputChange}
          className="form-input"
        />
  
        <select
          name="major1"
          value={inputs.major1}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Select Major 1</option>
          {Object.keys(majorsAndCareers).map((major, index) => (
            <option key={index} value={major}>
              {major}
            </option>
          ))}
        </select>
  
        <select
          name="major2"
          value={inputs.major2}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Select Major 2</option>
          {Object.keys(majorsAndCareers).map((major, index) => (
            <option key={index} value={major}>
              {major}
            </option>
          ))}
        </select>
  
        <select
          name="career1"
          value={inputs.career1}
          onChange={handleInputChange}
          className="form-select"
          disabled={!inputs.major1}
        >
          <option value="">Select Career 1</option>
          {inputs.major1 &&
            majorsAndCareers[inputs.major1].map((career, index) => (
              <option key={index} value={career}>
                {career}
              </option>
            ))}
        </select>
  
        <select
          name="career2"
          value={inputs.career2}
          onChange={handleInputChange}
          className="form-select"
          disabled={!inputs.major2}
        >
          <option value="">Select Career 2</option>
          {inputs.major2 &&
            majorsAndCareers[inputs.major2].map((career, index) => (
              <option key={index} value={career}>
                {career}
              </option>
            ))}
        </select>
  
        <input
          name="interestRate"
          type="number"
          placeholder="Interest Rate (%)"
          value={inputs.interestRate}
          onChange={handleInputChange}
          className="form-input"
        />
  
        <input
          name="repaymentTerm"
          type="number"
          placeholder="Repayment Term (years)"
          value={inputs.repaymentTerm}
          onChange={handleInputChange}
          className="form-input"
        />
  
        <button
          onClick={calculateResults}
          className="calculate-button"
        >
          Calculate
        </button>
      </div>
  
      {totalLoanAmount !== null && (
        <div className="results-container">
          <h2 className="result-title">Total Loan Amount</h2>
          <p className="result-value">${totalLoanAmount.toLocaleString()}</p>
        </div>
      )}
  
      {results && (
        <div className="results-container">
          <h2 className="result-title">Results</h2>
          <div className="grid grid-cols-2 gap-4">
            {results.map((result, index) => (
              <div key={index} className="result-card">
                <h3>{result.major} - {result.career}</h3>
                <p>Annual Income: ${result.annualIncome.toLocaleString()}</p>
                <p>Monthly Payment: ${result.monthlyPayment.toFixed(2)}</p>
                <p>Debt-to-Income Ratio: {(result.debtToIncomeRatio * 100).toFixed(2)}%</p>
                <p className={`result-grade ${result.grade}`}>Grade: {result.grade}</p>
              </div>
            ))}
          </div>
          <div className="comparison">
            <h3>Comparison:</h3>
            <p>{comparison}</p>
          </div>
        </div>
      )}
    </div>
  );
  