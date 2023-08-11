/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * transactionsViewer
 * PO Transactions Viewer
 * OpenAPI spec version: 0.1.0
 */
import type { QueryFunction, QueryKey, UseQueryOptions, UseQueryResult } from "react-query";
import { useQuery } from "react-query";
import type {
  ErrorResp,
  GetItemCountsParams,
  GetTransactionsParams,
  ItemCounts,
  Transactions,
} from "../../model";
import type { ErrorType } from "../../mutator/useCustomInstance";
import { useCustomInstance } from "../../mutator/useCustomInstance";

/**
 * @summary Get Transactions
 */
export const useGetTransactionsHook = () => {
  const getTransactions = useCustomInstance<Transactions>();

  return (
    branch: string,
    from: number,
    to: number,
    params?: GetTransactionsParams,
    signal?: AbortSignal,
  ) => {
    return getTransactions({
      url: `/branch/${branch}/from/${from}/to/${to}/transactions`,
      method: "get",
      params,
      signal,
    });
  };
};

export const getGetTransactionsQueryKey = (
  branch: string,
  from: number,
  to: number,
  params?: GetTransactionsParams,
) => [`/branch/${branch}/from/${from}/to/${to}/transactions`, ...(params ? [params] : [])];

export type GetTransactionsQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetTransactionsHook>>>
>;
export type GetTransactionsQueryError = ErrorType<ErrorResp>;

export const useGetTransactions = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetTransactionsHook>>>,
  TError = ErrorType<ErrorResp>,
>(
  branch: string,
  from: number,
  to: number,
  params?: GetTransactionsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetTransactionsHook>>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTransactionsQueryKey(branch, from, to, params);

  const getTransactions = useGetTransactionsHook();

  const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetTransactionsHook>>>> = ({
    signal,
  }) => getTransactions(branch, from, to, params, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetTransactionsHook>>>,
    TError,
    TData
  >(queryKey, queryFn, { enabled: !!(branch && from && to), ...queryOptions }) as UseQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};

/**
 * @summary Get Item Counts
 */
export const useGetItemCountsHook = () => {
  const getItemCounts = useCustomInstance<ItemCounts>();

  return (
    branch: string,
    from: number,
    to: number,
    params?: GetItemCountsParams,
    signal?: AbortSignal,
  ) => {
    return getItemCounts({
      url: `/branch/${branch}/from/${from}/to/${to}/itemCounts`,
      method: "get",
      params,
      signal,
    });
  };
};

export const getGetItemCountsQueryKey = (
  branch: string,
  from: number,
  to: number,
  params?: GetItemCountsParams,
) => [`/branch/${branch}/from/${from}/to/${to}/itemCounts`, ...(params ? [params] : [])];

export type GetItemCountsQueryResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof useGetItemCountsHook>>>
>;
export type GetItemCountsQueryError = ErrorType<ErrorResp>;

export const useGetItemCounts = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetItemCountsHook>>>,
  TError = ErrorType<ErrorResp>,
>(
  branch: string,
  from: number,
  to: number,
  params?: GetItemCountsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetItemCountsHook>>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetItemCountsQueryKey(branch, from, to, params);

  const getItemCounts = useGetItemCountsHook();

  const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetItemCountsHook>>>> = ({
    signal,
  }) => getItemCounts(branch, from, to, params, signal);

  const query = useQuery<
    Awaited<ReturnType<ReturnType<typeof useGetItemCountsHook>>>,
    TError,
    TData
  >(queryKey, queryFn, { enabled: !!(branch && from && to), ...queryOptions }) as UseQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
};