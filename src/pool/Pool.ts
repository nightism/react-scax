import { error } from '../common/utils';
import Scaxer from '../scaxer/Scaxer';
import {
    IPool, IPoolView,
    IScaxerConfiguration, IScaxerManager,
    TScaxerBatchConfiguration, TScaxerDataTypeMap,
    TScaxerMap, TScaxerViewType,
} from '../types';

/**
 * Pool is the top-level unit in react-scax, containing serveral scaxers.
 * @generic `TScaxerDataTypes`: shape like { [key: string]: IScaxerView<A, B, C, D> }
 */
export default class Pool<TScaxerDataTypes extends TScaxerDataTypeMap> implements IPool<TScaxerDataTypes>, IPoolView {
    name: string;
    private scaxers: TScaxerMap;

    constructor(poolName: string, scaxersConfigs: TScaxerBatchConfiguration<TScaxerDataTypes>) {
        this.name = poolName;
        this.scaxers = {};
        this.register(scaxersConfigs);
    }

    /**
     * Use this API to register new Scaxer in current Pool. This is the only entry for creating new Scaxer.
     * @param newScaxer an object or a list of new scaxer configuration together with some schemes.
     */
    register(
        newScaxer: TScaxerBatchConfiguration<TScaxerDataTypes>,
    ) {
        Object.keys(newScaxer).forEach(scaxerName => this.registerAtom(scaxerName, newScaxer[scaxerName] as any));
    }

    /**
     * Retrieved the Scaxer object given its name.
     * @param scaxerName the name of the registered scaxer.
     */
    getScaxer<K extends Extract<keyof TScaxerDataTypes, string>>(
        scaxerName: K,
    ): TScaxerViewType<TScaxerDataTypes, K> {
        const scaxer = this.scaxers[scaxerName];
        if (!scaxer) {
            error('Unknown scaxer name');
        }
        return scaxer as any as TScaxerViewType<TScaxerDataTypes, K>;
    }

    /**
     * Used internally in react-scax. Used to get Scaxer Manager which controls component subscribers.
     * @param scaxerName the name of the registered scaxer.
     */
    getScaxerManager(scaxerName: string): IScaxerManager {
        const scaxer = this.scaxers[scaxerName];
        if (!scaxer) {
            error('Unknown scaxer name');
        }
        return scaxer;
    }

    /**
     * This method will create a signle scaxer and registered it in current `Pool`.
     * @param newScaxer `IScaxerConfiguration` object for scaxer configuration
     * @param scheme `ISchemeBuilder` object for scheme configuration (optional)
     */
    private registerAtom(
        scaxerName: string,
        newScaxer: IScaxerConfiguration<TScaxerDataTypes[keyof TScaxerDataTypes]>,
    ) {
        if (typeof newScaxer.onFulfillment === 'string') {
            newScaxer.onFulfillment = this.scaxers[newScaxer.onFulfillment].call;
        }
        if (typeof newScaxer.onRejection === 'string') {
            newScaxer.onFulfillment = this.scaxers[newScaxer.onRejection].call;
        }

        const newScaxerInstance = new Scaxer(scaxerName, newScaxer as any);
        this.scaxers[scaxerName] = newScaxerInstance;
    }
}
