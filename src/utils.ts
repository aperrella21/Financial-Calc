// Utility functions for Financial Literacy Calculator

import { FormInputs, ValidationErrors, Grade } from "./types";
import {
  GRADE_THRESHOLDS,
  MIN_YEARS,
  MAX_YEARS,
  MIN_INTEREST_RATE,
  MAX_INTEREST_RATE,
  MIN_REPAYMENT_TERM,
  MAX_REPAYMENT_TERM,
} from "./constants";

/**
 * Validates all form inputs and returns error messages
 */
export const validateInputs = (inputs: FormInputs): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!inputs.school) {
    errors.school = "Please select a school";
  }

  if (!inputs.financialAid) {
    errors.financialAid = "Please enter financial aid amount";
  } else if (parseFloat(inputs.financialAid) < 0) {
    errors.financialAid = "Financial aid cannot be negative";
  }

  if (!inputs.years) {
    errors.years = "Please enter years of study";
  } else {
    const years = parseInt(inputs.years);
    if (years < MIN_YEARS || years > MAX_YEARS) {
      errors.years = `Years must be between ${MIN_YEARS} and ${MAX_YEARS}`;
    }
  }

  if (!inputs.major1) {
    errors.major1 = "Please select first major";
  }

  if (!inputs.major2) {
    errors.major2 = "Please select second major";
  }

  if (!inputs.career1) {
    errors.career1 = "Please select first career";
  }

  if (!inputs.career2) {
    errors.career2 = "Please select second career";
  }

  if (!inputs.interestRate) {
    errors.interestRate = "Please enter interest rate";
  } else {
    const rate = parseFloat(inputs.interestRate);
    if (rate < MIN_INTEREST_RATE || rate > MAX_INTEREST_RATE) {
      errors.interestRate = `Interest rate must be between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%`;
    }
  }

  if (!inputs.repaymentTerm) {
    errors.repaymentTerm = "Please enter repayment term";
  } else {
    const term = parseInt(inputs.repaymentTerm);
    if (term < MIN_REPAYMENT_TERM || term > MAX_REPAYMENT_TERM) {
      errors.repaymentTerm = `Repayment term must be between ${MIN_REPAYMENT_TERM} and ${MAX_REPAYMENT_TERM} years`;
    }
  }

  return errors;
};

/**
 * Calculates grade based on debt-to-income ratio
 */
export const calculateGrade = (debtToIncomeRatio: number): Grade => {
  if (debtToIncomeRatio <= GRADE_THRESHOLDS.A) return "A";
  if (debtToIncomeRatio <= GRADE_THRESHOLDS.B) return "B";
  if (debtToIncomeRatio <= GRADE_THRESHOLDS.C) return "C";
  if (debtToIncomeRatio <= GRADE_THRESHOLDS.D) return "D";
  return "F";
};

/**
 * Calculates monthly loan payment
 * Handles edge case of 0% interest rate
 */
export const calculateMonthlyPayment = (
  loanAmount: number,
  annualInterestRate: number,
  repaymentYears: number
): number => {
  const repaymentMonths = repaymentYears * 12;

  // Handle 0% interest rate edge case
  if (annualInterestRate === 0) {
    return loanAmount / repaymentMonths;
  }

  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, repaymentMonths)) /
    (Math.pow(1 + monthlyInterestRate, repaymentMonths) - 1);

  return monthlyPayment;
};

/**
 * Formats currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Generates amortization schedule for the loan
 */
export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export const generateAmortizationSchedule = (
  loanAmount: number,
  annualInterestRate: number,
  repaymentYears: number
): AmortizationEntry[] => {
  const schedule: AmortizationEntry[] = [];
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualInterestRate,
    repaymentYears
  );
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  let remainingBalance = loanAmount;

  const totalMonths = repaymentYears * 12;

  for (let month = 1; month <= totalMonths; month++) {
    // Handle 0% interest case
    const interestPayment =
      annualInterestRate === 0 ? 0 : remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: remainingBalance,
    });
  }

  return schedule;
};

/**
 * Gets summary statistics for amortization
 */
export interface AmortizationSummary {
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
}

export const getAmortizationSummary = (
  loanAmount: number,
  annualInterestRate: number,
  repaymentYears: number
): AmortizationSummary => {
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualInterestRate,
    repaymentYears
  );
  const totalPaid = monthlyPayment * repaymentYears * 12;
  const totalInterest = totalPaid - loanAmount;

  return {
    totalPaid,
    totalInterest,
    totalPrincipal: loanAmount,
  };
};

/**
 * Calculates payoff with extra monthly payments
 */
export interface AcceleratedPayoffResult {
  monthsToPayoff: number;
  totalPaid: number;
  totalInterest: number;
  interestSaved: number;
  timeSavedMonths: number;
  schedule: AmortizationEntry[];
}

export const calculateAcceleratedPayoff = (
  loanAmount: number,
  annualInterestRate: number,
  repaymentYears: number,
  extraMonthlyPayment: number
): AcceleratedPayoffResult => {
  const standardMonthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualInterestRate,
    repaymentYears
  );
  const totalMonthlyPayment = standardMonthlyPayment + extraMonthlyPayment;
  const monthlyInterestRate = annualInterestRate / 100 / 12;

  let remainingBalance = loanAmount;
  let month = 0;
  let totalPaid = 0;
  const schedule: AmortizationEntry[] = [];
  const maxMonths = repaymentYears * 12;

  // Calculate with extra payments until loan is paid off
  while (remainingBalance > 0 && month < maxMonths * 2) {
    month++;

    const interestPayment =
      annualInterestRate === 0 ? 0 : remainingBalance * monthlyInterestRate;

    // Ensure we don't overpay on the last payment
    const payment = Math.min(totalMonthlyPayment, remainingBalance + interestPayment);
    const principalPayment = payment - interestPayment;

    totalPaid += payment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      balance: remainingBalance,
    });

    if (remainingBalance === 0) break;
  }

  const standardSummary = getAmortizationSummary(
    loanAmount,
    annualInterestRate,
    repaymentYears
  );

  return {
    monthsToPayoff: month,
    totalPaid,
    totalInterest: totalPaid - loanAmount,
    interestSaved: standardSummary.totalInterest - (totalPaid - loanAmount),
    timeSavedMonths: repaymentYears * 12 - month,
    schedule,
  };
};

