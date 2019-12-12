import Pool from '../../src/pool/Pool';
import Scaxer from '../../src/scaxer/Scaxer';
import * as shared from '../shared';

test('Pool: Instantiate Pool with api config', () => {
    const SamplePool = new Pool<shared.TApiDataType>(shared.POOL_NAME, shared.apiConfig);
    expect(SamplePool).toBeInstanceOf(Pool);
    expect(SamplePool.name).toBe(shared.POOL_NAME);
    expect(SamplePool.getScaxer(shared.API1_NAME)).toBeInstanceOf(Scaxer);
    expect(SamplePool.register(shared.apiConfigForRegitster)).toBeUndefined();
    expect(SamplePool.getScaxer(shared.API2_NAME)).toBeInstanceOf(Scaxer);
    expect(SamplePool.getScaxerManager(shared.API1_NAME)).toBeInstanceOf(Scaxer);
});

test('Pool: Instantiate Pool without api config', () => {
    const SamplePoolEmpty = new Pool(shared.EMPTY_POOL_NAME, {});
    expect(SamplePoolEmpty).toBeInstanceOf(Pool);
    expect(SamplePoolEmpty.name).toBe(shared.EMPTY_POOL_NAME);
    expect(() => SamplePoolEmpty.getScaxer(shared.API1_NAME)).toThrow(Error);
    expect(SamplePoolEmpty.register(shared.apiConfigForRegitster)).toBeUndefined();
    expect(SamplePoolEmpty.getScaxer(shared.API2_NAME)).toBeInstanceOf(Scaxer);
});
