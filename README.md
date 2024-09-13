# Stock Analysis and visulisation  Application

This Next.js 14 application analyzes and visualizes stock price data for multiple tech companies using TypeScript, focusing on server actions for data processing and basic data visualization.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Check if you have this file,  `stock_data.csv` file in the `public` directory

4. Run the development server:
   ```
   pnpm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests

To run the unit tests:

```
pnpm test
```

## Project Structure

- `src/`: Contains the main application code
  - `components/`: React components
  - `app/`: React compeonet for pages 
  - `lib/`: Data definitions
  - `hooks/`: Custom hooks 
  - `server-actions/`: nectjs server actions for getting and processing data 
  - `types/`: typescript type definitions
- `public/`: Static assets, including the CSV data file
- `_tests_/`: Unit tests

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts (for data visualization)
- Jest (for testing)

## Features

- Retrieve stock data for a given ticker and date range
- Calculate daily returns for a stock
- Visualize stock data and returns using charts and table
- Compare multiple stocks

## Link to deployed version

5. Open [https://stock-price-data-analyzes-and-visualization.vercel.app/](https://stock-price-data-analyzes-and-visualization.vercel.app/)  to test deployed verion of the app
