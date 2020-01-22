import React from 'react';
import { error, isAttachWrapper, isClassComponent } from './common/utils';
import { getPoolView } from './pool/pools';
import { IAttach, IScaxerManager, TAttachedComponentType, TScaxerSubscriberType } from './types';

const attach: IAttach = (
    poolName: string,
    scaxerNames: string[] = [],
) => {
    const pool = getPoolView(poolName);
    if (!pool) {
        error('Can not find matching pool');
    }

    return <C extends TAttachedComponentType<React.ComponentProps<C>>>(component: C) => {
        const scaxers = scaxerNames.map(scaxerName => {
            const scaxer: IScaxerManager = pool.getScaxerManager(scaxerName);
            if (!scaxer) {
                error('Can not find matching scaxer');
            }
            return scaxer;
        });

        const displayName = component.displayName || component.name || 'Component';
        const isAttachedComponentClass = isClassComponent(component);
        const isAttachedComponentWrapper = isAttachWrapper(component);
        let Component: any;
        if (isAttachedComponentClass) {
            Component = component;
        } else if (isAttachedComponentWrapper) {
            /**
             * TODO: This if branch does that same as the previous one.
             * May need to implements more provessing for wrapper components.
             */
            Component = component;
        } else { // If passed-in component is a user defined function component
            Component = class extends React.Component<React.ComponentProps<C>> {
                render() {
                    return (component as any)(this.props);
                }
            };
            Component.displayName = displayName;
        }

        const attachWrapperFactory = () => {
            // tslint:disable-next-line: max-classes-per-file
            class WrapperComponent extends React.Component<
                React.ComponentProps<C> & { innerRef: React.RefObject<any> }
                > {
                childRef = (this.props.innerRef as React.RefObject<any>) || React.createRef<any>();
                unsubscribHandlers: TScaxerSubscriberType[] = [];

                /**
                 * This property will store a child component's setState call which needs to be delayed.
                 * The reason why this setState call needs to be delayed is at the time it's called,
                 * the child component is not yet completely mounted, e.g. it's componentDidMount call returned.
                 * In this case, the React Ref object is not yet pointing to the right component, and instead, it
                 * is pointing to null.
                 */
                delayedChildUpdate: any;

                setChildState() {
                    if (this.childRef.current) {
                        this.childRef.current.setState({});
                    } else {
                        // if the React ref is not pointting to the child component, we save the setState call.
                        this.delayedChildUpdate = () => this.childRef.current.setState({});
                    }
                }
                componentWillMount() {
                    const setStateCallback = () => this.setChildState();
                    this.unsubscribHandlers = scaxers.map(scaxer => scaxer.injectSubscription(setStateCallback));
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
                    return <Component
                        {...this.props as React.ComponentProps<C>}
                        ref={this.childRef}
                    />;
                }
            }

            const forwarded = React.forwardRef<any, React.ComponentProps<C>>((props, ref) =>
                <WrapperComponent {...props} innerRef={ref} />);
            forwarded.displayName = displayName;

            return forwarded;
        };

        const AttachWrapper = attachWrapperFactory();

        return AttachWrapper;
    };
};

export default attach;
