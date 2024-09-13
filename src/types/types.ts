// export interface StockData {
//     date: string;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
//   }

  export interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ticker: string;
  }
  
  
  export interface Company {
    name: string;
    ticker: string;
  }

 export interface InteractiveStockChartProps {
    chartData: Promise<StockData[]>;
    ticker: string;
  }