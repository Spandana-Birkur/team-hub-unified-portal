import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api";

export const useCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: companiesApi.getCompanies,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}