'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowTrendingUpIcon, CalendarIcon, CoinIcon } from './icons';

type ResultsDisplayProps = {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  annualInterestRate: number;
  investmentDuration: number;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ResultsDisplay({
  finalAmount,
  totalContributions,
  totalInterest,
  annualInterestRate,
  investmentDuration,
}: ResultsDisplayProps) {
  // Calculate some additional metrics
  const interestPercentage = (totalInterest / totalContributions) * 100;
  const annualReturn = (Math.pow(finalAmount / totalContributions, 1 / investmentDuration) - 1) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Final Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">
                {formatCurrency(finalAmount)}
              </span>
              <p className="text-sm opacity-90 mt-1">
                after {investmentDuration} {investmentDuration === 1 ? 'year' : 'years'}
              </p>
            </div>
            <div className="text-4xl opacity-80">
              <CoinIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">
                {formatCurrency(totalContributions)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                amount invested
              </p>
            </div>
            <div className="text-4xl text-muted-foreground">
              <ArrowUpIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Interest Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold">
                {formatCurrency(totalInterest)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                {interestPercentage.toFixed(1)}% of contributions
              </p>
            </div>
            <div className="text-4xl text-chart-1">
              <ArrowTrendingUpIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest Rate</span>
              <span className="font-medium">{annualInterestRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{investmentDuration} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Return</span>
              <span className="font-medium">{isNaN(annualReturn) ? '-' : annualReturn.toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}