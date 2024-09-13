'use client';
import React from 'react';
import { StockData } from '@/types/types';
import useStockComparison from '@/hooks/useStockComparison';

type StockComparisonProps = {
  data: StockData[];
};

const StockComparison: React.FC<StockComparisonProps> = ({ data }) => {
  const { tickers, latestClosePrices, returns } = useStockComparison(data);

  return (
    <div className="stock-comparison p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold bg-white text-center text-gray-800 py-4">All Stocks</h2>
      <table className="min-w-full bg-gray-50 overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="px-4 py-2 text-left font-medium text-gray-600">Stock</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Period last Close Price</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Period last day Return (%)</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, idx) => (
            <tr
              key={ticker}
              className={`hover:bg-gray-100 transition-colors duration-200 ${
                idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <td className="px-4 py-3 text-gray-700">{ticker}</td>
              <td className="px-4 py-3 text-gray-700">
                ${latestClosePrices[ticker].toFixed(2)}
              </td>
              <td
                className={`px-4 py-3 text-gray-700 ${
                  parseFloat(returns[ticker]) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
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
