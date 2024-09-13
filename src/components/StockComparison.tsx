'use client'
import React, { useEffect, useState } from 'react';
import { StockData } from '@/types/types'; // Ensure your types are correctly defined
import { calculateReturns } from '@/server-actions/calculateReturns';

type Props = {
  data: StockData[];
};

const StockComparison: React.FC<Props> = ({ data }) => {
  const [returns, setReturns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const tickerReturns: { [key: string]: string } = {};
    const tickers = Array.from(new Set(data.map((entry) => entry.ticker)));

    const fetchReturns = async () => {
      for (const ticker of tickers) {
        const tickerData = data.filter((entry) => entry.ticker === ticker);
        const returnPercentage = await calculateReturns(tickerData);
        tickerReturns[ticker] = `${returnPercentage.toFixed(2)}%`;
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

  return (
    <div className="stock-comparison p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold  bg-white text-center text-gray-800 py-4">All Stocks</h2>
      <table className="min-w-full bg-gray-50  overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="px-4 py-2 text-left font-medium text-gray-600">Stock</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Period last Close Price</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Period last day Return (%)</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, idx) => (
            <tr key={ticker} className={`hover:bg-gray-100 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <td className="px-4 py-3 text-gray-700">{ticker}</td>
              <td className="px-4 py-3 text-gray-700">${latestClosePrices[ticker].toFixed(2)}</td>
              <td className={`px-4 py-3 text-gray-700 ${parseFloat(returns[ticker]) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {returns[ticker] || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockComparison;
