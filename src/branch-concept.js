const combineTree = () => ({});
const Branch = () => ({});
const Collection = () => ({});
const Leaf = () => ({});


const pTypes = {
	string: {
		isUniq: () => ({}),
		isRequired: () => ({}),
	},
	enum: () => ({}),
	arrayOf: () => ({}),
	shapeOf: () => ({}),
}

function isPrimitive(value){
  return _.isNil(value) || _.isNumber(value) || _.isBoolean(value) || _.isString(value) || typeof value === 'symbol';
}

// ---
// warning/invariant/etc
//
//
// тестируй обязательно свои конструкции на
// - изменения из под middleware (по сути не рассчитывать что стейт === предыдущему стейту)
// - использование Immutable.js ??? нахуй
// - typescript

// ----------------------------------------------------------------------------------

types = {
	todos: {
		resources: pTypes.shapeOf({
			todoID: pTypes.string.isUniq,
			name: pTypes.string.isRequired,
			schedule: pTypes.string,
		}),

	}
}


// resource: storeTypes.todos.resources






/*
Branch - ветвление
	частный_случай: BunchOf



scheme = что угодно, если по нему можно итерироваться, то функции становятся вложенными редюсерами
reducer = () => || [() =>, () =>]
*/




// ----------------------------------------------------------------------------------

// чайлд редюсер до или после хендлеров?
/**
 * до:
 *  + в хендлеры попадает уже актуальная инфа
 *  + можно делать "компьютед" на основе чайлдов
 *
 *  - необходимость в двойном запуске валидации
 *
 *
 *
 *
 * после:
 * 	+ можно "допиливать инфу", после добавления
 *
 *  + единичный запуск Валидации
 *
 *
 *
 */

/*
// reducer, это

() =>
[() =>, () => ]
(() =>) + actions
*/


const getChildHandledActions => (scheme) {
	if (_.isPrimitive(scheme)) {
		return null
	} else if (_.isFunction(scheme)) {
		return _.isArray(scheme.handledActions) ? scheme.handledActions : ['*']
	} else if (_.isArray(scheme)) {
		return _.(scheme).map(getChildActions).flatten().value()
	} else if (_.isPlainObject(scheme)) {
		return _.(scheme).mapValues(getChildActions).flatten().value()
	} else {
		console.error('какой тип я пропустил?', scheme, typeof scheme)
	}
}

const Branch = (scheme, actions, propTypes) => {
	function branchedReducer (state, action, path) {
		// надо решить - всегда ли создавать Branch рекурсивно
		// 	соответственно рассчитывать сразу на childReducer или одноуровневую схему
		// 	но тогда придется его научить бегать по array, тк combineReducer умеет только {}
		//
		// или бегать в частных случаях
		//
		//
		//
		//
		// опять же, возвращаемся к вопросу о том, не делает ли combineReducer много "лишнего" на каждом проходе
		//
		// чистит редюсер-лист
		// 		оповещает об undefined
		// 		остальные "убирает"
		//
		// прогоняет редюсеры (без стейта) через INIT / RANDOM, смотрит что они возвращают "свой initialState"
		//
		// возвращает скомбинированныйРедюсер
		// 		тестит что finalReducers соответствует по ключам заходящему state
		//
		// прогоняет схему, собирая новый стейт
		// 		оповещает, если редюсер вернул undefined
		//
		//
	}

	reducer.validate = (changedState, action, path) => (
		PropTypes.checkPropTypes(propTypes, changedState, path, '[REDUX-BRANCH]',
			() => `, on action.type="${action.type}"`
		)
	)

  reducer.handledActions = _(actions).keys().map((t) => (
		t.indexOf('||') !== -1 ? t.split('||')
	)).flatten().concat(
		getChildHandledActions(scheme)
	).value()

	if (reducer.handledActions.indexOf('*') !== -1) reducer.handledActions = ['*'];

	return reducer
}





const reducer = Branch({
	'todos': Branch({

		list: BunchOf(
			{
				':todoID': {
						[ACTION]: () => ()
				}
			},

			{
				[action]: [
					() => {},
					() => {},
				]
			},
			pTypes.objectOf(
				pTypes.shapeOf({
					todoID: pTypes.string,
					name: pTypes.string.isRequired,
					schedule: pTypes.string,
				})
			)
		),

		activeQuery: Branch([], {
			// regexp
			['*_REQUEST'] (state, action) {

			},
			['*'] (state, action) {

			}
		}, pTypes.array),




		date: Branch([
			Branch(new Date, {}, pTypes.date),
			Branch(new Date, {}, pTypes.date),
		], {
			[ACTION] () {}
		}, pTypes.arrayOf(pTypes.date)),

		list2: Branch([], {
			  // автоматически toString идет, можно мапить как его, так и regexp
				[[EVENT, EVENT2, EVENT3].join('||')]: (list) => list
			},
			pTypes.arrayOf(pTypes.shapeOf({
				todoID: pTypes.string.isUniq,
				name: pTypes.string.isRequired,
				schedule: pTypes.string,
			}))
		),

		activeTab: Branch('new', {
				['EVENT']: (state, {activeTab}) => activeTab,
			},
			pTypes.oneOf(['new', 'finished', 'cancelled'])
		),
	}, {
		// кейсы




		// компьютед
		// [Branch.innerCHANGED]: (state, action) => ({ // без аутерчейнджа это бессмысленно (регидрейт, инит и прочее)
		['*']: (state, action) => ({
			...state,
			availableTodos: _(state.list).filter(todo => todo.available).map('todoID').value(),
			finishedTodos: _.map(state.list.filter(todo => todo.status === 'FINISHED'), 'todoID'),
		}),



		[Branch.INIT]: (state, action) => (state),
		[Branch.VALIDATE]: (state, action) => (state),
	}),
})
// ----------------------------------------------------------------------------------
