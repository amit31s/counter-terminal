import { GetPouchDespatchResponseResponse, PouchAcceptanceStatus } from "@ct/api/generator";
import CustomPouchAcceptanceListComponent from "@ct/components/CustomPouchAcceptanceListComponent";

interface ScannedPouchListProps {
  pouchList: GetPouchDespatchResponseResponse[];
}

export const ScannedPouchList = ({ pouchList }: ScannedPouchListProps) => {
  return (
    <CustomPouchAcceptanceListComponent
      showDelete={false}
      parentdata={pouchList.map((item) => ({
        ...item,
        ...{
          isBranchValid: "true",
          isPouchValid: "true",
          isPouchValueAssociated: "true",
          status: PouchAcceptanceStatus.expected,
        },
      }))}
    />
  );
};
