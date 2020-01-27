import { graphqlClient } from '../../app/apollo';
import gql from 'graphql-tag';

export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR'
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'


export interface AdminState {
	users?: User[];
}


export const fetchUsers: any = () => async (dispatch: any) => {
	dispatch({ type: FETCH_USERS });

	graphqlClient.query<UsersQuery>({
		query: gql`
    query usersPage{
				users(limit: 15, nextToken: null){
					users{
						id
						name
						roleAssignments {
							roleId
							roleName
							constraint
						}
					}
					nextToken
				}
			}
  `, fetchPolicy: 'no-cache'
	})
		.then(data => { /*console.log(data);*/ dispatch({ type: FETCH_USERS_SUCCESS, payload: data.data.users.users }) })
		.catch(error => { /*console.error(error);*/ dispatch({ type: FETCH_USERS_ERROR, payload: error }) });


}


export interface UsersQuery {
	users: UsersResult;
}

export interface UsersResult {
	users: Array<User>;
}

export interface User {
	id: string;
	name: string;
	roleAssignments: [RoleAssignment]
}

export interface RoleAssignment {
	roleId: string;
	roleName: string;
	constraint?: string;
}
