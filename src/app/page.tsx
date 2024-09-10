import { getStockData } from "@/lib/get-stock-data";
import { InteractiveStockChart } from "@/components/InteractiveStockChart";
import { StockSelector } from "@/components/StockSelector";
import { Suspense } from "react";
import { companies } from "@/lib/stock-data";
// import { ErrorBoundary } from "react-error-boundary";
// import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: { ticker?: string };
}) {
  const ticker = searchParams.ticker || companies[0].ticker;
  const stockData = getStockData(ticker);

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
     
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg items-center'>
        <StockSelector />
        {/* <ErrorBoundary
          fallback={
            <span className='text-sm text-red-600'>
              Error with Polygon.io API 😅 - Please try again later.
            </span>
          }> */}
          <Suspense
            fallback={
              <span className='justify-self-center self-center text-sm text-white'>
                Fetching price…
              </span>
            }>
            <InteractiveStockChart chartData={stockData} ticker={ticker} />
          </Suspense>
        {/* </ErrorBoundary> */}
      </main>
    </div>
  );
}
