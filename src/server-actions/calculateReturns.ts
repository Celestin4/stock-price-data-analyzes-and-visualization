'use server'

import { StockData } from "@/types/types";
  
  export async function calculateReturns(stockData: StockData[]) {
    if (stockData.length === 0) return 0;
  
    const formattedData = stockData
      .map((item) => ({
        ...item,
        dateTime: new Date(item.date).getTime(),
      }))
      .filter((item) => !isNaN(item.dateTime))
      .sort((a, b) => a.dateTime - b.dateTime);
  
    if (formattedData.length < 2) return 0;
  
    // Retreving two last values for a selected period
    const secondLastValue = formattedData[formattedData.length - 2].close;
    const lastValue = formattedData[formattedData.length - 1].close;
  
    return ((lastValue - secondLastValue) / secondLastValue) * 100;
  }
