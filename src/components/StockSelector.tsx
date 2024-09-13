"use client";

import { useStockSelector } from "@/hooks/useStockSelector";
import { companies } from "@/lib/companies";

export function StockSelector() {
  const {
    currentTicker,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleStockChange,
    handleDateChange,
  } = useStockSelector();

  return (
    <div className='flex justify-between gap-5 text-dark'>
      <select
        value={currentTicker}
        onChange={(e) => handleStockChange(e.target.value)}
        className='p-2 border bg-gray-100 text-gray-800 rounded'>
        {companies.map((company) => (
          <option key={company.ticker} value={company.ticker}>
            {company.name} ({company.ticker})
          </option>
        ))}
      </select>

      <div className='flex gap-4'>
        <input
          type='date'
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateChange(e.target.value, endDate);
          }}
          min='2023-01-01'
          max='2023-06-04'
          className='p-2 bg-gray-100 text-gray-800 border rounded'
        />
        <input
          type='date'
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateChange(startDate, e.target.value);
          }}
          min={startDate || '2023-01-01'}
          max='2023-06-04'
          className='p-2 border bg-gray-100 text-gray-800 rounded'
        />
      </div>
    </div>
  );
}
