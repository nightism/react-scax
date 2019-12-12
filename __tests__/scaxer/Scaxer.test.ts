import Scaxer from '../../src/scaxer/Scaxer';
import { IScaxerConfiguration } from '../../src/types';
import * as shared from '../shared';

test('Scaxer: Instantiate scaxer from given data type', () => {
    const SampleScaxer = new Scaxer(shared.API1_NAME, shared.apiConfig[shared.API1_NAME] as IScaxerConfiguration);
    expect(SampleScaxer).toBeInstanceOf(Scaxer);
});
