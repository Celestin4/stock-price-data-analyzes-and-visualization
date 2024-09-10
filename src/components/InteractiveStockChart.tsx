"use client";

import React, { FC, use, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { companies } from "@/lib/stock-data";
import { TrendingDown, TrendingUp } from "lucide-react";

interface InteractiveStockChartProps {
  chartData: Promise<StockData[]>;
  ticker: string;
}

const chartConfig = {
  priceData: {
    label: "Price Data",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-3))",
  },
  close: {
    label: "Close",
    color: "hsl(var(--chart-2))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const InteractiveStockChart: FC<InteractiveStockChartProps> = ({
  chartData: stockData,
  ticker,
}) => {
  const chartData = use(stockData);

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
      Math.min(...formattedData.map((item) => Math.min(item.open, item.close))),
    [formattedData]
  );
  const maxValue = useMemo(
    () =>
      Math.max(...formattedData.map((item) => Math.max(item.open, item.close))),
    [formattedData]
  );

  const company = companies.find((company) => company.ticker === ticker);

  const percentageChange = useMemo(() => {
    if (formattedData.length === 0) return 0;

    const currentDate = new Date().getTime();
    const thirtyDaysAgo = currentDate - 30 * 24 * 60 * 60 * 1000;

    const recentData = formattedData.filter(
      (item) => item.dateTime >= thirtyDaysAgo
    );

    if (recentData.length === 0) return 0;

    const firstValue = recentData[0].close;
    const lastValue = recentData[recentData.length - 1].close;

    console.log(recentData[0], recentData[recentData.length - 1]);

    return ((lastValue - firstValue) / firstValue) * 100;
  }, [formattedData]);

  const isTrendingUp = percentageChange > 0;

  return (
    <div className='w-full border rounded-lg shadow-md'>
      <div className='flex flex-col items-stretch space-y-0 border-b p-4'>
        <div className='flex flex-1 flex-col justify-center gap-1'>
          <h2 className='text-xl font-bold'>{ticker}</h2>
          <p className='text-gray-600'>{company?.name}</p>
        </div>
      </div>
      <div className='p-4'>
        <div className='aspect-auto h-[400px] w-full'>
          <div className='h-full w-full border rounded'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  domain={[minValue * 0.9, maxValue * 1.1]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Line
                  type='monotone'
                  dataKey='high'
                  stroke={chartConfig.high.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='close'
                  stroke={chartConfig.close.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='low'
                  stroke={chartConfig.low.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className='flex-col items-start gap-2 p-4 text-sm'>
        <div className='font-medium leading-none'>
          {isTrendingUp ? (
            <>
              Trending up by{" "}
              <span className='text-[#2DB78A]'>
                {percentageChange.toFixed(2)}%{" "}
              </span>{" "}
              this month{" "}
              <TrendingUp className='inline text-[#2DB78A] h-4 w-4' />
            </>
          ) : (
            <>
              Trending down by{" "}
              <span className='text-[#E2366F]'>
                {percentageChange.toFixed(2)}%{" "}
              </span>{" "}
              this month{" "}
              <TrendingDown className='inline text-[#E2366F] h-4 w-4' />
            </>
          )}
        </div>
        <div className='leading-none text-gray-500'>
          Showing stock data for the last 3 months
        </div>
      </div>
    </div>
  );
};
