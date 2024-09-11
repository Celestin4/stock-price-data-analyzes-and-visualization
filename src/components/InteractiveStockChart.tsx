"use client";

import React, { FC,use, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { companies } from "@/lib/stock-data";
import { TrendingDown, TrendingUp } from "lucide-react";
import { InteractiveStockChartProps } from "@/types/types";

const chartConfig = {
  high: { label: "High", color: "#FF5733" },
  close: { label: "Close", color: "#33FF57" },
  low: { label: "Low", color: "#3357FF" },
};

export const InteractiveStockChart: FC<InteractiveStockChartProps> = ({
  chartData: stockData,
  ticker,
}) => {
  const chartData = use(stockData);
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#cccccc");

  const formattedData = useMemo(
    () =>
      chartData
        .map((item) => ({
          ...item,
          dateTime: new Date(item.date).getTime(),
        }))
        .filter((item) => !isNaN(item.dateTime))
        .sort((a, b) => a.dateTime - b.dateTime),
    [chartData]
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

  const percentageChange = useMemo(() => {
    if (formattedData.length === 0) return 0;

    const firstValue = formattedData[0].close;
    const lastValue = formattedData[formattedData.length - 1].close;

    return ((lastValue - firstValue) / firstValue) * 100;
  }, [formattedData]);

  const isTrendingUp = percentageChange > 0;

  return (
    <div className='w-full border rounded-lg shadow-md'>
      <div className='p-4'>
        <h2 className='text-xl font-bold'>{ticker}</h2>
        <p>{company?.name}</p>
      </div>
      <div className='p-4'>
        <div className='mb-4'>
          <label className='mr-2'>
            <input
              type='checkbox'
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Show Grid
          </label>
          <input
            type='color'
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
          />
        </div>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={formattedData}>
            {showGrid && <CartesianGrid stroke={gridColor} strokeDasharray='3 3' />}
            <XAxis
              dataKey='date'
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis domain={[minValue * 0.9, maxValue * 1.1]} />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='high'
              dot={false}
              stroke={chartConfig.high.color}
              name={chartConfig.high.label}
            />
            <Line
              type='monotone'
              dataKey='close'
              dot={false}
              stroke={chartConfig.close.color}
              name={chartConfig.close.label}
            />
            <Line
              type='monotone'
              dataKey='low'
              dot={false}
              stroke={chartConfig.low.color}
              name={chartConfig.low.label}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='p-4'>
        <p>
          {isTrendingUp ? (
            <>
              Trending up by{" "}
              <span className='text-green-500'>{percentageChange.toFixed(2)}%</span>{" "}
              this period <TrendingUp />
            </>
          ) : (
            <>
              Trending down by{" "}
              <span className='text-red-500'>{percentageChange.toFixed(2)}%</span>{" "}
              this period <TrendingDown />
            </>
          )}
        </p>
      </div>
    </div>
  );
};
