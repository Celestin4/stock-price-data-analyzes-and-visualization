import { getStockData } from "@/server-actions/getStockData";
import { InteractiveStockChart } from "@/components/StockVisualisation";
import { StockSelector } from "@/components/StockSelector";
import { companies } from "@/lib/companies";
import StockComparison from "@/components/StockComparison";

export default async function Home({
  searchParams,
}: {
  searchParams: { ticker?: string; startDate?: string; endDate?: string };
}) {
  const ticker = searchParams.ticker || companies[0].ticker;
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";

  const {stockData, filteredData} = await getStockData(ticker, startDate, endDate);

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg items-center'>
        <StockSelector />
        <div className='flex flex-col lg:flex-row gap-4 w-full'>
          <InteractiveStockChart chartData={filteredData} ticker={ticker} />
          <StockComparison data={stockData} />
        </div>
      </main>
    </div>
  );
}
