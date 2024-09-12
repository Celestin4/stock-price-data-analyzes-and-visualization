"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { companies } from "@/lib/stock-data";

export function StockSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTicker = searchParams.get("ticker") || companies[0].ticker;
  const [startDate, setStartDate] = React.useState<string>(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = React.useState<string>(
    searchParams.get("endDate") || ""
  );

  const handleStockChange = (ticker: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("ticker", ticker);
    router.push(`/?${params.toString()}`);
  };

  const handleDateChange = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams);
    if (start) params.set("startDate", start);
    if (end) params.set("endDate", end);
    router.push(`/?${params.toString()}`);
  };

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
          onChange={(e) => setStartDate(e.target.value)}
          className='p-2 bg-gray-100 text-gray-800 border rounded'
        />
        <input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='p-2 border bg-gray-100 text-gray-800 rounded'
        />
        <button
          onClick={() => handleDateChange(startDate, endDate)}
          className='p-2 bg-blue-500 text-white rounded'>
          Apply
        </button>
      </div>
    </div>
  );
}
