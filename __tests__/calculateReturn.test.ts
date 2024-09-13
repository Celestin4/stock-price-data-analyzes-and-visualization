import { calculatePercentageChange } from "@/server-actions/calculate-returns";
describe('calculatePercentageChange', () => {
    it('should return 0 for empty stock data', async () => {
        const result = await calculatePercentageChange([]);
        expect(result).toBe(0);
    });

    it('should calculate percentage change correctly', async () => {
        const stockData = [
            { date: '2023-01-01', close: 100, open: 100, high: 100, low: 100, volume: 1000, ticker: 'AAPL' },
            { date: '2023-01-02', close: 120, open: 120, high: 120, low: 120, volume: 1200, ticker: 'AAPL' },
        ];
        const result = await calculatePercentageChange(stockData);
        expect(result).toBe(20);
    });

    it('should handle invalid dates', async () => {
        const stockData = [
            { date: 'invalid-date', close: 100, open: 0, high: 0, low: 0, volume: 0, ticker: '' },
            { date: '2023-01-02', close: 120, open: 0, high: 0, low: 0, volume: 0, ticker: '' },
        ];
        const result = await calculatePercentageChange(stockData);
        expect(result).toBe(0);
    });
});