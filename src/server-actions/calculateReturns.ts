'use server'

import { StockData } from "@/types/types";
  
  export async function calculateReturns(stockData: StockData[]) { // Renamed function
    if (stockData.length === 0) return 0;
  
    const formattedData = stockData
      .map((item) => ({
        ...item,
        dateTime: new Date(item.date).getTime(),
      }))
      .filter((item) => !isNaN(item.dateTime))
      .sort((a, b) => a.dateTime - b.dateTime);
  
    // Check if there are at least two valid entries
    if (formattedData.length < 2) return 0;
  
    const secondLastValue = formattedData[formattedData.length - 2].close;
    const lastValue = formattedData[formattedData.length - 1].close;
  
    // Ensure values are numbers before calculation
    if (typeof secondLastValue !== 'number' || typeof lastValue !== 'number') {
        throw new Error("Invalid stock data: 'close' values must be numbers.");
    }
  
    return ((lastValue - secondLastValue) / secondLastValue) * 100;
  }
