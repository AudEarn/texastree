'use client'

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { importCompanies } from "@/lib/importCompanies";
import { companiesData } from "@/lib/importData";
import { useQuery } from "@tanstack/react-query";

export const AdminControls = () => {
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const handleImportData = async () => {
    try {
      console.log("Starting import of companies...");
      const results = await importCompanies(companiesData);
      console.log("Import completed:", results);
      toast({
        title: "Success",
        description: `Successfully imported ${results.length} companies`,
      });
    } catch (error) {
      console.error("Error importing companies:", error);
      toast({
        title: "Error",
        description: "Failed to import companies. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch companies count with better error handling and caching
  const {
    data: companiesCount,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companiesCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tree_service_companies")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching companies count:", error);
        throw error;
      }

      return count;
    },
    // Add caching and retry configuration
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry failed queries 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  return (
    <>
      {profile?.is_admin && (
        <div className="bg-gray-50 p-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Admin Controls</h2>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleImportData}
                className="bg-forest-600 hover:bg-forest-700"
              >
                Import Company Data
              </Button>
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : error ? (
                  "Error loading count"
                ) : (
                  `Current companies in database: ${companiesCount || 0}`
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
