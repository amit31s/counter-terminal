import { useValidatePreparedPouches } from "@ct/api/generator";

export const usePouchDispatchScanner = ({ queryString }: { queryString: string }) => {
  const { data: pouchScanData, isSuccess } = useValidatePreparedPouches(
    {
      barcode: queryString,
    },
    {
      query: {
        enabled: queryString !== "",
      },
    },
  );

  return { pouchScanData, isSuccess };
};
