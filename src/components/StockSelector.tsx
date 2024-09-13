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
    <div className='flex flex-col sm:flex-row justify-between gap-5 text-dark'>
      <div className='flex flex-col items-center'>
        <div></div>
        <label className='sm:mr-2'>
          Select Company:
        </label>
        <select
          value={currentTicker}
          onChange={(e) => handleStockChange(e.target.value)}
          className='p-2 border bg-gray-100 text-gray-800 rounded sm:ml-2'>
          {companies.map((company) => (
            <option key={company.ticker} value={company.ticker}>
              {company.name} ({company.ticker})
            </option>
          ))}
        </select>
      </div>

      <div className='flex gap-4 items-center'> 
        <div className='flex flex-col'>
          <label>
            Start Date:
          </label>
          <input
            type='date'
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleDateChange(e.target.value, endDate);
            }}
            min='2023-01-01'
            max='2023-06-04'
            className='p-2 bg-gray-100 text-gray-800 border rounded h-10'
          />
        </div>
        <div className='flex flex-col'>
          <label>
            End Date:
          </label>
          <input
            type='date'
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleDateChange(startDate, e.target.value);
            }}
            min={startDate || '2023-01-01'}
            max='2023-06-04'
            className='p-2 border bg-gray-100 text-gray-800 rounded h-10'
          />
        </div>
      </div>
    </div>
  );
}
