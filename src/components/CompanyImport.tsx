import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function CompanyImport() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Starting file upload...");
      const { data, error } = await supabase.functions.invoke(
        "import-companies",
        {
          body: formData,
        }
      );

      console.log("Response from import-companies:", { data, error });

      if (error) {
        console.error("Import error:", error);
        throw error;
      }

      if (!data) {
        console.error("No data returned from import");
        throw new Error("No response data received");
      }

      setProgress(100);

      // Check for duplicates in a type-safe way
      const duplicates = Array.isArray(data.duplicates) ? data.duplicates : [];

      if (duplicates.length > 0) {
        toast({
          title: "Import completed with duplicates",
          description: `${duplicates.length} duplicate companies were skipped.`,
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: data.message || "Companies imported successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to import companies",
      });
    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Import Companies</h2>
      <p className="text-sm text-gray-600">
        Upload a CSV file containing company information.
      </p>

      <div className="flex items-center gap-4 w-full">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
          disabled={isUploading}
        />
        <label htmlFor="csv-upload">
          <Button disabled={isUploading} asChild>
            <span>{isUploading ? "Uploading..." : "Upload CSV"}</span>
          </Button>
        </label>
        {isUploading && <Progress value={progress} className="w-[200px]" />}
      </div>

      <div className="text-sm text-gray-500">
        <p>Required CSV columns:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Company Name (or any column containing "name" or "company")</li>
          <li>City (or any column containing "city")</li>
          <li>State (optional, defaults to TX)</li>
          <li>Address (optional)</li>
          <li>Phone (optional)</li>
          <li>Website (optional)</li>
          <li>Google Rating (optional)</li>
          <li>Yelp Rating (optional)</li>
        </ul>
      </div>
    </div>
  );
}
