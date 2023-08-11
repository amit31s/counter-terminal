import { PouchAcceptanceDetails } from "@ct/api/generator";
import CustomPouchAcceptanceListComponent from "@ct/components/CustomPouchAcceptanceListComponent";

interface ScannedPouchListProps {
  pouchList: PouchAcceptanceDetails[];
  deleteCallback: (data: PouchAcceptanceDetails[]) => void;
}

export const ScannedPouchList = ({ pouchList, deleteCallback }: ScannedPouchListProps) => {
  const handleDeleteItem = (barcode?: string) => {
    const filteredPouch = pouchList.filter((p) => p.pouchID !== barcode);
    deleteCallback(filteredPouch);
  };

  return (
    <CustomPouchAcceptanceListComponent parentdata={pouchList} onDeleteItem={handleDeleteItem} />
  );
};
