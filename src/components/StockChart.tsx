'use client'
import React, { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { InteractiveStockChartProps } from "@/types/types";
import { useStockChart } from "@/hooks/useStockChart";
export const StockChart: FC<InteractiveStockChartProps> = ({
  chartData: stockData,
  ticker,
}) => {
  const {
    displayType,
    setDisplayType,
    priceReturn,
    isTrendingUp,
    formattedData,
    minValue,
    maxValue,
    chartConfig,
    company,
  } = useStockChart({ stockData, ticker });


  return (
    <div className='w-full max-w-4xl mx-auto border rounded-lg shadow-lg'>
      <div className='p-4 border-b'>
        <h2 className='text-2xl font-bold text-white'>{ticker}</h2>
        <p className='text-white'>{company?.name}</p>
      </div>

      <div className='mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
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

        <div className='flex items-center mt-2 sm:mt-0'>
          <p className='text-lg'>
            {isTrendingUp ? (
              <>
                Increased by{" "}
                <span className='text-green-600 font-semibold'>{priceReturn.toFixed(2)}%</span>{" "}
                today <TrendingUp className='inline-block ml-1 text-green-600' />
              </>
            ) : (
              <>
                Decreased by{" "}
                <span className='text-red-600 font-semibold'>{priceReturn.toFixed(2)}%</span>{" "}
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
              <CartesianGrid stroke='#cccccc' strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className='text-gray-600'
              />
              <YAxis domain={[Math.floor(minValue * 0.9), Math.ceil(maxValue * 1.1)]} className='text-gray-600' />
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
