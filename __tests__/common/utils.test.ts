import React from 'react';
import {
    encodeObjectAsQueryString,
    error,
    isAttachWrapper,
    isClassComponent,
} from '../../src/common/utils';

import { createPool } from '../../src/pool/pools';
import attach from '../../src/attach';

test('error: throw error', () => {
    expect(error).toThrow(Error);
});

test('encodeObjectAsQueryString: encode a number', () => {
    const encodedString = encodeObjectAsQueryString({ a: 1 });
    expect(encodedString).toBe('a=1');
});

test('encodeObjectAsQueryString: encode a string', () => {
    const encodedString = encodeObjectAsQueryString({ a: 'test' });
    expect(encodedString).toBe('a=test');
});

class SampleClassComponent extends React.Component {
    render() {
        return null;
    }
}

function SampleFunctionComponent(props: any) {
    return null;
}

let SampleAttachWrapperFromClassComponent: any;
let SampleAttachWrapperFromFunctionComponent: any;
createPool('SamplePool', {});
SampleAttachWrapperFromClassComponent = attach('SamplePool', [])(SampleClassComponent);
SampleAttachWrapperFromFunctionComponent = attach('SamplePool', [])(SampleFunctionComponent);

test('isAttachWrapper: test an original class component', () => {
    const result = isAttachWrapper(SampleClassComponent);
    expect(result).toBe(false);
});
test('isAttachWrapper: test an original function component', () => {
    const result = isAttachWrapper(SampleFunctionComponent);
    expect(result).toBe(false);
});
test('isAttachWrapper: test an AttachWrapper from a class component', () => {
    const result = isAttachWrapper(SampleAttachWrapperFromClassComponent);
    expect(result).toBe(true);
});
test('isAttachWrapper: test an AttachWrapper from a function component', () => {
    const result = isAttachWrapper(SampleAttachWrapperFromFunctionComponent);
    expect(result).toBe(true);
});

test('isClassComponent: test an original class component', () => {
    const result = isClassComponent(SampleClassComponent);
    expect(result).toBe(true);
});
test('isClassComponent: test an original function component', () => {
    const result = isClassComponent(SampleFunctionComponent);
    expect(result).toBe(false);
});
test('isClassComponent: test an AttachWrapper from a class component', () => {
    const result = isClassComponent(SampleAttachWrapperFromClassComponent);
    expect(result).toBe(false);
});
test('isClassComponent: test an AttachWrapper from a function component', () => {
    const result = isClassComponent(SampleAttachWrapperFromFunctionComponent);
    expect(result).toBe(false);
});
