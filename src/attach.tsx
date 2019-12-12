import cloneDeep from 'lodash.clonedeep';
import React, { useState } from 'react';
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
            Component = cloneDeep(component.render) || (() => null);

            const useForceUpdate = () => {
                const [, scaxSetState] = useState({});
                return () => scaxSetState({});
            };
            /**
             * If the passed in component is a wrapper component, we use hook to get access
             * to the state handler we defined(scaxSetState), and we construct a new function component Component
             * with prototype = { setState: () => scaxSetState() }.
             * Also this function component should be wrapped by forwarRef to pass the ref furtherly downward
             */
            // tslint:disable-next-line
            Component = React.forwardRef<any, React.ComponentProps<C>>(function (props, ref) {
                Component.prototype = {};
                Component.prototype.setState = useForceUpdate();
                return (component.render || (() => null))(props, ref);
            });
            Component.displayName = displayName;
        } else { // If passed-in component is a user defined function component
            Component = class extends React.Component<React.ComponentProps<C>> {
                render() {
                    return (component as any)(this.props);
                }
            };
        }

        const attachWrapperFactory = () => {
            // tslint:disable-next-line: max-classes-per-file
            class WrapperComponent extends React.Component<
                React.ComponentProps<C> & { innerRef: React.RefObject<any> }
                > {
                childRef = (this.props.innerRef as React.RefObject<any>) || React.createRef<any>();
                unsubscribHandlers: TScaxerSubscriberType[] = [];

                setChildState() {
                    this.childRef.current.setState({});
                }
                componentDidMount() {
                    const setStateCallback = () => this.setChildState();
                    this.unsubscribHandlers = scaxers.map(scaxer => scaxer.injectSubscription(setStateCallback));
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
