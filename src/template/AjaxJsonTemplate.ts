import { AJAX_CALL_METHOD } from '../common/constants';
import { encodeObjectAsQueryString } from '../common/utils';
import { IStaticTemplate, ITemplate, TCreateGenericPromiseFunctionType } from '../types';

type TAjaxJsonConfigType = { url: string, method?: AJAX_CALL_METHOD, getOptions?: () => RequestInit };
type TAjaxJsonParamType = {
    [key: string]: boolean | string | number | string[] | number[] | boolean[] | TAjaxJsonParamType,
};
type TAjaxJsonResultType = any;

type TAjaxJsonTemplateConfigType = { getOptions: () => RequestInit };

/**
 * AjaxJson Scheme will create promise function that will fire an AJAX call whose content type
 * and response content type are all in json format. Return code is supposed between 200 to 300
 * for success or 400 to 600 for failure.
 */
class AjaxJsonTemplate
implements IStaticTemplate<TAjaxJsonTemplateConfigType>,
ITemplate<TAjaxJsonConfigType, TAjaxJsonParamType, TAjaxJsonResultType> {

    /**
     * dynamic options are global options customised by users, it will be dynamically generated in runtime
     */
    private static getDynamicGlobalOptions: () => RequestInit = () => ({});

    /**
     * Singleton instance for All IScheme object
     */
    private static instance: AjaxJsonTemplate;

    /**
     * global options will be used across all instances, and it is fixed and hidden from users
     */
    private static staticGlobalOptions: RequestInit = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    /**
     * Singleton AjaxJsonScheme constructor
     */
    constructor() {
        if (AjaxJsonTemplate.instance) {
            return AjaxJsonTemplate.instance;
        }
        AjaxJsonTemplate.instance = this;
        return this;
    }

    /**
     * Implement configure method in IStaticScheme interface
     */
    configure: (config: TAjaxJsonTemplateConfigType) => void = (config: TAjaxJsonTemplateConfigType) => {
        AjaxJsonTemplate.getDynamicGlobalOptions = config.getOptions;
    }

    /**
     * Craft a promise function whose promise body is a AJAX call with both request and response as JSON object
     */
    craftPromiseFunction:
    TCreateGenericPromiseFunctionType<TAjaxJsonConfigType, TAjaxJsonParamType, TAjaxJsonResultType> = (
        config: { url: string, method?: AJAX_CALL_METHOD, getOptions?: () => RequestInit },
    ) => {
        /**
         * @param params optional dictionary object that contains the parametes needed for AJAX call
         */
        return async (params: TAjaxJsonParamType): Promise<TAjaxJsonResultType> => {
            const requestOptions: RequestInit = {
                method: config.method || AJAX_CALL_METHOD.GET,
            };
            Object.assign(requestOptions, AjaxJsonTemplate.staticGlobalOptions);
            Object.assign(requestOptions, AjaxJsonTemplate.getDynamicGlobalOptions());
            Object.assign(requestOptions, config.getOptions ? config.getOptions() : {});

            let urlWithParams: string = config.url;
            if (!config.method || config.method === AJAX_CALL_METHOD.GET) {
                urlWithParams = urlWithParams + (params ? `?${encodeObjectAsQueryString(params)}` : '');
            } else if (params) {
                Object.assign(requestOptions, { body: JSON.stringify(params) });
            }

            /**
             * Actual AJAX call happens here
             */
            const response = await fetch(urlWithParams, requestOptions);
            if (response.status >= 200 && response.status < 300) {
                /**
                 * Resolve promise when return code is between 200 to 300
                 */
                if (response.status === 204) {
                    // 204 No content
                    return Promise.resolve({});
                }
                return response.json();
            }
            if (response.status >= 400 && response.status < 600) {
                /**
                 * Reject promise when return code is between 400 to 600
                 */
                return response.json().then((msg: string) => {
                    return Promise.reject({
                        message: msg,
                        status: response.status,
                        statusText: response.statusText,
                    });
                });
            }
            return Promise.reject({
                message: 'Unexpected status code',
                status: response.status,
                statusText: response.statusText,
            });
        };
    }
}

export default new AjaxJsonTemplate();
