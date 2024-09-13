
import { calculatePercentageChange } from "@/server-actions/calculate-returns";
describe('calculatePercentageChange', () => {
    it('should return 0 for empty stock data', async () => {
        const result = await calculatePercentageChange([]);
        expect(result).toBe(0);
    });

    it('should calculate percentage change correctly', async () => {
        const stockData = [
            { date: '2023-01-01', close: 100 },
            { date: '2023-01-02', close: 120 },
        ];
        const result = await calculatePercentageChange(stockData);
        expect(result).toBe(20);
    });

    it('should handle invalid dates', async () => {
        const stockData = [
            { date: 'invalid-date', close: 100 },
            { date: '2023-01-02', close: 120 },
        ];
        const result = await calculatePercentageChange(stockData);
        expect(result).toBe(0);
    });
});