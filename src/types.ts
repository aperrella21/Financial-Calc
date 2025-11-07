// Type definitions for Financial Literacy Calculator

export interface School {
  name: string;
  tuition: number;
}

export interface FormInputs {
  school: string;
  financialAid: string;
  years: string;
  major1: string;
  major2: string;
  career1: string;
  career2: string;
  interestRate: string;
  repaymentTerm: string;
}

export interface CalculationResult {
  major: string;
  career: string;
  annualIncome: number;
  monthlyIncome: number;
  monthlyPayment: number;
  remainingIncome: number;
  debtToIncomeRatio: number;
  grade: string;
}

export interface ValidationErrors {
  school?: string;
  financialAid?: string;
  years?: string;
  major1?: string;
  major2?: string;
  career1?: string;
  career2?: string;
  interestRate?: string;
  repaymentTerm?: string;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
