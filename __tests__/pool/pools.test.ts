import { createPool } from '../../src/pool/pools';
import Pool from '../../src/pool/Pool';
import * as shared from '../shared';

test('createPool: Create Pool with api config', () => {
    const SamplePool = createPool(shared.POOL_NAME, shared.apiConfig);
    expect(SamplePool).toBeInstanceOf(Pool);
});

test('createPool: Create Pool without api config', () => {
    const SamplePoolEmpty = createPool(shared.EMPTY_POOL_NAME, {});
    expect(SamplePoolEmpty).toBeInstanceOf(Pool);
});
