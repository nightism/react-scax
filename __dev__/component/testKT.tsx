import React from 'react';
// import { createAjaxJsonScaxerPromiseFunction } from '../src/promise/AjaxJson';
// import { AJAX_CALL_METHOD } from '../src/constants';
// import { TAjaxJsonPromiseFunctionType } from '../src/types';
import {
    attach, createPool, Template, TScaxerBatchConfiguration,
} from '../../src';
import { AJAX_CALL_METHOD, SCAXER_BLOCKING } from '../../src/common/constants';

const POOL_NAME = 'testPool';
const SCAXER_NAME_I = 'testScaxerI';
const SCAXER_NAME_II = 'testScaxerII';
const SCAXER_NAME_III = 'testScaxerIII';

let counter = 0;

type apiDataType = {
    [SCAXER_NAME_I]: {
        TDataType: number;
        // TErrorType: number;
        TResultType: { data: number, error: number };
        TReasonType: { error: number };
        // TParamType: string;
    };
    [SCAXER_NAME_III]: {
        TParamType: string;
        TDataType: string;
        // TErrorType: string;
        TResultType: { original: string, modified: string };
        // TReasonType: { error: string };
    };
    [SCAXER_NAME_II]: {
        TParamType: { num: number };
        TDataType: string;
        // TErrorType: string;
        TResultType: { data: string, error: number };
        // TReasonType: { error: string };
    };
};

// Scheme.changeSchemeSettings(Scheme.types.AJAX_JSON_SCHEME, { getOptions: () => {} });

const scaxerBatchConfigs: TScaxerBatchConfiguration<apiDataType> = {
    [SCAXER_NAME_I]: {
        blocking: SCAXER_BLOCKING.UPCOMING,
        mapReasonToError: reason => reason.error,
        mapResultToData: (result: { data: number, error: number }) => result.data,
        promise: param => new Promise(resolve => {
            // tslint:disable-next-line: no-console
            console.log(param);
            setTimeout(() => resolve({
                data: counter ++,
                error: 1,
            }), 2000);
        }),
    },
    [SCAXER_NAME_III]: {
        mapResultToData: result => result.modified,
        promise: (param: string) => new Promise(resolve => {
            setTimeout(() => resolve({
                modified: param + counter,
                original: param,
            }), 500);
        }),
    },
    [SCAXER_NAME_II]: {
        // promise: () => fetch('http://localhost:8000/api/v1/iam/test').then((response) => {
        //     return response.json();
        // }),
        // promise: Scheme.AjaxJson.craftPromiseFunction({ url: 'http://localhost:8000/api/v1/iam/test' }),
        mapResultToData: result => result.data,
        onFulfillment: SCAXER_NAME_III,
        // tslint:disable-next-line
        onRejection: () => { console.log('test'); },
        promise: Template.createPromise(Template.types.AJAX_JSON_TEMPLATE,
            { url: 'http://localhost:8000/api/v1/iam/test', method: AJAX_CALL_METHOD.GET }),
    },
};

const pool = createPool(POOL_NAME, scaxerBatchConfigs);
// pool.register({
//     [SCAXER_NAME_III]: {
//         promise: () => new Promise((resolve) => {
//             setTimeout(() => resolve({
//                 data: 'result',
//                 error: -1,
//             }), 500);
//         }),
//         mapResultToData: (result) => result.data,
//     },
// });

// const sc = pool.getScaxer(SCAXER_NAME_I);
// pool.getScaxer(SCAXER_NAME_II).getResult();
// pool.getScaxer(SCAXER_NAME_III).getResult();

class TestComponent extends React.Component<{ name: string }> {
    render() {
        const { name } = this.props;
        const scaxerTestI = pool.getScaxer(SCAXER_NAME_I);
        const scaxerTestII = pool.getScaxer(SCAXER_NAME_II);
        const scaxerTestIII = pool.getScaxer(SCAXER_NAME_III);

        const data = scaxerTestI.getData();
        const error = scaxerTestI.getError();
        const state = scaxerTestI.getState();

        const dataii = scaxerTestII.getData();
        const errorii = scaxerTestII.getError();
        const stateii = scaxerTestII.getState();

        const dataiii = scaxerTestIII.getData();
        const erroriii = scaxerTestIII.getError();
        const stateiii = scaxerTestIII.getState();

        return <div>
            <button onClick={() => scaxerTestI.call('test-string')}>Trigger1</button>
            <button onClick={() => scaxerTestII.call({ num: 10 })}>Trigger2</button>
            <button onClick={() => scaxerTestIII.call('dd')}>Trigger3</button>
            <div>data: {data} | {dataii} | {dataiii}</div>
            <div>error: {error} | {errorii} | {erroriii}</div>
            <div>state: {state} | {stateii} | {stateiii}</div>
            <div>props: {name}</div>
        </div>;
    }
}

export const AttachedClassComponent = attach(POOL_NAME, [SCAXER_NAME_I])(TestComponent);

export const ChainedAttachedClassComponent = attach(POOL_NAME, [SCAXER_NAME_II])(AttachedClassComponent);

export const AttachedClassComponentII = attach(POOL_NAME, [SCAXER_NAME_III])(TestComponent);

// export const ExplicitlyChainedAttachedClassComponent =
//     attach(POOL_NAME, [SCAXER_NAME_I])(attach(POOL_NAME, [SCAXER_NAME_II])(TestComponent));

// const TestFuncComponent = () => {
//     const scaxerTestI = getPool(POOL_NAME).getScaxer(SCAXER_NAME_I);
//     const scaxerTestII = getPool(POOL_NAME).getScaxer(SCAXER_NAME_II);

//     const data = scaxerTestI.getData();
//     const error = scaxerTestI.getError();
//     const state = scaxerTestI.getState();
//     const dataii = scaxerTestII.getData();
//     const errorii = scaxerTestII.getError();
//     const stateii = scaxerTestII.getState();

//     return <div>
//         <button onClick={() => scaxerTestI.call({ num: 1 })}>Trigger</button>
//         <button onClick={() => scaxerTestII.call({ num: 10 })}>Trigger</button>
//         <div>data: {data} | {dataii}</div>
//         <div>error: {error} | {errorii}</div>
//         <div>state: {state} | {stateii}</div>
//         {/* <div>props: {name}</div> */}
//     </div>;
// };

// export const AttachedFuncComponent = attach(POOL_NAME, [SCAXER_NAME_I])(TestFuncComponent);
// export const ChainedAttachedFuncComponent = attach(POOL_NAME, [SCAXER_NAME_II])(AttachedFuncComponent);
