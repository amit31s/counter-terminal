/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * BBO Pouch Management Api
 * Replaces `pouch-management-api` Pouch Management API defining how to get and modify Pouch data
 * OpenAPI spec version: 0.1.0
 */
import {
  useQuery
} from 'react-query'
import type {
  UseQueryOptions,
  QueryFunction,
  UseQueryResult,
  QueryKey
} from 'react-query'
import type {
  GetPouchDespatchResponseResponse,
  NoContentResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  FailureResponseResponse
} from '../../model'
import { useCustomInstance } from '../../mutator/useCustomInstance';
import type { ErrorType } from '../../mutator/useCustomInstance';


/**
 * This Api is to validate the prepared pouch in the branch and will be used for Pouch Despatch process
 * @summary Validate Prepared Pouch
 */
export const useGetDespatchValidateHook = () => {
        const getDespatchValidate = useCustomInstance<GetPouchDespatchResponseResponse | NoContentResponse>();

        return (
    pouchID: string,
 signal?: AbortSignal
) => {
        return getDespatchValidate(
          {url: `/v1/despatch/validate/${pouchID}`, method: 'get', signal
    },
          );
        }
      }
    

export const getGetDespatchValidateQueryKey = (pouchID: string,) => [`/v1/despatch/validate/${pouchID}`] as const;
  

    
export type GetDespatchValidateQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetDespatchValidateHook>>>>
export type GetDespatchValidateQueryError = ErrorType<BadRequestResponse | UnauthorizedResponse | ForbiddenResponse | FailureResponseResponse>

export const useGetDespatchValidate = <TData = Awaited<ReturnType<ReturnType<typeof useGetDespatchValidateHook>>>, TError = ErrorType<BadRequestResponse | UnauthorizedResponse | ForbiddenResponse | FailureResponseResponse>>(
 pouchID: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetDespatchValidateHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetDespatchValidateQueryKey(pouchID);

  const getDespatchValidate =  useGetDespatchValidateHook();


  const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetDespatchValidateHook>>>> = ({ signal }) => getDespatchValidate(pouchID, signal);


  

  const query = useQuery<Awaited<ReturnType<ReturnType<typeof useGetDespatchValidateHook>>>, TError, TData>({ queryKey, queryFn, enabled: !!(pouchID), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

