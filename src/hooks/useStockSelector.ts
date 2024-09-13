import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { companies } from "@/lib/companies";

export const useStockSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTicker = searchParams.get("ticker") || companies[0].ticker;
  const [startDate, setStartDate] = useState<string>(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState<string>(
    searchParams.get("endDate") || ""
  );

  // Update stock ticker and reset dates in the URL
  const handleStockChange = (ticker: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("ticker", ticker);
    params.delete("startDate"); 
    params.delete("endDate"); 
    setStartDate("");
    setEndDate("");
    router.push(`/?${params.toString()}`);
  };

  // Update startDate and endDate in the URL when they are set
  const handleDateChange = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams);
    if (start) params.set("startDate", start);
    else params.delete("startDate");
    if (end) params.set("endDate", end);
    else params.delete("endDate"); 
    router.push(`/?${params.toString()}`);
  };

  return {
    currentTicker,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleStockChange,
    handleDateChange,
  };
};
