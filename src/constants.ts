// Constants for Financial Literacy Calculator

export const SCHOOLS: Record<string, number> = {
  "University A": 30000,
  "University B": 25000,
  "University C": 35000,
};

export const MAJORS_AND_CAREERS: Record<string, string[]> = {
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
  "Nursing": ["Registered Nurse", "Nurse Practitioner", "Nurse Manager"],
  "Psychology": [
    "Clinical Psychologist",
    "School Counselor",
    "Research Psychologist",
  ],
  "Education": [
    "Elementary Teacher",
    "High School Teacher",
    "Education Administrator",
  ],
  "English": ["Editor", "Technical Writer", "Public Relations Specialist"],
  "Biology": ["Biologist", "Environmental Scientist", "Biochemist"],
  "Art": ["Graphic Designer", "Art Director", "Art Teacher"],
};

export const SALARY_DATA: Record<string, Record<string, number>> = {
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
  "Nursing": {
    "Registered Nurse": 75000,
    "Nurse Practitioner": 110000,
    "Nurse Manager": 95000,
  },
  "Psychology": {
    "Clinical Psychologist": 85000,
    "School Counselor": 65000,
    "Research Psychologist": 90000,
  },
  "Education": {
    "Elementary Teacher": 60000,
    "High School Teacher": 65000,
    "Education Administrator": 85000,
  },
  "English": {
    "Editor": 55000,
    "Technical Writer": 65000,
    "Public Relations Specialist": 60000,
  },
  "Biology": {
    "Biologist": 65000,
    "Environmental Scientist": 62000,
    "Biochemist": 92000,
  },
  "Art": {
    "Graphic Designer": 60000,
    "Art Director": 85000,
    "Art Teacher": 55000,
  },
};

// Grade thresholds for debt-to-income ratio
export const GRADE_THRESHOLDS = {
  A: 0.5,
  B: 1.0,
  C: 1.5,
  D: 2.0,
} as const;

// Default values
export const DEFAULT_YEARS = "4";
export const DEFAULT_REPAYMENT_TERM = "10";
export const MIN_YEARS = 1;
export const MAX_YEARS = 8;
export const MIN_INTEREST_RATE = 0;
export const MAX_INTEREST_RATE = 20;
export const MIN_REPAYMENT_TERM = 5;
export const MAX_REPAYMENT_TERM = 30;
