"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyContributions {
  [key: number]: number;
}

interface Result {
  year: number;
  balance: number;
}

export default function CompoundInterestCalculator() {
  const [years, setYears] = useState(10);
  const [initialAmount, setInitialAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(8);
  const [results, setResults] = useState<Result[]>([]);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  const [rangeAmount, setRangeAmount] = useState(1000);

  const [monthlyContributions, setMonthlyContributions] =
    useState<MonthlyContributions>(
      Array.from({ length: years }, (_, i) => ({ [i + 1]: 1000 })).reduce(
        (acc, obj) => ({ ...acc, ...obj }),
        {}
      )
    );

  const formatThaiCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleMonthlyChange = (year: number, value: number) => {
    setMonthlyContributions((prev) => ({
      ...prev,
      [year]: value || 0,
    }));
  };

  const applyRangeContribution = () => {
    const updatedContributions = { ...monthlyContributions };
    for (let year = rangeStart; year <= rangeEnd; year++) {
      updatedContributions[year] = rangeAmount;
    }
    setMonthlyContributions(updatedContributions);
  };

  useEffect(() => {
    setMonthlyContributions(
      Array.from({ length: years }, (_, i) => ({ [i + 1]: 1000 })).reduce(
        (acc, obj) => ({ ...acc, ...obj }),
        {}
      )
    );
  }, [years]);

  const calculateCompoundInterest = () => {
    if (initialAmount < 0 || years <= 0 || interestRate < 0) {
      console.error("กรุณากรอกค่าที่ถูกต้อง");
      return;
    }
  
    let balance = initialAmount; // เงินต้นเริ่มต้น เป็น 0 ได้
    const newResults = [];
  
    for (let year = 1; year <= years; year++) {
      let monthly = monthlyContributions[year] ?? 0;
      for (let month = 1; month <= 12; month++) {
        balance += monthly;
        balance *= 1 + interestRate / 100 / 12;
      }
  
      newResults.push({ year, balance: parseFloat(balance.toFixed(2)) });
    }
  
    setResults(newResults);
  };  

  // คำนวณทันทีเมื่อ component โหลด
  useEffect(() => {
    calculateCompoundInterest();
  }, []);

  // คำนวณใหม่เมื่อมีการเปลี่ยนแปลงค่าต่างๆ
  useEffect(() => {
    calculateCompoundInterest();
  }, [initialAmount, years, interestRate, monthlyContributions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-2">
      <Card className="max-w-[95vw] mx-auto shadow-lg">
        <CardContent className="p-4 md:p-8">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            คำนวณดอกเบี้ยทบต้น
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    เงินลงทุนเริ่มต้น (บาท)
                  </label>
                  <Input
                    type="text"
                    value={initialAmount}
                    onChange={(e) =>
                      setInitialAmount(parseFloat(e.target.value) || 0)
                    }
                    className="w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    อัตราดอกเบี้ยต่อปี (%)
                  </label>
                  <Input
                    type="text"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(parseFloat(e.target.value) || 0)
                    }
                    className="w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    ระยะเวลาลงทุน (ปี)
                  </label>
                  <Input
                    type="text"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                    className="w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ตั้งค่าเงินลงทุนรายเดือนเป็นช่วง
                </label>
                <p className="text-sm font-semibold text-gray-500 mb-4">
                  กำหนดช่วงปีที่ต้องการให้มีเงินลงทุนรายเดือนเท่ากัน
                  และระบุจำนวนเงินที่ต้องการใส่
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      ปีเริ่มต้น
                    </label>
                    <Input
                      type="text"
                      value={rangeStart}
                      onChange={(e) =>
                        setRangeStart(parseInt(e.target.value) || 0)
                      }
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      ปีสิ้นสุด
                    </label>
                    <Input
                      type="text"
                      value={rangeEnd}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setRangeEnd(Math.min(value, years)); // จำกัดไม่ให้เกินจำนวนปีลงทุน
                      }}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      จำนวนเงิน (บาท)
                    </label>
                    <Input
                      type="text"
                      value={rangeAmount}
                      onChange={(e) =>
                        setRangeAmount(parseFloat(e.target.value) || 0)
                      }
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={applyRangeContribution}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  ใช้ค่า
                </Button>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  เงินลงทุนรายเดือน (บาท)
                </h3>
                <div className="h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="grid gap-4">
                    {Array.from({ length: years }, (_, i) => i + 1).map(
                      (year) => (
                        <div key={year} className="flex items-center gap-4">
                          <span className="w-20 text-sm font-medium text-gray-600">
                            ปีที่ {year}
                          </span>
                          <Input
                            type="text"
                            value={monthlyContributions[year] || ""}
                            onChange={(e) =>
                              handleMonthlyChange(
                                year,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="flex-1 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full py-2.5 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                onClick={calculateCompoundInterest}
              >
                คำนวณ
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                การเติบโตของเงินลงทุน
              </h3>
              <div className="h-[1000px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="year"
                      label={{
                        value: "ระยะเวลา (ปี)",
                        position: "bottom",
                        offset: 20,
                      }}
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{
                        value: "มูลค่าเงินลงทุน (บาท)",
                        angle: -90,
                        position: "left",
                        offset: 40,
                      }}
                      tickFormatter={(value) => formatThaiCurrency(value)}
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatThaiCurrency(value),
                        "มูลค่าเงินลงทุน",
                      ]}
                      labelFormatter={(label) => `ปีที่ ${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        padding: "8px 12px",
                        fontSize: "14px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
