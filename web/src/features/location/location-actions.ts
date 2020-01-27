import { graphqlClient } from '../../app/apollo';
import gql from 'graphql-tag';



export const CREATE_LOCATION = 'CREATE_LOCATION'
export const FETCH_LOCATIONS = 'FETCH_LOCATIONS'
export const FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS'
export const FETCH_LOCATIONS_ERROR = 'FETCH_LOCATIONS_ERROR'
export const READ_LOCATION = 'READ_LOCATION'
export const READ_LOCATION_SUCCESS = 'READ_LOCATION_SUCCESS'
export const READ_LOCATION_ERROR = 'READ_LOCATION_ERROR'

export const PUT_LOCATION = 'PUT_LOCATION'
export const PUT_LOCATION_SUCCESS = 'PUT_LOCATION_SUCCESS'
export const PUT_LOCATION_ERROR = 'PUT_LOCATION_ERROR'


export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'

export interface LocationState {
	locations: Array<Location>;
	targetLocation?: Location;
}

export const fetchLocations: any = () => async (dispatch: any) => {
	console.log("fetchLocations");
	dispatch({ type: FETCH_LOCATIONS });

	graphqlClient.query<LocationsQuery>({
		query: gql`
				query locationsPage{
				locations(limit: 15, nextToken: null){
					locations{
						id
						name						
					}
					nextToken
				}
			}
  `,
	})
		.then(data => { /*console.log(data);*/ dispatch({ type: FETCH_LOCATIONS_SUCCESS, payload: data.data.locations.locations }) })
		.catch(error => { console.error(error); dispatch({ type: FETCH_LOCATIONS_ERROR, payload: error }) });


}


export const readLocation: any = (locationId: string) => async (dispatch: any) => {
	//console.log("fetchLocation");
	dispatch({ type: READ_LOCATION });

	graphqlClient.query<ViewLocationQuery>({
		query: gql`
		query ($locationId: ID){
				viewLocation(locationId: $locationId){
				id
					referenceId
					created
					modified
					name
					description
					industry
					projects{
						id
						name
					}
				}
			}
	`, variables: {
			locationId: locationId
		}
	})
		.then(data => { /*console.log(data);*/ dispatch({ type: READ_LOCATION_SUCCESS, payload: data.data.viewLocation }) })
		.catch(error => { console.error(error); dispatch({ type: READ_LOCATION_ERROR, payload: error }) });


}


export const updateLocations: any = (puts: Set<Location>, removes: Set<Location>) => async (dispatch: any) => {
	dispatch({ type: PUT_LOCATIONS });

	graphqlClient.mutate<UpdateLocationsMutation>({
		mutation: gql`
				mutation updateLocations($put: [LocationInput], $remove: [ID]){
					updateLocations( put: $put, remove: $remove){
						id	
						name
						
					}
				}
				
			  `,
		variables: {			
			put: Array.from(puts),
			removes: Array.from(removes)


		}
	})
		.then(data => { /*console.log(data);*/ dispatch({ type: PUT_LOCATIONS_SUCCESS, payload: data!.data!.updateLocations }) })
		.catch(error => /*console.error(error);*/ dispatch({ type: PUT_LOCATIONS_ERROR, payload: error }));




 
export interface LocationsQuery {
	locations: LocationsResult;
}

export interface LocationsResult {
	locations: Array<Location>;
}


export interface ViewLocationQuery {
	viewLocation: Location;
}

export interface UpdateLocationsMutation {
	updateLocations: Location[];
}

export interface Location {
	id: string
	name: string;
}
