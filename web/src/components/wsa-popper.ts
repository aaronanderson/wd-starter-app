import { LitElement, html, css, customElement, property } from 'lit-element';

// @ts-ignore
import initializeIcons from '@workday/canvas-kit-css-icon/lib/canvas-kit-css-icon.js';

const style = css(<any>[require('../app/wsa-app.scss').default]);

@customElement('wsa-popper')
export class PopperElement extends LitElement {

	popper?: HTMLDivElement | null;

	static get styles() {
		return [style, css`
			
			.wsa-popper {								
				position: relative;
				width: 360px;
				animation-duration: 150ms;
				animation-timing-function: ease-out;
				transform-origin: top center;
			}

			.wsa-popper-close {
				position: absolute;
 			    right: 10px;
    			top: 10px;
			}

			.wsa-popper-close-button {
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 13px;
				border-radius: 999px;
				border: 1px solid transparent;
				box-shadow: none;
				position: relative;
				cursor: pointer;
				outline: none;
				transition: all 120ms linear;
				border-width: 0;
				background-color: transparent;
				margin: -6px;
				width: 32px;
				height: 32px;
			}

			
			
		
		`];
	}


	updated(changedProperties: Map<string, any>) {
		//console.log(changedProperties);
		initializeIcons(null, '.wdc-icon', this.shadowRoot);

	}


	render() {
		return html`
			<div  width="360" role="dialog" class="wsa-popper">
				<div class="wsa-popper-close">
					<button data-close="close" title="Close" aria-label="Close" class="wsa-popper-close-button" @click=${this.close}>
						<i class="wdc-icon" data-icon="x" data-category="system"></i>	
					</button>
				</div>

				<slot></slot>
			</div>	
		`;
	}

	close() {
		this.dispatchEvent(new CustomEvent(`wsa-popper-close`));		
	}


}

export default PopperElement;








