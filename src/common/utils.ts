export const error: (msg?: string) => never = (errorMessage?: string) => {
    throw new Error(errorMessage);
};

export function encodeObjectAsQueryString(obj: any): string {
    if (!obj) {
        return '';
    }

    return Object
        .keys(obj)
        .filter(k => obj[k] !== null && obj[k] !== undefined)
        .map(k => {
            if (Array.isArray(obj[k])) {
                return obj[k].map((v: any) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : obj[k])}`;
        })
        .flat()
        .join('&');
}

export const isClassComponent = (Component: React.ComponentType<any>) => {
    return Boolean(Component.prototype && !!Component.prototype.isReactComponent);
};

export const isAttachWrapper = (
    Component: React.ComponentType<any> & { render?: any },
) => {
    return Boolean(Component.render && typeof Component === 'object');
};
