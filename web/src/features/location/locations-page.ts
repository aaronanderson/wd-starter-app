import { html, customElement, property } from 'lit-element';

import { ViewElement } from '../../components/wsa-view';
import '../../components/wsa-table';

import { Location, fetchLocations } from './location-actions';


import { WSAStore } from '../../app/store';

@customElement('wsa-locations-page')
export class LocationsPageElement extends ViewElement {

	@property({ type: Array })
	locations: Array<Location> = [];

	@property({ type: Boolean })
	editMode: boolean = false;


	pendingChanges = new Set();

	pendingRemoves = new Set();



	firstUpdated() {
		this.pageTitle = 'Locations';
		this.dispatch(fetchLocations());


	}


	render() {

		return html`${this.pageTitleTemplate} 
		<section class="wsa-page-body">
			<div class="wsa-scroll">
					<wsa-table name="Locations" .entries=${this.locations} .editMode=${this.editMode} .inlineEditMode=${true} @wsa-table-add=${this.addLocation} @wsa-table-edit=${this.editLocation} @wsa-table-remove=${this.removeLocation}>
							<wsa-row .renderer=${this.locationRenderer} header="Name"></wsa-row>
					</wsa-table>
			</div>

			${this.editMode ?
				html`						
						<div class="wdc-action-bar" role="region" aria-label="Action Bar">
							<div class="wdc-action-bar-container">
								<div>
									<button class="wdc-btn wdc-btn-primary wdc-btn-size-m" @click="${this.handleDone}">Done</button>
									<button class="wdc-btn wdc-btn-secondary wdc-btn-size-m" @click="${this.handleCancel}">Cancel</button>
								</div>
							</div>
						</div>		
					`
				: html`
						<div class="wdc-action-bar" role="region" aria-label="Action Bar">
							<div class="wdc-action-bar-container">
								<div>	
									<button class="wdc-btn wdc-btn-primary wdc-btn-size-m" @click="${this.handleEdit}">Edit</button>
								</div>
							</div>
						</div>									
					`
			}

		 
		</section>	
    `;
	}


	locationRenderer(c: Location) {
		return html`<a class="wdc-type-variant-link" href="/location/${c.id}">${c.name}</a>`;
	}



	addLocation(e: CustomEvent) {
		this.pendingChanges.add(e.detail.entry);
	}

	editLocation(e: CustomEvent) {
		this.pendingChanges.add(e.detail.entry);
	}

	removeLocation(e: CustomEvent) {
		this.pendingRemoves.add(e.detail.entry);
	}




	handleEdit(e: MouseEvent) {
		this.editMode = true;
	}


	handleDone(e: MouseEvent) {
		//this.dispatch(updateLocations(this.project!.id, this.pendingChanges, this.pendingRemoves));
		this.handleCancel(e);
	}

	handleCancel(e: MouseEvent) {
		this.editMode = false;
		this.pendingChanges.clear();
		this.pendingRemoves.clear();
	}

	stateChanged(state: WSAStore) {
		//console.log("stateChanged", state);
		this.locations = state.location.locations;

	}
}



export default LocationsPageElement;