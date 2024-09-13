'use server'

import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { StockData } from '../types/types';

const CSV_FILE_PATH = path.join(process.cwd(), 'public/data/StockPrices.csv');

export async function getStockData(ticker?: string, startDate?: string, endDate?: string): Promise<StockData[]> {
  try {
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

    if (!ticker && !start && !end) return stockData;

    const filteredData = stockData.filter((item) => {
      const itemDate = new Date(item.date);
      const tickerMatches = ticker ? item.ticker === ticker : true;
      const startMatches = start ? itemDate >= start : true;
      const endMatches = end ? itemDate <= end : true;
      return tickerMatches && startMatches && endMatches;
    });

    return filteredData;
  } catch (error) {
    return [];
  }
}
