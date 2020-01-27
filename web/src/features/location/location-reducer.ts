import {
	FETCH_LOCATIONS_SUCCESS, LocationState, READ_LOCATION_SUCCESS
} from './location-actions'

import produce from 'immer'


const initialState: LocationState = {
	locations: [],

}

const client = (state: LocationState = initialState, action: any) => {
	return produce(state, (draft: LocationState) => {
		//console.log("client reducer", action);
		switch (action.type) {
			case FETCH_LOCATIONS_SUCCESS: {
				draft.locations = action.payload;
				break
			}
			case READ_LOCATION_SUCCESS: {
				draft.targetLocation = action.payload;
				break
			}
			//   return initialState
			// case CHECKOUT_FAILURE:
			//   return action.cart

			default:
				return draft
		}
	});
}



export default client