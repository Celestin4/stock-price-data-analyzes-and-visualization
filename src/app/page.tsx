import { getStockData } from "@/server-actions/getStockData";
import { InteractiveStockChart } from "@/components/StockVisualisation";
import { StockSelector } from "@/components/StockSelector";
import { companies } from "@/lib/companies";

export default async function Home({
  searchParams,
}: {
  searchParams: { ticker?: string; startDate?: string; endDate?: string };
}) {
  const ticker = searchParams.ticker || companies[0].ticker;
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";

  // Instead of awaiting, pass the promise directly
  const stockDataPromise = await getStockData(ticker, startDate, endDate);

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg items-center'>
        <StockSelector />
        {/* Keep it as a promise */}
        <InteractiveStockChart chartData={stockDataPromise} ticker={ticker} />
      </main>
    </div>
  );
}
