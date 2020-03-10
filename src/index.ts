import attachFunc from './attach';
import { AJAX_CALL_METHOD, SCAXER_BLOCKING, SCAXER_STATE, TEMPLATE_TYPE } from './common/constants';
import { configureTemplate, createTemplatePromiseFunction } from './template/template';
import { IAttach } from './types';

export * from './types';

export { createPool } from './pool/pools';

export const attach: IAttach = attachFunc;

export const AjaxCallMethod = AJAX_CALL_METHOD;
export const ScaxerState = SCAXER_STATE;
export const ScaxerBlocking = SCAXER_BLOCKING;
export const Template = {
   changeTemplateSettings: configureTemplate,
   createPromise: createTemplatePromiseFunction,
   types: TEMPLATE_TYPE,
};
