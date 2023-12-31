/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Transfer Transactions
 * PO Transactions
 * OpenAPI spec version: 0.1.0
 */
import {
  useMutation
} from 'react-query'
import type {
  UseMutationOptions,
  MutationFunction
} from 'react-query'
import type {
  Response,
  Error,
  TransferCore
} from '../../model'
import { useCustomInstance } from '../../mutator/useCustomInstance'
import type { ErrorType } from '../../mutator/useCustomInstance'


/**
 * @summary This endpoint is used to create transfer transaction
 */
export const usePostTransferTransactionHook = () => {
        const postTransferTransaction = useCustomInstance<Response>();

        return (
    transferCore: TransferCore,
 ) => {
        return postTransferTransaction(
          {url: `/transaction`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: transferCore
    },
          );
        }
      }
    


    export type PostTransferTransactionMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostTransferTransactionHook>>>>
    export type PostTransferTransactionMutationBody = TransferCore
    export type PostTransferTransactionMutationError = ErrorType<Error | void>

    export const usePostTransferTransaction = <TError = ErrorType<Error | void>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostTransferTransactionHook>>>, TError,{data: TransferCore}, TContext>, }
) => {
      const {mutation: mutationOptions} = options ?? {};

      const postTransferTransaction =  usePostTransferTransactionHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostTransferTransactionHook>>>, {data: TransferCore}> = (props) => {
          const {data} = props ?? {};

          return  postTransferTransaction(data,)
        }

      return useMutation<Awaited<ReturnType<typeof postTransferTransaction>>, TError, {data: TransferCore}, TContext>(mutationFn, mutationOptions)
    }
    