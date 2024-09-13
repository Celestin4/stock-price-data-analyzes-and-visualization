"use client";

import React, { FC, useMemo, useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { companies } from "@/lib/companies";
import { TrendingDown, TrendingUp } from "lucide-react";
import { InteractiveStockChartProps } from "@/types/types";
import { calculateReturns } from "@/server-actions/calculateReturns";// Import the server action

const chartConfig = {
  high: { label: "High", color: "#FF5733" },
  close: { label: "Close", color: "#33FF57" },
  low: { label: "Low", color: "#3357FF" },
};

export const InteractiveStockChart: FC<InteractiveStockChartProps> = ({
  chartData: stockData,
  ticker,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#cccccc");
  const [displayType, setDisplayType] = useState<'chart' | 'table'>('chart');
  const [percentageChange, setPercentageChange] = useState<number>(0);
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
    async function fetchPercentageChange() {
      try {
        const dailyReturn = await calculateReturns(formattedData);
        setPercentageChange(dailyReturn);
        setIsTrendingUp(dailyReturn > 0);
      } catch (error) {
        console.error("Error calculating percentage change:", error);
      }
    }

    fetchPercentageChange();
  }, [formattedData]);

  return (
    <div className='w-full border rounded-lg shadow-md'>
      <div className='p-4'>
        <h2 className='text-xl font-bold'>{ticker}</h2>
        <p>{company?.name}</p>
        <label>
          <input
            type="radio"
            value="chart"
            checked={displayType === 'chart'}
            onChange={() => setDisplayType('chart')}
          />
          Graph
        </label>
        <label>
          <input
            type="radio"
            value="table"
            checked={displayType === 'table'}
            onChange={() => setDisplayType('table')}
          />
          Table
        </label>
        {displayType === 'chart' && ( 
          <div>
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={() => setShowGrid(!showGrid)}
              />
              Show Grid
            </label>
            <label>
              Grid Color:
              <input
                type="color"
                value={gridColor}
                onChange={(e) => setGridColor(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className='p-4'>
        <p>
          {isTrendingUp ? (
            <>
              Increased by{" "}
              <span className='text-green-500'>{percentageChange.toFixed(2)}%</span>{" "}
              today <TrendingUp />
            </>
          ) : (
            <>
              Decreased by{" "}
              <span className='text-red-500'>{percentageChange.toFixed(2)}%</span>{" "}
              today <TrendingDown />
            </>
          )}
        </p>
      </div>
      {displayType === 'chart' ? (
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
      ) : (
        <table className='w-full'>
          <thead>
            <tr>
              <th>Date</th>
              <th>High</th>
              <th>Close</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.map((item) => (
              <tr key={item.date}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.high}</td>
                <td>{item.close}</td>
                <td>{item.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
