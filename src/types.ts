import { SCAXER_BLOCKING, SCAXER_STATE } from './common/constants';

/********************************************************* */
/************ Promise Function Related Types⬇️ *************/
/********************************************************* */
export type TPromiseFunctionType<TParamType = any, TResultType = any>
= (param: TParamType) => Promise<TResultType>;
export type TCreateGenericPromiseFunctionType<TConfigType = any, TParamType = any, TResultType = any>
    = (config: TConfigType) => TPromiseFunctionType<TParamType, TResultType>;

function a() {

}

/********************************************************* */
/****************** Scaxer Related Types⬇️ *****************/
/********************************************************* */
/**
 * Field types in Scaxer
 */
export type TMapResultToDataType<TDataType = any, TResultType = any>
    = (result: TResultType) => TDataType | undefined;
export type TMapReasonToErrorType<TErrorType = any, TReasonType = any>
    = (reason: TReasonType) => TErrorType | undefined;
export type TOnFulfilmentType<TDataType = any, TResultType = any>
    = (data?: TDataType, result?: TResultType) => void;
export type TOnRejectionType<TErrorType = any, TReasonType = any>
    = (error?: TErrorType, reason?: TReasonType) => void;
export type THandleExceptionType
    = (exc: Error) => void;

/**
 * Scaxer subscriber callback
 */
export type TScaxerSubscriberType
    = () => void;

/**
 * Scaxer caller api
 */
export type TScaxerCallType<TParamType, TDataType, TErrorType, TResultType, TReasonType>
= (
    p: TParamType,
    extra?: {
        onFulfillment?: TOnFulfilmentType<TDataType, TResultType>,
        onRejection?: TOnRejectionType<TErrorType, TReasonType>,
    },
) => void;

/**
 * The data type of a scaxer.
 */
export interface IScaxerData {
    TParamType?: any;
    TDataType?: any;
    TErrorType?: any;
    TResultType?: any;
    TReasonType?: any;
}

/**
 * Batch of scaxers' data type.
 * This is used to define the data type for a batch of scaxer.
 */
export type TScaxerDataTypeMap = { [scaxerName: string]: IScaxerData };

/**
 * Interface used to normalize the Scaxer constructor intake.
 */
export interface IScaxerConfiguration<TScaxerDataType extends IScaxerData = IScaxerData> {
    promise?: TPromiseFunctionType<TScaxerDataType['TParamType'], TScaxerDataType['TResultType']>;
    blocking?: SCAXER_BLOCKING;

    mapResultToData?: TMapResultToDataType<TScaxerDataType['TDataType'], TScaxerDataType['TResultType']>;
    mapReasonToError?: TMapReasonToErrorType<TScaxerDataType['TErrorType'], TScaxerDataType['TReasonType']>;

    onFulfillment?: TOnFulfilmentType<TScaxerDataType['TDataType'], TScaxerDataType['TResultType']>;
    onRejection?: TOnRejectionType<TScaxerDataType['TErrorType'], TScaxerDataType['TReasonType']>;
    handleException?: THandleExceptionType;
}

/**
 * Scaxer sucessor configuration where another scaxer acts as the fulfillment successor
 */
interface IScaxerFulfillmentSuccessorConfiguration {
    onFulfillment?: string;
}

/**
 * Scaxer sucessor configuration where another scaxer acts as the rejection successor
 */
interface IScaxerRejectionSuccessorConfiguration {
    onRejection?: string;
}

/**
 * Scaxer configuration types for non-data-type-defined scaxer
 */
type TGenericBatchConfiguration = {
    [key: string]: IScaxerConfiguration
                   | IScaxerFulfillmentSuccessorConfiguration
                   | IScaxerRejectionSuccessorConfiguration;
};

/**
 * Scaxer configuration types for explicitly data-type-defined scaxer
 */
type TRestrictedScaxerBatchConfiguration<TScaxerDataTypes extends TScaxerDataTypeMap> = {
    [K in keyof TScaxerDataTypes]?: IScaxerConfiguration<TScaxerDataTypes[K]>
                                    | IScaxerFulfillmentSuccessorConfiguration
                                    | IScaxerRejectionSuccessorConfiguration;
};

/**
 * Scaxer configuration types for all.
 */
export type TScaxerBatchConfiguration<TScaxerDataTypes extends TScaxerDataTypeMap> =
    TRestrictedScaxerBatchConfiguration<TScaxerDataTypes> & TGenericBatchConfiguration;

/**
 * Generic to return a specific scaxer view type. Refer to IScaxerView interface for details.
 * This is used to get a specific scaxer view type from TScaxerDataTypeMap
 * and a given scaxer name type, which must be string literal type.
 */
