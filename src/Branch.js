import combineNestedReducers from './combineReducers-patched.js';
import _ from 'lodash'


function Branch (children, _handlers, types) {
    var childrenReducers, initialState;
    const isChildrenReducersExist = _.isPlainObject(children) && !_.isEmpty(children);

    if (isChildrenReducersExist) {
        childrenReducers = combineNestedReducers(children);
        initialState = _.reduce(children, (list, value, name) => (
            {
                ...list,
                ...{[name]: typeof value === 'function' ? void 0 : value}
            }
        ), {});
    } else {
        initialState = children
    }

    const isBranchHandlersExist = _.isPlainObject(_handlers) && !_.isEmpty(_handlers);

    var branchHandlers;

    if (isBranchHandlersExist) {
        const HANDLERS = _.reduce(_handlers, (list, handler, eventName) => {
            if (typeof handler !== 'function') {
                throw new Error('handlers should be function, check ' + eventName + ' action-handler');
                return list;
            } else {
                return _.assign(list,
                    eventName.split('&&').reduce((l, n) => (
                        n !== '' ? _.assign(l, {[n]: handler}) : l
                    ), {})
                )
            }
        }, {});
        const universalHandler = HANDLERS['*'];

        branchHandlers = (state, action, path) => {
            const HANDLER = HANDLERS[action.type] || universalHandler;

            if (HANDLER === void 0) return state;

            var newState;
            try {
                newState = HANDLER.call(HANDLERS, state, action);
            } catch (err) {
                throw new Error('Ошибка в обработке ивента ' + action.type, err);
            }

            if (newState === void 0) {
                throw new Error('Handler should not return undefined ' + action.type);
            }

            return newState
        }
    }

    return function BranchedReducer (state, action, path) {
        state = state === void 0 ? initialState : state;

        const newChildrenState = isChildrenReducersExist
            ? childrenReducers(state, action, path)
            : state;

        const newState = isBranchHandlersExist
            ? branchHandlers(newChildrenState, action, path)
            : newChildrenState;

        return newState;
    }
}

export default Branch;