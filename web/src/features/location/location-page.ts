import { html, css, customElement, property } from 'lit-element';
import { render } from 'lit-html';

import { ViewElement } from '../../components/wsa-view';

import { Location, readLocation } from '../location/location-actions';
import { WSAStore } from '../../app/store';


@customElement('wsa-location-page')
export class LocationPageElement extends ViewElement {

	@property({ type: Object })
	targetLocation?: Location;

	location?: Router.Location;


	firstUpdated() {
		this.pageTitle = 'View Client';

		if (this.location) {
			this.dispatch(readLocation(this.location.params.clientId));
		}

	}



	//https://glitch.com/edit/#!/cotton-felidae?path=app.js:116:13
	render() {

		return this.targetLocation ? html`${this.pageTitleTemplate} 
			<section class="md-page-body">

				<div class="wdc-form wdc-form-label-position-left">
					
					<div class="wdc-form-field-wrapper">
						<label class="wdc-form-label">Description</label>
						<div class="wdc-form-field">
							<span>${this.targetLocation.name}</span>
						</div>
					</div>

					<div class="wdc-form-field-wrapper">
						<label class="wdc-form-label">Projects</label>
						<div class="wdc-form-field">
							<div>
								
									
								
								
								</div>
						</div>
					</div>

				</div>


			</section>
		
    `: html`${this.pageTitleTemplate}`;
	}

	projectsRenderer(root: any, column: any, rowData: any) {

		render(
			html`
        <span class="project">${rowData.item.projects}</span>
      `,
			root
		);
	}

	stateChanged(state: WSAStore) {
		if (state.location.targetLocation) {
			this.targetLocation = state.location.targetLocation;
			this.subPageTitle = state.location.targetLocation.name;
		}

	}
}





export default LocationPageElement;