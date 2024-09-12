'use server'

interface StockData {
    date: string;
    close: number;
  }
  
  export async function calculatePercentageChange(stockData: StockData[]) {
    if (stockData.length === 0) return 0;
  
    const formattedData = stockData
      .map((item) => ({
        ...item,
        dateTime: new Date(item.date).getTime(),
      }))
      .filter((item) => !isNaN(item.dateTime))
      .sort((a, b) => a.dateTime - b.dateTime);
  
    const firstValue = formattedData[formattedData.length - 1].close;
    const lastValue = formattedData[formattedData.length - 2].close;
    return ((lastValue - firstValue) / firstValue) * 100;
  }
  