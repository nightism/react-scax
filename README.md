# React-Scax

[![npm version](https://badge.fury.io/js/react-scax.svg)](https://badge.fury.io/js/react-scax)

React-Scax is an NPM package intended to synchronize AJAX calls and JavaScript Promise resolution in React Application.

## Installation

Use the package manager [npm](https://pip.pypa.io/en/stable/) to install react-scax.

```bash
npm install react-scax
```

## Quick Start

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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[ISC License](https://choosealicense.com/licenses/isc/)