# Stock Analysis Application

This Next.js 14 application analyzes and visualizes stock price data for multiple tech companies using TypeScript, focusing on server actions for data processing and basic data visualization.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Place the `stock_data.csv` file in the `public` directory
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

- `app/`: Contains the main application code
  - `api/`: Server actions for data processing
  - `components/`: React components for UI
  - `lib/`: Utility functions and types
- `public/`: Static assets, including the CSV data file
- `tests/`: Unit tests

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts (for data visualization)
- Jest (for testing)

## Features

- Retrieve stock data for a given ticker and date range
- Calculate daily returns for a stock
- Visualize stock data and returns using charts
- Compare multiple stocks