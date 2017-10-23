import combineNestedReducers from './combineReducers-patched.js';
import _ from 'lodash'
import PropTypes from 'prop-types';


export function Leaf() {
    return Branch.apply(null, arguments)
}
export function BunchOf() {

}


Branch.multiply = (args) => _.filter(args, _.isString).join('&&');

export function Branch (children, _handlers, pTypes) {

    var childrenReducers,
        initialState = children;

    const isChildrenReducersExist = _.isPlainObject(children) && !_.isEmpty(children);

    if (isChildrenReducersExist) {
        childrenReducers = combineNestedReducers(children);

        initialState = _.reduce(children, (list, value, name) => (
            {
                ...list,
                ...{[name]: typeof value === 'function' ? void 0 : value}
            }
        ), {});
    }

    PropTypes.checkPropTypes(pTypes, initialState, 'prop', 'Branch()')


    const isBranchHandlersExist = _.isPlainObject(_handlers) && !_.isEmpty(_handlers);

    var branchHandlers;

    if (isBranchHandlersExist) {


        const HANDLERS = _.reduce((
            _.mapValues(_handlers, (v) => (typeof v === 'function' || typeof v === 'undefined') ? v : () => v)
        ), (list, handler, eventName) => {
            if (typeof handler !== 'function' && handler !== void 0) {
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
                throw new Error('Error in handler ' + action.type, err);
            }

            if (newState === void 0) {
                throw new Error('Handler should not return undefined ' + action.type);
            }

            return newState
        }
    }

    return function BranchedReducer (state, action, path) {
        PropTypes.checkPropTypes(pTypes, state, 'prop', 'Branch()')

        state = state === void 0 ? initialState : state;

        const newChildrenState = isChildrenReducersExist
            ? childrenReducers(state, action, path)
            : state;

        PropTypes.checkPropTypes(pTypes, newChildrenState, 'prop', 'Branch()')

        const newState = isBranchHandlersExist
            ? branchHandlers(newChildrenState, action, path)
            : newChildrenState;

        PropTypes.checkPropTypes(pTypes, newState, 'prop', 'Branch()')

        return newState;
    }
}

export default Branch;