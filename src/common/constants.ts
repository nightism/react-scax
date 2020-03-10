export const EMPTY = {
    FUNCTION: (): void => undefined,
    LIST: [],
    OBJECT: {},
    STRING: '',
};

export enum SCAXER_STATE {
    /**
     * Scaxer has not been called yet.
     */
    WAITING = 0,
    /**
     * Scaxer has been called and is being resolved.
     */
    RESOLVING = 1,
    /**
     * Scaxer has been resolved successfully.
     */
    FULFILLED = 2,
    /**
     * Scaxer has been rejected.
     */
    REJECTED = 3,
    /**
     * Scaxer has been interrupted due to exceptions in handlers.
     */
    INTERRUPTED = 4,
    /**
     * Scaxer has been resolved successfully and its data has been read for at least once.
     */
    CONSUMED = 5,
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
