import { html, css, customElement, property } from 'lit-element';
import { render } from 'lit-html';

import { MDCTabBar } from '@material/tab-bar';

import { ViewElement } from '../../components/wsa-view';




@customElement('wsa-tabs-page')
export class TabPageElement extends ViewElement {

	tabBar?: MDCTabBar;

	firstUpdated() {
		this.pageTitle = 'Tabs';

		if (this.location) {
			this.location.params.tabId;
		}

		if (this.shadowRoot) {
			let tabElement = this.shadowRoot.querySelector('.mdc-tab-bar');
			if (tabElement) {
				this.tabBar = new MDCTabBar(tabElement);
				this.tabBar.listen('MDCTabBar:activated', (event: CustomEvent) => {

					switch (event.detail.index) {
						case 0:
							render(html`Tab 1`, this);
							break;
						case 1:
							render(html`Tab 2`, this);
							break;
						case 2:
							render(html`Tab 3`, this);
							break;						
						default:

					}

					console.log("Tab Event", event.detail.index);

				});
				this.tabBar.activateTab(0);
			}
		}


	}

	async setup(){

	}



	//https://glitch.com/edit/#!/cotton-felidae?path=app.js:116:13
	render() {

		return html`${this.pageTitleTemplate} 
			
			<div class="mdc-tab-bar" role="tablist">
				<div class="mdc-tab-scroller">
					<div class="mdc-tab-scroller__scroll-area">
						<div class="mdc-tab-scroller__scroll-content">
							${this.tab('Tab 1')}
							${this.tab('Tab 2')}
							${this.tab('Tab 3')}
						</div>
					</div>
				</div>
			</div>
			<slot></slot>
		
    	`
	}


	tab(name: string) {
		return html`
			<button class="mdc-tab" role="tab" tabindex="0">
				<span class="mdc-tab__content">									
					<span class="mdc-tab__text-label">${name}</span>									
				</span>
				<span class="mdc-tab-indicator">
					<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
				</span>
				<span class="mdc-tab__ripple"></span>
			</button>		
		`;
	}

	


}

export default TabPageElement;