import { useState, useEffect, useMemo } from "react";
import { calculateReturns } from "@/server-actions/calculateReturns";
import { companies } from "@/lib/companies";
import { StockData } from "@/types/types";

interface UseStockChartParams {
  stockData: StockData[];
  ticker: string;
}

const chartConfig = {
  high: { label: "High", color: "#FF5733" },
  close: { label: "Close", color: "#33FF57" },
  low: { label: "Low", color: "#3357FF" },
};

export const useStockChart = ({ stockData, ticker }: UseStockChartParams) => {
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#cccccc");
  const [displayType, setDisplayType] = useState<'chart' | 'table'>('chart');
  const [priceReturn, setPriceReturn] = useState<number>(0);
  const [isTrendingUp, setIsTrendingUp] = useState<boolean>(true);

  const formattedData = useMemo(
    () =>
      stockData
        .map((item) => ({
          ...item,
          dateTime: new Date(item.date).getTime(),
        }))
        .filter((item) => !isNaN(item.dateTime))
        .sort((a, b) => a.dateTime - b.dateTime),
    [stockData]
  );

  const minValue = useMemo(
    () =>
      Math.min(...formattedData.map((item) => Math.min(item.low, item.close))),
    [formattedData]
  );
  const maxValue = useMemo(
    () =>
      Math.max(...formattedData.map((item) => Math.max(item.high, item.close))),
    [formattedData]
  );

  const company = companies.find((company) => company.ticker === ticker);

  useEffect(() => {
    async function fetchPriceReturn() {
      try {
        const dailyReturn = await calculateReturns(formattedData);
        setPriceReturn(dailyReturn);
        setIsTrendingUp(dailyReturn > 0);
      } catch (error) {
        setPriceReturn(0)
      }
    }

    fetchPriceReturn();
  }, [formattedData]);

  return {
    showGrid,
    setShowGrid,
    gridColor,
    setGridColor,
    displayType,
    setDisplayType,
    priceReturn,
    isTrendingUp,
    formattedData,
    minValue,
    maxValue,
    chartConfig,
    company,
  };
};
