'use server';

import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { StockData } from '../types/types';

const CSV_FILE_PATH = path.join(process.cwd(), 'public/data/StockPrices.csv');

export async function getStockData(
  ticker?: string, 
  startDate?: string, 
  endDate?: string
): Promise<{ stockData: StockData[], filteredData: StockData[] }> {
  try {
    // Read and parse CSV file
    const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf-8');
    
    const parsedData = Papa.parse<{
      Date: string;
      open: string;
      high: string;
      low: string;
      close: string;
      volume: string;
      ticker: string;
    }>(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;

    // Map parsed data to StockData format
    const stockData = parsedData.map(({ Date, open, high, low, close, volume, ticker }) => ({
      date: Date,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseInt(volume, 10),
      ticker
    }));


    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Filter all stock data based on date range
    const filteredStockData = stockData.filter((item) => {
      const itemDate = new Date(item.date);
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });

    // Filter data for specified ticker 
    const filteredData = filteredStockData.filter((item) => {
      const tickerMatches = !ticker || item.ticker === ticker;
      return tickerMatches ;
    });

    return { stockData: filteredStockData, filteredData };
  } catch (error) {
    return { stockData: [], filteredData: [] };
  }
}
