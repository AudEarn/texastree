import { ClaimListingForm } from "@/components/claim-listing/ClaimListingForm";

const ClaimListing = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Claim Your Business Listing</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <ClaimListingForm />
        </div>
      </div>
    </div>
  );
};

export default ClaimListing;