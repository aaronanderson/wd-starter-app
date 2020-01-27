import { Store, Unsubscribe, AnyAction } from 'redux';
import { combineReducers } from 'redux'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import location from '../features/location/location-reducer'
import admin from '../features/admin/admin-reducer'
import { LocationState } from '../features/location/location-actions';
import { AdminState } from '../features/admin/admin-actions';


const rootReducer = combineReducers({
	location: location,
	admin: admin
})

export const store = createStore(rootReducer, composeWithDevTools(
	applyMiddleware(thunk)
));


export interface WSAStore {
	location: LocationState
	admin: AdminState
}



type Constructor<T> = new (...args: any[]) => T;


//exporting LitElement with it's private/protected members generates a 'TS4094 exported class expression may not be private or protected' error so define a limited interface
interface ConnectedLitElement {
	connectedCallback?(): void;
	disconnectedCallback?(): void;
}

export const connect =
	<S>(store: Store<S>) =>
		<T extends Constructor<ConnectedLitElement>>(baseElement: T) =>
			class extends baseElement {
				_storeUnsubscribe!: Unsubscribe;

				connectedCallback() {

					super.connectedCallback && super.connectedCallback();


					this._storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
					this.stateChanged(store.getState());
				}

				disconnectedCallback() {
					this._storeUnsubscribe();


					super.disconnectedCallback && super.disconnectedCallback();

				}

				stateChanged(_state: S) { }

				dispatch<A extends AnyAction>(_function: A) { store.dispatch(_function) }
			};