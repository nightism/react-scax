import assert from 'assert';
import { SCAXER_BLOCKING, SCAXER_STATE } from '../common/constants';
import {
    IScaxer, IScaxerConfiguration, IScaxerManager, IScaxerView,
    TPromiseFunctionType, TScaxerSubscriberType,
} from '../types';

interface ICancelablePromise<TResultType> {
    promise: Promise<TResultType>;
    cancel: () => void;
}

export default class Scaxer<TParamType, TDataType, TErrorType, TResultType, TReasonType>
implements IScaxerView<TParamType, TDataType, TErrorType, TResultType, TReasonType>,
IScaxerManager, IScaxer<TParamType, TDataType, TErrorType, TResultType, TReasonType> {
    readonly name: string;
    readonly blocking: SCAXER_BLOCKING = SCAXER_BLOCKING.BLOCKING; // todo replace this line with logic
    readonly promise: TPromiseFunctionType<TParamType, TResultType>
        = ((param: TParamType) => new Promise<TResultType>((resolve, reject) => {}));

    subscriberList: TScaxerSubscriberType[];

    private ongoingPromise: ICancelablePromise<TResultType> | null = null;
    private state: SCAXER_STATE;
    private data?: TDataType;
    private error?: TErrorType;
    private result?: TResultType;
    private reason?: TReasonType;

    constructor(scaxerName: string, scaxerConfiguration: IScaxerConfiguration) {
        this.name = scaxerName;
        this.promise = scaxerConfiguration.promise || this.promise;
        this.blocking = scaxerConfiguration.blocking || this.blocking;

        this.mapResultToData = scaxerConfiguration.mapResultToData || this.mapResultToData;
        this.mapReasonToError = scaxerConfiguration.mapReasonToError || this.mapReasonToError;

        this.onFulfillment = scaxerConfiguration.onFulfillment || this.onFulfillment;
        this.onRejection = scaxerConfiguration.onRejection || this.onRejection;
        this.handleException = scaxerConfiguration.handleException || this.handleException;

        this.state = SCAXER_STATE.WAITING;
        this.subscriberList = [];
    }

    mapResultToData = (result: TResultType): TDataType | undefined => undefined;
    mapReasonToError = (result: TReasonType): TErrorType | undefined => undefined;

    onFulfillment = (data?: TDataType) => {};
    onRejection = (error?: TErrorType) => {};
    handleException = (exc: Error): void => { throw exc; };

    getState = (): SCAXER_STATE | undefined => {
        return this.state;
    }

    getData = (): TDataType | undefined => {
        if (this.state !== SCAXER_STATE.FULFILLED) {
            return undefined;
        }
        return this.data;
    }

    getError = (): TErrorType | undefined => {
        if (this.state !== SCAXER_STATE.REJECTED) {
            return undefined;
        }
        return this.error;
    }

    getResult = (): TResultType | undefined => {
        if (this.state !== SCAXER_STATE.FULFILLED) {
            return undefined;
        }
        return this.result;
    }

    getReason = (): TReasonType | undefined => {
        if (this.state !== SCAXER_STATE.REJECTED) {
            return undefined;
        }
        return this.reason;
    }

    /**
     * This method is used in attach() when creating the HOC wrapper.
     * It will return a callback function for the component to unsbscribe
     * itself from the scaxer's subscriber list.
     */
    injectSubscription(callBack: TScaxerSubscriberType): () => void {
        assert(callBack, new Error('Failed to attach component: cannot inject ' + callBack + ' as callback function.'));
        this.subscriberList.push(callBack);

        const unsubscribe: () => void = () => {
            const index: number = this.subscriberList.indexOf(callBack);
            this.subscriberList.splice(index, 1);
        };

        return unsubscribe;
    }

    call = (params: TParamType): void => {
        if (this.blocking === SCAXER_BLOCKING.UPCOMING) {
            if (this.ongoingPromise) {
                this.ongoingPromise.cancel();
            }
        } else if (this.blocking === SCAXER_BLOCKING.BLOCKING) {
            if (this.ongoingPromise) {
                return;
            }
        } else if (this.blocking === SCAXER_BLOCKING.IGNORING) {
        }

        this.ongoingPromise = this.makeCancelablePromise(params);
        this.ongoingPromise.promise.catch((error: any) => {
            if (!error.isCanceld) {
                throw new Error(error);
            }
        });
    }

    updateSubscriber = (): void => {
        this.subscriberList.forEach((subscriberHandler: TScaxerSubscriberType) => { subscriberHandler(); });
    }

    private clearCache: () => void = (): void => {
        this.data = undefined;
        this.error = undefined;
        this.result = undefined;
    }

    /**
     * This method will resolve the Scaxer Promise and update all the
     * subscribers accordingly using the callback passes in.
     * @param params any parameters uesd by the promise function
     * @return ICancelablePromise<TResultType> object including a cancle() property
     */
    private makeCancelablePromise: (params: TParamType) => ICancelablePromise<TResultType> = (params: TParamType) => {
        let canceled = false;

        this.state = SCAXER_STATE.RESOLVING;
        this.updateSubscriber();

        this.clearCache();

        const wrappedPromise = new Promise<TResultType>((resolve, reject) => {
            this.promise(params).then((result: TResultType) => {
                if (canceled) {
                    reject({isCanceld: true});
                } else {
                    this.result = result;
                    this.data = this.mapResultToData(result);
                    this.state = SCAXER_STATE.FULFILLED;
                }
            }, (reason: TReasonType) => {
                if (canceled) {
                    reject({isCanceld: true});
                } else {
                    this.reason = reason;
                    this.error = this.mapReasonToError(reason);
                    this.state = SCAXER_STATE.REJECTED;
                }
            }).catch((err: Error) => {
                if (canceled) {
                    reject({isCanceld: true});
                } else {
                    // Catch all other errors occured in mapResultToData and mapReasonToError
                    // self-contained error handling, errors will not be catched outside
                    this.handleException(err);
                    this.state = SCAXER_STATE.INTERRUPTED;
                }
            }).finally(() => {
                if (canceled) {
                    reject({isCanceld: true});
                } else {
                    // update all subscribers
                    this.updateSubscriber();

                    // perform all subsequence actions and callbacks
                    if (this.state === SCAXER_STATE.FULFILLED) {
                        this.onFulfillment(this.data);
                    } else if (this.state === SCAXER_STATE.REJECTED) {
                        this.onRejection(this.error);
                    }

                    // resovle this promise in the end
                    this.ongoingPromise = null;
                    resolve();
                }
            });
        });

        return {
            cancel: () => {
                canceled = true;
            },
            promise: wrappedPromise,
        };
    }
}
