interface CustomerInformationProps {
  lead: any;
  editingCity: boolean;
  newCity: string;
  setNewCity: (city: string) => void;
  handleCityEdit: () => void;
  setEditingCity: (editing: boolean) => void;
}

export const CustomerInformation = ({
  lead,
  editingCity,
  newCity,
  setNewCity,
  handleCityEdit,
  setEditingCity,
}: CustomerInformationProps) => {
  return (
    <div>
      <h3 className="font-semibold">Customer Information</h3>
      <div className="mt-2 space-y-2">
        <p>
          <span className="font-medium">Name:</span> {lead.full_name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {lead.email}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {lead.phone}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium">City:</span>
          {lead.city}
        </div>
        <p>
          <span className="font-medium">Address:</span> {lead.address}
        </p>
      </div>
    </div>
  );
};
