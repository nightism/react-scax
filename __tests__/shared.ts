import { SCAXER_BLOCKING } from '../src/common/constants';
import { TScaxerBatchConfiguration } from '../src/types';

export const API1_NAME = 'api1';
export const API2_NAME = 'api1';

export const POOL_NAME = 'SamplePool1';
export const EMPTY_POOL_NAME = 'SamplePool2';

export type TApiDataType = {
    [API1_NAME]: {
        TDataType: number;
        TErrorType: number;
        TResultType: { data: number, error: number };
        TReasonType: { error: number };
        TParamType: boolean;
    };
};

export const apiConfig: TScaxerBatchConfiguration<TApiDataType> = {
    [API1_NAME]: {
        promise: param => new Promise((resolve, reject) => {
            if (param) {
                setTimeout(() => resolve({
                    data: 2,
                    error: 1,
                }), 2000);
            } else {
                reject({ error: 3 });
            }
        }),
        mapResultToData: result => result.data,
        mapReasonToError: reason => reason.error,
        blocking: SCAXER_BLOCKING.BLOCKING,
        onFulfillment: () => 'Scaxer fullfilled',
        onRejection: () => 'Scaxer rejected',
        handleException: exce => exce,
    },
};

export const apiConfigForRegitster: TScaxerBatchConfiguration<TApiDataType> = {
    [API2_NAME]: {
        promise: param => new Promise((resolve, reject) => {
            if (param) {
                setTimeout(() => resolve({
                    data: 2,
                    error: 1,
                }), 2000);
            } else {
                reject({ error: 3 });
            }
        }),
        mapResultToData: result => result.data,
        mapReasonToError: reason => reason.error,
    },
};
