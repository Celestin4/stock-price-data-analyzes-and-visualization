"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { companies } from "@/lib/stock-data";

export function StockSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTicker = searchParams.get("ticker") || "NVDA";

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTicker, setSelectedTicker] = React.useState(currentTicker);

  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const handleStockChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("ticker", value);
    router.push(`/?${params.toString()}`);
    setSelectedTicker(value);
    setIsOpen(false);
  };

  const handleDateChange = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams);
    if (start) params.set("startDate", start);
    if (end) params.set("endDate", end);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className='relative w-full flex justify-end'>
      <button 
        className='w-[300px] border border-gray-300 rounded p-2 text-left' 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTicker} <span className='float-right'>▼</span>
      </button>
      <div>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateChange(e.target.value, endDate);
          }} 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateChange(startDate, e.target.value);
          }} 
        />
      </div>
      {isOpen && (
        <div className='absolute z-10 w-[300px] bg-[grey] border border-gray-300 rounded mt-1'>
          {companies.map((company) => (
            <button 
              key={company.ticker} 
              className='w-full text-left p-2 hover:bg-gray-100' 
              onClick={() => handleStockChange(company.ticker)}
            >
              {company.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
