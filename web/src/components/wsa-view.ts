import { LitElement, html, css, customElement, property } from 'lit-element';

import { connect, store, WSAStore } from '../app/store';

const style = css(<any>[require('../app/wsa-app.scss').default]);

export class ViewElement extends connect<WSAStore>(store)(LitElement) {

	@property({ type: String })
	pageTitle?: string;

	@property({ type: String })
	subPageTitle?: string;

	@property({ type: Boolean })
	loading?: boolean = false;

	location?: Router.Location;

	static get styles() {
		return [style];
	}


	get pageTitleTemplate() {

		return html`
		<header class="wdc-page-header">
			<div class="wdc-page-header-container">
				<div style="display: table-cell">
					<h2 class="wdc-page-header-title">${this.pageTitle}</h2>
					${this.subPageTitleTemplate}
				</div>		
				<!--<div class="wdc-icon-list">
					<button class="wdc-btn-icon-inverse" aria-label="Export">
					<i class="wdc-icon" data-icon="exportIcon" data-category="system" />	
					</button>
					<button class="wdc-btn-icon-inverse" aria-label="Fullscreen">
						<i class="wdc-icon" data-icon="fullscreenIcon" data-category="system" />
					</button>
				</div>-->
								
			</div>
			
					
			
		</header>
		
		`;

	}

	get subPageTitleTemplate() {
		if (this.subPageTitle) {
			return html`<div class="wdc-page-sub-header-title">${this.subPageTitle}</div>`;
		}
	}

	get loadingTemplate() {
		return html`
		<div class="wdc-loading-dots" ?hidden="${!this.loading}">
      		<span />
    	</div>`;
	}

}




