'use client';
import { useEffect, useState } from 'react';
import { StockData } from '@/types/types'; // Ensure your types are correctly defined
import { calculateReturns } from '@/server-actions/calculateReturns';

const useStockComparison = (data: StockData[]) => {
  const [returns, setReturns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchReturns = async () => {
      const tickerReturns: { [key: string]: string } = {};
      const tickers = Array.from(new Set(data.map((entry) => entry.ticker)));

      for (const ticker of tickers) {
        const tickerData = data.filter((entry) => entry.ticker === ticker);
        const priceReturn = await calculateReturns(tickerData);
        tickerReturns[ticker] = `${priceReturn.toFixed(2)}%`;
      }
      setReturns(tickerReturns);
    };

    fetchReturns();
  }, [data]);

  const latestClosePrices: { [key: string]: number } = {};

  data.forEach((entry) => {
    const { ticker, close } = entry;
    latestClosePrices[ticker] = close;
  });

  const tickers = Object.keys(latestClosePrices);

  return { tickers, latestClosePrices, returns };
};

export default useStockComparison;