export type TScaxerViewType<
        TScaxerDataTypes extends TScaxerDataTypeMap,
        K extends Extract<keyof TScaxerDataTypes, string>,
    > =
    IScaxerView<
        TScaxerDataTypes[K]['TParamType'],
        TScaxerDataTypes[K]['TDataType'],
        TScaxerDataTypes[K]['TErrorType'],
        TScaxerDataTypes[K]['TResultType'],
        TScaxerDataTypes[K]['TReasonType']
    >;

/**
 * Read-only scaxer type used to monitor and trigger the promise function call.
 * This is the type of scaxer instance returned to user.
 */
export interface IScaxerView
<TParamType = any, TDataType = any, TErrorType = any, TResultType = any, TReasonType = any> {
    readonly name: string;
    readonly getState: () => SCAXER_STATE | undefined;
    readonly getData: () => TDataType | undefined;
    readonly getError: () => TErrorType | undefined;
    readonly getResult: () => TResultType | undefined;
    readonly getReason: () => TReasonType | undefined;
    readonly call: TScaxerCallType<TParamType, TDataType, TErrorType, TResultType, TReasonType>;
    readonly isFulfilled: () => boolean;
}

/**
 * Scaxer type exposed to internal classes such as `attach`.
 */
export interface IScaxerManager {
    readonly name: string;
    readonly subscriberList: TScaxerSubscriberType[];
    readonly injectSubscription: (callBack: TScaxerSubscriberType) => (() => void);
    readonly updateSubscriber: () => void;
}

/**
 * Type of the scaxer map inside a pool instance.
 */
export type TScaxerMap = { [key: string]: (IScaxerView & IScaxerManager) };

/**
 * Scaxer intrisic strucutre and type defination.
 */
export interface IScaxer<TParamType, TDataType, TErrorType, TResultType, TReasonType> {
    readonly name: string;
    readonly blocking: SCAXER_BLOCKING;
    readonly promise: TPromiseFunctionType<TParamType, TResultType>;

    mapResultToData: TMapResultToDataType<TDataType, TResultType>;
    mapReasonToError: TMapReasonToErrorType<TErrorType, TReasonType>;

    // callback handlers
    onFulfillment: TOnFulfilmentType<TDataType, TResultType>;
    onRejection: TOnRejectionType<TErrorType, TReasonType>;
    handleException: THandleExceptionType;
}

/********************************************************* */
/******************* Pool Related Types⬇️ ******************/
/********************************************************* */
/**
 * IPool provides all apis that needed to create/retrieve a scaxer.
 */
export interface IGetScaxer<TScaxerDataTypes extends TScaxerDataTypeMap> {
    <K extends Extract<keyof TScaxerDataTypes, string>>(scaxerName: K): TScaxerViewType<TScaxerDataTypes, K>;
    (scaxerName: string): IScaxerView;
}

export interface IPool<TScaxerDataTypes extends TScaxerDataTypeMap> {
    name: string;
    getScaxer: IGetScaxer<TScaxerDataTypes>;
    register(newScaxer: TScaxerBatchConfiguration<TScaxerDataTypes>): void;
}

/**
 * This interface will be used internally, essentially by `attach`.
 */
export interface IPoolView {
    getScaxerManager(scaxerName: string): IScaxerManager;
}

/********************************************************* */
/****************** Attach Related Types⬇️ *****************/
/********************************************************* */
export type TAttachedComponentType<TProps, C> =
    React.ComponentType<TProps & React.RefAttributes<C>>
    & { render?: (props: TProps, ref?: React.LegacyRef<C>) => React.ReactElement };
export type TAttachWrapperComponentType<TProps> =
    React.ForwardRefExoticComponent<React.PropsWithoutRef<TProps> & React.RefAttributes<any>>;

export type TAttachHOC =
    <C extends TAttachedComponentType<React.ComponentProps<C>, C>>(component: C) =>
        TAttachWrapperComponentType<React.ComponentProps<C>>;

export interface IAttach {
    // tslint:disable-next-line
    (poolName: string, scaxerNames: string[]): TAttachHOC; // Reserved for polymorphism
}

/********************************************************* */
/****************** Scheme Related Types⬇️ *****************/
/********************************************************* */

/**
 * This interface defines scheme internal structure
 */
export interface ITemplate<TConfigType = any, TParamType = any, TResultType = any> {
    craftPromiseFunction: TCreateGenericPromiseFunctionType<TConfigType, TParamType, TResultType>;
}

export interface IStaticTemplate<TConfigType = any> {
    configure: (param: TConfigType) => void;
}
