import {
	FETCH_USERS_SUCCESS, AdminState
} from './admin-actions'

import produce from 'immer'


const initialState: AdminState = {
	users: [],

}

const admin = (state: AdminState = initialState, action: any) => {
	return produce(state, (draft: AdminState) => {
		//console.log("client reducer", action);
		switch (action.type) {
			case FETCH_USERS_SUCCESS: {
				draft.users = action.payload;
				break
			}

			default:
				return draft
		}
	});
}



export default admin