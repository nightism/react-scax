import { TEMPLATE_TYPE } from '../common/constants';
import { IStaticTemplate, ITemplate, TPromiseFunctionType } from '../types';
import AjaxJsonTemplate from './AjaxJsonTemplate';

/**
 * Map template name to actual template object.
 */
const TemplateMap: { [key: string]: ITemplate & IStaticTemplate } = {
    [TEMPLATE_TYPE.AJAX_JSON_TEMPLATE]: AjaxJsonTemplate,
};

/**
 * Map template name to template type.
 */
type TemplateMapType = {
    [TEMPLATE_TYPE.AJAX_JSON_TEMPLATE]: typeof AjaxJsonTemplate,
};

type TemplateConfigType<T> = T extends ITemplate<infer TConfigType, any, any> ? TConfigType : T;
type TemplateParamType<T> = T extends ITemplate<any, infer TParamType, any> ? TParamType : T;
type TemplateResultType<T> = T extends ITemplate<any, any, infer TResultType> ? TResultType : T;

type StaticSchemeConfigType<T> = T extends IStaticTemplate<infer TConfigType> ? TConfigType : T;

/**
 * Create a promise function according to the specific template
 * @param template template name of TEMPLATE_TYPE type
 * @param config specific configuration used to create the promise function
 */
export function createTemplatePromiseFunction <
TTemplateType extends Extract<keyof TemplateMapType, string>,
TConfigType extends TemplateConfigType<TemplateMapType[TTemplateType]>,
TParamType extends TemplateParamType<TemplateMapType[TTemplateType]>,
TResultType extends TemplateResultType<TemplateMapType[TTemplateType]>,
>(
    template: TTemplateType,
    config: TConfigType,
): TPromiseFunctionType<TParamType, TResultType> {
    const SchemeObject: ITemplate<TConfigType, TParamType, TResultType> = TemplateMap[template];
    return SchemeObject.craftPromiseFunction(config);
}

/**
 * Change the default configurations of a template.
 * @param template template name of TEMPLATE_TYPE type
 * @param config configurations that will overwrite the template default behaviors
 */
export function configureTemplate <
TSchemeType extends Extract<keyof TemplateMapType, string>,
TConfigType extends StaticSchemeConfigType<TemplateMapType[TSchemeType]>,
>(
    template: TSchemeType,
    config: TConfigType,
): void {
    const SchemeObject: IStaticTemplate<TConfigType> = TemplateMap[template];
    SchemeObject.configure(config);
}
