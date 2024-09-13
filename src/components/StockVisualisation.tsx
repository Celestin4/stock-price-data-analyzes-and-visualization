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
import { calculateReturns } from "@/server-actions/calculateReturns"; // Import the server action

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
    <div className='w-full max-w-4xl mx-auto border rounded-lg shadow-lg'>
      <div className='p-4 border-b'>
        <h2 className='text-2xl font-bold text-gray-800'>{ticker}</h2>
        <p className='text-gray-600'>{company?.name}</p>
        <div className='mt-2 flex flex-col sm:flex-row items-start sm:items-center'>
          
          
        </div>
      </div>
      <div className='mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
        <div>
        
       
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <input
              type="radio"
              value="chart"
              checked={displayType === 'chart'}
              onChange={() => setDisplayType('chart')}
              className='form-radio'
            />
            <span>Graph</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input
              type="radio"
              value="table"
              checked={displayType === 'table'}
              onChange={() => setDisplayType('table')}
              className='form-radio'
            />
            <span>Table</span>
          </label>
        </div>
        {displayType === 'chart' && (
            <div className='mt-4 flex  items-center'>
              <label className='flex items-center space-x-2'>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={() => setShowGrid(!showGrid)}
                  className='form-checkbox'
                />
                <span>Show Grid</span>
              </label>
              <div className='flex items-center space-x-2 ml-6'>
                <label>Grid Color:</label>
                <input
                  type="color"
                  value={gridColor}
                  onChange={(e) => setGridColor(e.target.value)}
                  className='w-10 h-10 p-0 border rounded'
                />
              </div>
            </div>
          )}

        </div>
        <div className='flex items-center mt-2 sm:mt-0'>
          <p className='text-lg'>
            {isTrendingUp ? (
              <>
                Increased by{" "}
                <span className='text-green-600 font-semibold'>{percentageChange.toFixed(2)}%</span>{" "}
                today <TrendingUp className='inline-block ml-1 text-green-600' />
              </>
            ) : (
              <>
                Decreased by{" "}
                <span className='text-red-600 font-semibold'>{percentageChange.toFixed(2)}%</span>{" "}
                today <TrendingDown className='inline-block ml-1 text-red-600' />
              </>
            )}
          </p>
        </div>
      </div>
      <div className='p-4'>
        {displayType === 'chart' ? (
          <ResponsiveContainer width='100%' height={400}>
            <LineChart data={formattedData}>
              {showGrid && <CartesianGrid stroke={gridColor} strokeDasharray='3 3' />}
              <XAxis
                dataKey='date'
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className='text-gray-600'
              />
              <YAxis domain={[minValue * 0.9, maxValue * 1.1]} className='text-gray-600' />
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
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-[grey]'>
                <tr>
                  <th className='p-2 text-left'>Date</th>
                  <th className='p-2 text-left'>High</th>
                  <th className='p-2 text-left'>Close</th>
                  <th className='p-2 text-left'>Low</th>
                </tr>
              </thead>
              <tbody>
                {formattedData.map((item) => (
                  <tr key={item.date}>
                    <td className='p-2'>{new Date(item.date).toLocaleDateString()}</td>
                    <td className='p-2'>{item.high}</td>
                    <td className='p-2'>{item.close}</td>
                    <td className='p-2'>{item.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
