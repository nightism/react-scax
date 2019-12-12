export const EMPTY = {
    FUNCTION: (): void => undefined,
    LIST: [],
    OBJECT: {},
    STRING: '',
};

export enum SCAXER_STATE {
    WAITING = 0,
    RESOLVING = 1,
    FULFILLED = 2,
    REJECTED = 3,
    INTERRUPTED = 4,
}

export enum SCAXER_BLOCKING {
    BLOCKING = 'BLOCKING',
    IGNORING = 'IGNORING',
    UPCOMING = 'UPCOMING',
}

export enum AJAX_CALL_METHOD {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    OPTIONS = 'options',
}

/**
 * This ENUM will be exposed to users to select certain scheme type.
 */
export enum TEMPLATE_TYPE {
    AJAX_JSON_TEMPLATE = 'AJAX_JSON_SCHEME',
}
