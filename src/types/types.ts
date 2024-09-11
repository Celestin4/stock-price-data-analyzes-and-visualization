export interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  

 export interface InteractiveStockChartProps {
    chartData: Promise<StockData[]>;
    ticker: string;
  }