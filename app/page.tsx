import CalculatorContainer from '@/components/Calculator/CalculatorContainer';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Plan Your Financial Future
        </h2>
        <p className="text-muted-foreground">
          Use our compound interest calculator to visualize how your investments can grow over time.
          Set your initial investment amount, add monthly contributions, and see how compound interest
          works its magic as your wealth accumulates.
        </p>
      </div>
      
      <div className="mb-12">
        <CalculatorContainer />
      </div>
    </div>
  );
}