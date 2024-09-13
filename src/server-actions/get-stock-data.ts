/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import {StockData} from '../types/types'

export async function getStockData(ticker?: string, startDate?: string, endDate?: string): Promise<StockData[]> {
  const filePath = path.join(process.cwd(), 'public/data/StockPrices.csv');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  
  const parsedData = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  }).data;

  // Transform parsed data into the desired format
  const stockData = parsedData.map((item: any) => ({
    date: item.Date,
    open: parseFloat(item.open),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    close: parseFloat(item.close),
    volume: parseInt(item.volume, 10),
    ticker: item.ticker
  }));

  // Convert startDate and endDate to Date objects if provided
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Filter by ticker, startDate, and endDate if provided
  const filteredData = stockData.filter((item) => {
    const itemDate = new Date(item.date);
    const tickerMatches = ticker ? item.ticker === ticker : true;
    const startMatches = start ? itemDate >= start : true;
    const endMatches = end ? itemDate <= end : true;
    return tickerMatches && startMatches && endMatches;
  });

  return filteredData;
}
