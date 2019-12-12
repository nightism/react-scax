import { error } from '../common/utils';
import { IPool, IPoolView, TScaxerBatchConfiguration, TScaxerDataTypeMap } from '../types';
import Pool from './Pool';

const poolViewNameObjectMap: {
    [poolName: string]: IPoolView,
} = {};

/**
 * Create a pool uniquely identified by a name.
 * @param poolName a unique string used to identify the pool.
 * @generic `N`: shape like { [key: string]: IScaxerView<A, B, C, D> }
 */
export function createPool<TScaxerDataTypes extends TScaxerDataTypeMap>
    (poolName: string, scaxersConfigs: TScaxerBatchConfiguration<TScaxerDataTypes>): IPool<TScaxerDataTypes> {

    if (poolViewNameObjectMap[poolName]) {
        error('Repeated pool name.');
    }
    const newPool = new Pool<TScaxerDataTypes>(poolName, scaxersConfigs);

    poolViewNameObjectMap[poolName] = newPool;
    return newPool as IPool<TScaxerDataTypes>;
}

export function getPoolView(poolName: string): IPoolView {
    if (!poolViewNameObjectMap[poolName]) {
        error('Pool name does not exist.');
    }

    return poolViewNameObjectMap[poolName];
}
