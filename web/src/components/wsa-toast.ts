import { LitElement, html, css, customElement, property } from 'lit-element';

// @ts-ignore
import initializeIcons from '@workday/canvas-kit-css-icon/lib/canvas-kit-css-icon.js';

const style = css(<any>[require('../app/wsa-app.scss').default]);

import './wsa-popper';
import PopperElement from './wsa-popper';

@customElement('wsa-toast')
export class ToastElement extends LitElement {

	@property({ type: String, attribute: true, reflect: true })
	icon = 'check';

	@property({ type: String, attribute: true, reflect: true })
	iconColor = 'greenApple400';

	@property({ type: String, attribute: true, reflect: true })
	message = '';

	@property({ type: String, attribute: 'action-text' })
	actionText = '';




	static get styles() {
		return [style, css`
			
			.wsa-toast {
				background-color: #ffffff;
				border: 1px solid #ced3d9;
				border-radius: 8px;
				box-sizing: border-box;
				box-shadow: 0px 4px 8px 0 rgba(0,0,0,0.1);
				padding: 16px;
				width: 360px;
			}

			.wsa-toast-container {
				display: flex;				
				align-items: center;
			}

			.wsa-toast-icon {
				display: inline-block;
				margin-right: 16px;
				-webkit-align-self: start;
				-ms-flex-item-align: start;
				align-self: start;
			}

			.wsa-toast-message {
				word-break: break-word;
    			word-wrap: break-word;
			}


			.wsa-toast-button {
				display: block;
	 			background-color: transparent;
				border: none;
				padding: 0;
				margin-top: 4px;
			}

			:host{
				display: none;
				position: fixed;
				 cursor: pointer;
				z-index:2;
			}
			:host(.wsa-fade-out) {
				display: block;
	  			visibility: hidden;
  				opacity: 0;
  				transition: visibility 0s linear 500ms, opacity 500ms;
			}

			:host(.wsa-fade-in) {
				display: block;
				visibility: visible;
				opacity: 1;
				transition: visibility 0s linear 0s, opacity 500ms;
			}
						
		
		`];
	}

	updated(changedProperties: Map<string, any>) {
		console.log(changedProperties);
		console.log("updated", this.icon, this.shadowRoot!.querySelector("i"));
		//if the icon changes the cached template needs to be updated since the i element may have been replaced by a svg element via the initializeIcons function
		if (changedProperties.has("icon") || changedProperties.has("iconColor")) {
			let span = this.shadowRoot!.getElementById("toast-icon") as HTMLSpanElement;
			if (span) {
				while (span.firstChild) {
					span.removeChild(span.firstChild);
				}
				let icon = document.createElement("i");
				icon.classList.add("wdc-icon");
				icon.setAttribute("data-icon", this.icon);
				icon.setAttribute("data-category", "system");
				icon.setAttribute("data-color", this.iconColor);
				span.appendChild(icon);
				initializeIcons(null, '.wdc-icon', span);
			}

		}
	}


	render() {
		console.log("rendered", this.icon);
		if (!!this.message) {
			return html`
			<wsa-popper @wsa-popper-close=${this.close}>	

				<div width="360" class="wsa-toast">
					<div class="wsa-toast-container wdc-type-body-2">

						<span id="toast-icon" class="wsa-toast-icon">
							<i  class="wdc-icon" data-icon="${this.icon}" data-category="system" data-color="${this.iconColor}"></i>
						</span>
						<div class="wsa-toast-message">${this.message}${this.action}</div>
					</div>
				</div>

			</wsa-popper>	
		`;
		}
	}

	get action() {
		if (!!this.actionText) {
			return html`<button class="wdc-type-body-2 wdc-type-variant-link wsa-toast-button" @onclick=${this.actionHandler}>${this.actionText}</button>`;
		} else {
			return html``;
		}
	}

	actionHandler() {
		this.dispatchEvent(new CustomEvent(`wsa-toast-action`));
	}

	open() {
		this.classList.remove('wsa-fade-out');
		this.classList.add('wsa-fade-in');
		this.requestUpdate();
	}

	close() {
		this.classList.remove('wsa-fade-in');
		this.classList.add('wsa-fade-out');
		this.requestUpdate();
	}


}

export default ToastElement;

export interface Environment {
	env: string
	name: string
	token: string
}






