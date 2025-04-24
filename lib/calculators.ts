export type InvestmentData = {
  year: number;
  totalAmount: number;
  principal: number;
  interest: number;
};

export type CalculationInputs = {
  initialInvestment: number;
  annualInterestRate: number;
  investmentDuration: number;
  monthlyContribution: number;
  monthlyContributionStartYear: number;
  monthlyContributionEndYear: number;
};

export type CalculationResults = {
  yearlyData: InvestmentData[];
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
};

export function calculateCompoundInterest(inputs: CalculationInputs): CalculationResults {
  const {
    initialInvestment,
    annualInterestRate,
    investmentDuration,
    monthlyContribution,
    monthlyContributionStartYear,
    monthlyContributionEndYear,
  } = inputs;

  // Convert annual interest rate to monthly
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  
  // Array to store yearly data
  const yearlyData: InvestmentData[] = [];
  
  let currentTotal = initialInvestment;
  let totalPrincipal = initialInvestment;
  
  // Year 0 (initial state)
  yearlyData.push({
    year: 0,
    totalAmount: currentTotal,
    principal: totalPrincipal,
    interest: 0,
  });
  
  // Calculate for each year
  for (let year = 1; year <= investmentDuration; year++) {
    const isContributionYear = year > monthlyContributionStartYear && year <= monthlyContributionEndYear;
    const monthlyAmount = isContributionYear ? monthlyContribution : 0;
    let principalAddedThisYear = 0;
    let interestEarnedThisYear = 0;
    
    // Calculate month by month
    for (let month = 1; month <= 12; month++) {
      // Interest earned this month
      const monthlyInterest = currentTotal * monthlyInterestRate;
      interestEarnedThisYear += monthlyInterest;
      
      // Add monthly contribution (if applicable)
      if (isContributionYear) {
        totalPrincipal += monthlyAmount;
        principalAddedThisYear += monthlyAmount;
      }
      
      // Update current total
      currentTotal += monthlyInterest + (isContributionYear ? monthlyAmount : 0);
    }
    
    // Store yearly data
    yearlyData.push({
      year,
      totalAmount: currentTotal,
      principal: totalPrincipal,
      interest: currentTotal - totalPrincipal,
    });
  }
  
  return {
    yearlyData,
    finalAmount: currentTotal,
    totalContributions: totalPrincipal,
    totalInterest: currentTotal - totalPrincipal,
  };
}