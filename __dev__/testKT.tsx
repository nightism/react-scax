import React from 'react';
// // import { createAjaxJsonScaxerPromiseFunction } from '../src/promise/AjaxJson';
// // import { AJAX_CALL_METHOD } from '../src/constants';
// // import { TAjaxJsonPromiseFunctionType } from '../src/types';
// import { createPool, SchemeType, AjaxCallMethod, attach, IScaxerView, TScaxerBatchConfiguration } from '../src';

// const POOL_NAME = 'testPool';
// const SCAXER_NAME_I = 'testScaxerI';
// const SCAXER_NAME_II = 'testScaxerII';
// const SCAXER_NAME_III = 'testScaxerIII';

// let counter = 0;

// type apiDataType = {
//     [SCAXER_NAME_I]: {
//         TDataType: number;
//         // TErrorType: number;
//         TResultType: { data: number, error: number };
//         TReasonType: { error: number };
//         // TParamType: string;
//     };
//     [SCAXER_NAME_II]: {
//         TDataType: string;
//         TErrorType: string;
//         TResultType: { data: string, error: number };
//         TReasonType: { error: string };
//         TParamType: { num: number };
//     };
//     // [SCAXER_NAME_III]: {
//     //     TDataType: string;
//     //     TErrorType: string;
//     //     TResultType: { data: string, error: number };
//     //     TReasonType: { error: string };
//     // };
// };

// const scaxerBatchConfigs: TScaxerBatchConfiguration<apiDataType> = {
//     [SCAXER_NAME_I]: {
//         promise: (param) => new Promise<apiDataType[typeof SCAXER_NAME_I]['TResultType']>((resolve) => {
//             console.log(param);
//             setTimeout(() => resolve({
//                 data: counter ++,
//                 error: 1,
//             }), 500);
//         }),
//         mapResultToData: (result: { data: number, error: number }) => result.data,
//         mapReasonToError: (reason) => reason.error,

//     },
//     [SCAXER_NAME_II]: {
//         promise: () => new Promise<apiDataType[typeof SCAXER_NAME_II]['TResultType']>((resolve) => {
//             setTimeout(() => resolve({
//                 data: 'result',
//                 error: -1,
//             }), 500);
//         }),
//         mapResultToData: (result) => result.data,
//     },
//     [SCAXER_NAME_III]: {},
// };

// const pool = createPool(POOL_NAME, scaxerBatchConfigs);
// // pool.register({
// //     [SCAXER_NAME_III]: {
// //         promise: () => new Promise((resolve) => {
// //             setTimeout(() => resolve({
// //                 data: 'result',
// //                 error: -1,
// //             }), 500);
// //         }),
// //         mapResultToData: (result) => result.data,
// //     },
// // });
// const sc = pool.getScaxer(SCAXER_NAME_I);
// pool.getScaxer(SCAXER_NAME_II).getResult();
// pool.getScaxer(SCAXER_NAME_III).getResult();

// class TestComponent extends React.Component<{ name: string }> {
//     render() {
//         const { name } = this.props;
//         const scaxerTestI = pool.getScaxer(SCAXER_NAME_I);
//         const scaxerTestII = pool.getScaxer(SCAXER_NAME_II);

//         const data = scaxerTestI.getData();
//         const error = scaxerTestI.getError();
//         const state = scaxerTestI.getState();
//         const dataii = scaxerTestII.getData();
//         const errorii = scaxerTestII.getError();
//         const stateii = scaxerTestII.getState();

//         return <div>
//             <button onClick={() => scaxerTestI.call('string')}>Trigger</button>
//             <button onClick={() => scaxerTestII.call({ num: 10 })}>Trigger</button>
//             <div>data: {data} | {dataii}</div>
//             <div>error: {error} | {errorii}</div>
//             <div>state: {state} | {stateii}</div>
//             <div>props: {name}</div>
//         </div>;
//     }
// }

// export const AttachedClassComponent = attach(POOL_NAME, [SCAXER_NAME_I])(TestComponent);

// export const ChainedAttachedClassComponent = attach(POOL_NAME, [SCAXER_NAME_II])(AttachedClassComponent);

// // export const ExplicitlyChainedAttachedClassComponent =
// //     attach(POOL_NAME, [SCAXER_NAME_I])(attach(POOL_NAME, [SCAXER_NAME_II])(TestComponent));

// // const TestFuncComponent = () => {
// //     const scaxerTestI = getPool(POOL_NAME).getScaxer(SCAXER_NAME_I);
// //     const scaxerTestII = getPool(POOL_NAME).getScaxer(SCAXER_NAME_II);

// //     const data = scaxerTestI.getData();
// //     const error = scaxerTestI.getError();
// //     const state = scaxerTestI.getState();
// //     const dataii = scaxerTestII.getData();
// //     const errorii = scaxerTestII.getError();
// //     const stateii = scaxerTestII.getState();

// //     return <div>
// //         <button onClick={() => scaxerTestI.call({ num: 1 })}>Trigger</button>
// //         <button onClick={() => scaxerTestII.call({ num: 10 })}>Trigger</button>
// //         <div>data: {data} | {dataii}</div>
// //         <div>error: {error} | {errorii}</div>
// //         <div>state: {state} | {stateii}</div>
// //         {/* <div>props: {name}</div> */}
// //     </div>;
// // };

// // export const AttachedFuncComponent = attach(POOL_NAME, [SCAXER_NAME_I])(TestFuncComponent);
// // export const ChainedAttachedFuncComponent = attach(POOL_NAME, [SCAXER_NAME_II])(AttachedFuncComponent);
