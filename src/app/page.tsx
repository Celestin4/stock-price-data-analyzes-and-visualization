import { getStockData } from "@/lib/get-stock-data";
import { InteractiveStockChart } from "@/components/InteractiveStockChart";
import { StockSelector } from "@/components/StockSelector";
import { Suspense } from "react";
import { companies } from "@/lib/stock-data";

export default function Home({
  searchParams,
}: {
  searchParams: { ticker?: string; startDate?: string; endDate?: string };
}) {
  const ticker = searchParams.ticker || companies[0].ticker;
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";

  // Pass startDate and endDate to the getStockData function
  const stockData = getStockData(ticker, startDate, endDate);

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg items-center'>
        <StockSelector />
        <Suspense
          fallback={
            <span className='justify-self-center self-center text-sm text-white'>
              Fetching price…
            </span>
          }>
          <InteractiveStockChart chartData={stockData} ticker={ticker} />
        </Suspense>
      </main>
    </div>
  );
}
