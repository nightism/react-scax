import React from 'react';
import { error, isAttachWrapper, isClassComponent } from './common/utils';
import { getPoolView } from './pool/pools';
import {
    IAttach, IPoolView, IScaxerManager, TAttachedComponentType,
    TAttachWrapperComponentType, TScaxerSubscriberType,
} from './types';

const attach: IAttach = (
    poolToBeAttached: string | IPoolView,
    scaxersToBeAttached: Array<string | IScaxerManager> = [],
) => {
    let pool: IPoolView;
    if (typeof poolToBeAttached === 'string') {
        pool = getPoolView(poolToBeAttached);
    } else {
        pool = poolToBeAttached;
    }

    const scaxers: IScaxerManager[] = scaxersToBeAttached.map((scaxerToBeAttached: string | IScaxerManager) => {
        let scaxer: IScaxerManager;
        if (typeof scaxerToBeAttached === 'string') {
            scaxer = pool.getScaxerManager(scaxerToBeAttached);
        } else {
            scaxer = scaxerToBeAttached;
        }

        return scaxer;
    });

    return <C extends TAttachedComponentType<React.ComponentProps<C>, C>>(component: C) => {
        const displayName = component.displayName || component.name || 'Component';
        const isAttachedComponentClass = isClassComponent(component);
        const isAttachedComponentWrapper = isAttachWrapper(component);

        type TInnerComponent = (
            React.ComponentClass<React.ComponentProps<C>>
            | TAttachWrapperComponentType<React.ComponentProps<C>>
        ) & React.Component<React.ComponentProps<C>, unknown>;

        const attachWrapperFactory = () => {
            type WrapperComponentProps = React.ComponentProps<C>
            & { innerRef: React.RefObject<TInnerComponent> };

            class WrapperComponent extends React.Component<WrapperComponentProps> {
                /** `childRef` is used to reference the inner component */
                childRef = this.props.innerRef as React.RefObject<TInnerComponent>
                || React.createRef<TInnerComponent>();

                /** `unsubscribHandlers` is used to manage all subscriber functions */
                unsubscribHandlers: TScaxerSubscriberType[] = [];

                /**
                 * `delayedChildUpdate` will store a child component's setState call which needs to be delayed.
                 * The reason why this setState call needs to be delayed is that at the time it's called, the
                 * child component is not yet completely mounted, i.e. before componentDidMount call returned.
                 * In this case, the React Ref object is not yet pointing to the right component, and instead,
                 * it is pointing to null.
                 */
                delayedChildUpdate: any;

                constructor(props: WrapperComponentProps, context?: any) {
                    super(props, context);

                    // Subscribe each scaxer for the inner component.
                    /** Force updator for the inner component. */
                    const setStateCallback = () => this.setChildState();
                    this.unsubscribHandlers = scaxers.map(scaxer => scaxer.injectSubscription(setStateCallback));
                }

                /**
                 * `setChildState` force the subscriber components to rerender using forceUpdate().
                 */
                setChildState() {
                    if (this.childRef.current) {
                        this.childRef.current.forceUpdate();
                    } else {
                        // If the React ref is not pointing to the child component, we save the setState
                        // call, and trigger the update in {@link WrapperComponent.componentDidMount}.
                        // This situation only happens before {@link WrapperComponent.render} returns.
                        // At the moment this callback is triggered, `this.childRef.current` is guaranteed
                        // to be not `null`.
                        this.delayedChildUpdate = () => {
                            if (this.childRef.current) {
                                this.childRef.current.forceUpdate();
                            } else {
                                console.warn('React-Scax WrapperComponent encountered null as childRef.current.');
                            }
                        };
                    }
                }

                componentDidMount() {
                    if (this.delayedChildUpdate) {
                        /**
                         * Here we call the saved setState call of child component.
                         * We can ensure the React Ref object is pointing to the right child component now.
                         */
                        this.delayedChildUpdate();
                    }
                }

                componentWillUnmount() {
                    this.unsubscribHandlers.forEach(unsubscribHandler => unsubscribHandler());
                }

                render() {
                    let Component: any;
                    if (isAttachedComponentClass || isAttachedComponentWrapper) {
                        Component = component;
                    } else {
                        // If passed-in component is a user defined function component
                        // tslint:disable-next-line: max-classes-per-file
                        Component = class extends React.PureComponent<React.ComponentProps<C>> {
                            render() {
                                return (component as any)(this.props);
                            }
                        };
                        Component.displayName = displayName;
                    }

                    return <Component
                        {...this.props as React.ComponentProps<C>}
                        ref={this.childRef}
                    />;
                }
            }

            const forwarded = React.forwardRef<TInnerComponent, React.ComponentProps<C>>((props, ref) => {
                // innerRef below is defined as a prop of WrapperComponent
                return <WrapperComponent {...props} innerRef={ref} />;
            });
            forwarded.displayName = displayName;

            return forwarded;
        };

        const AttachWrapper = attachWrapperFactory();

        return AttachWrapper;
    };
};

export default attach;
