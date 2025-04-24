'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

type CalculatorInputs = {
  initialInvestment: number;
  annualInterestRate: number;
  investmentDuration: number;
  monthlyContribution: number;
  monthlyContributionStartYear: number;
  monthlyContributionEndYear: number;
};

type CalculatorFormProps = {
  onChange: (inputs: CalculatorInputs) => void;
};

export default function CalculatorForm({ onChange }: CalculatorFormProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialInvestment: 10000,
    annualInterestRate: 7,
    investmentDuration: 10,
    monthlyContribution: 1000,
    monthlyContributionStartYear: 0,
    monthlyContributionEndYear: 10,
  });

  const [enableMonthlyContribution, setEnableMonthlyContribution] = useState(true);

  useEffect(() => {
    onChange(inputs);
  }, [inputs, onChange]);

  const handleInputChange = (
    name: keyof CalculatorInputs,
    value: string | number
  ) => {
    let numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    // Ensure monthly contribution end year doesn't exceed investment duration
    if (name === 'investmentDuration' && numValue < inputs.monthlyContributionEndYear) {
      setInputs((prev) => ({
        ...prev,
        [name]: numValue,
        monthlyContributionEndYear: numValue,
      }));
    } else if (name === 'monthlyContributionEndYear' && numValue > inputs.investmentDuration) {
      setInputs((prev) => ({
        ...prev,
        [name]: inputs.investmentDuration,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handleMonthlyToggle = (checked: boolean) => {
    setEnableMonthlyContribution(checked);
    if (!checked) {
      setInputs((prev) => ({
        ...prev,
        monthlyContribution: 0,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        monthlyContribution: 1000,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Initial Investment</CardTitle>
          <CardDescription>
            Set your starting investment amount and conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">
              Initial Investment (THB)
            </Label>
            <Input
              id="initialInvestment"
              type="number"
              min="0"
              step="1000"
              value={inputs.initialInvestment}
              onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">
              Annual Interest Rate (%)
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                id="annualInterestRate"
                min={0}
                max={30}
                step={0.1}
                value={[inputs.annualInterestRate]}
                onValueChange={(value) => handleInputChange('annualInterestRate', value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right font-medium">
                {inputs.annualInterestRate.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentDuration">
              Investment Duration (Years)
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                id="investmentDuration"
                min={1}
                max={50}
                step={1}
                value={[inputs.investmentDuration]}
                onValueChange={(value) => handleInputChange('investmentDuration', value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right font-medium">
                {inputs.investmentDuration} {inputs.investmentDuration === 1 ? 'year' : 'years'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Contributions</CardTitle>
              <CardDescription>
                Add regular monthly investments
              </CardDescription>
            </div>
            <Switch
              checked={enableMonthlyContribution}
              onCheckedChange={handleMonthlyToggle}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`space-y-4 ${!enableMonthlyContribution ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (THB)
              </Label>
              <Input
                id="monthlyContribution"
                type="number"
                min="0"
                step="100"
                value={inputs.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                disabled={!enableMonthlyContribution}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Contribution Period (Years)</Label>
                <span className="text-sm text-muted-foreground">
                  Year {inputs.monthlyContributionStartYear} to {inputs.monthlyContributionEndYear}
                </span>
              </div>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={inputs.investmentDuration}
                  step={1}
                  value={[inputs.monthlyContributionStartYear, inputs.monthlyContributionEndYear]}
                  onValueChange={(value) => {
                    handleInputChange('monthlyContributionStartYear', value[0]);
                    handleInputChange('monthlyContributionEndYear', value[1]);
                  }}
                  disabled={!enableMonthlyContribution}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}