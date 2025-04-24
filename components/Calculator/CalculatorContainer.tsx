'use client';

import { useState, useEffect } from 'react';
import CalculatorForm from './CalculatorForm';
import ResultsDisplay from './ResultsDisplay';
import InvestmentGraph from './InvestmentGraph';
import { calculateCompoundInterest, type CalculationInputs, type CalculationResults } from '@/lib/calculators';

export default function CalculatorContainer() {
  const [calculationInputs, setCalculationInputs] = useState<CalculationInputs>({
    initialInvestment: 10000,
    annualInterestRate: 7,
    investmentDuration: 10,
    monthlyContribution: 1000,
    monthlyContributionStartYear: 0,
    monthlyContributionEndYear: 10,
  });

  const [results, setResults] = useState<CalculationResults>({
    yearlyData: [],
    finalAmount: 0,
    totalContributions: 0,
    totalInterest: 0,
  });

  // Recalculate when inputs change
  useEffect(() => {
    const calculatedResults = calculateCompoundInterest(calculationInputs);
    setResults(calculatedResults);
  }, [calculationInputs]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <CalculatorForm onChange={setCalculationInputs} />
      </div>
      <div className="space-y-6">
        <ResultsDisplay 
          finalAmount={results.finalAmount}
          totalContributions={results.totalContributions}
          totalInterest={results.totalInterest}
          annualInterestRate={calculationInputs.annualInterestRate}
          investmentDuration={calculationInputs.investmentDuration}
        />
        <InvestmentGraph data={results.yearlyData} />
      </div>
    </div>
  );
}