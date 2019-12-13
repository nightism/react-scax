# React-Scax

[![npm version](https://badge.fury.io/js/react-scax.svg)](https://badge.fury.io/js/react-scax)

React-Scax is an NPM package intended to synchronize AJAX calls and JavaScript Promise resolution in React Application.

## Installation

Use the package manager [npm](https://docs.npmjs.com/cli/install) to install react-scax.

```bash
npm install react-scax
```

## Usage
### Quick Start
```javascript
import React from 'react'
import {
    attach, AjaxCallMethod, createPool, Template,
} from 'react-scax'

const { createPromise } = Template

const POOL_NAME = 'pool'
const SCAXER_NAME = 'scaxer'

const pool = createPool(POOL_NAME)
pool.register({
    [SCAXER_NAME]: {
        promise: createPromise(Template.types.AJAX_JSON_TEMPLATE,
            { url: 'http://your-api.com/api/v1/', method: AjaxCallMethod.GET},
        )
        mapResultToData: result => result.data,
    }
})
const scaxer = pool.getScaxer(SCAXER_NAME)

class ScaxerComponent extends React.Component {
    render() {
        return (
            <div>
                <button onClick={scaxer.call}>Click</button>
                <div>data: {scaxer.getData()} </div>
                <div>status: {scaxer.getStatus()} </div>
            </div>
        )
    }
}

export attach(POOL_NAME, [SCAXER_NAME])(ScaxerComponent)
```

### with TypeScript
#### Type define for Scaxer
```typescript
type ScaxerDataType = {
    [SCAXER_NAME_I]: {
        TParamType: number;
        TDataType: string;
        TResultType: { data: string };
    },
    [SCAXER_NAME_II]: {
        TParamType: { num: string };
        TDataType: string;
        TErrorType: number;
        TResultType: { data: string };
        TReasonType: { error: number };
    }
}
```
#### Scaxer configuration
```typescript
import { TScaxerBatchConfiguration } from 'react-scax'

const scaxerBatchConfigs: TScaxerBatchConfiguration<ScaxerDataType> = {
    [SCAXER_NAME_I]: {
        blocking: SCAXER_BLOCKING.UPCOMING,
        mapResultToData: (result: { data: number }) => result.data,
        promise: (param: number) => new Promise(resolve => {
            setTimeout(() => resolve({ data: param + '' }), 2000);
        }),
    },
    [SCAXER_NAME_II]: {
        onFulfillment: SCAXER_NAME_I,
        onRejection: () => { console.log('FAILED.'); },
        mapResultToData: result => result.data,
        mapReasonToError: reason => reason.error,
        promise: createPromise(Template.types.AJAX_JSON_TEMPLATE,
            { url: 'http://your-api.com/api/v1/', method: AjaxCallMethod.GET }),
    }
```
#### Pool initiation
```typescript
const pool = createPool(POOL_NAME, scaxerBatchConfigs)
```
#### Get and Call Scaxer
```typescript
scaxerII = pool.getScaxer(SCAXER_NAME_II)
scaxerII.call({ num: '1000' })
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC License](https://choosealicense.com/licenses/isc/)