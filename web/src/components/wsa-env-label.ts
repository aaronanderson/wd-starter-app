import { LitElement, html, css, customElement, property } from 'lit-element';

const style = css(<any>[require('../app/wsa-app.scss').default]);


@customElement('wsa-env-label')
export class EnvLabelElement extends LitElement {

	@property({ type: Object })
	env?: Environment;

	envLabel?: HTMLDivElement;

	static get styles() {
		return [style];
	}


	firstUpdated() {
		if (this.shadowRoot) {
			this.envLabel = this.shadowRoot.querySelector("#envLabel") as HTMLDivElement;
		}
		this.retrieveEnv();
	}

	async retrieveEnv() {
		
		try {
			const response = await fetch("/api/env", {
				method: 'GET'
			});
			const result: Environment = await response.json();
			//console.log('Success:', JSON.stringify(result));
			if (this.envLabel) {
				if (result.env == "" || result.env == "prod") {
					this.envLabel.hidden = true;
				} else if (result.env == "qa") {
					this.envLabel.classList.add("wsa-env-qa");
					this.envLabel.textContent = "QA Enviroment";
					this.envLabel.hidden = false;
				} else if (result.env == "dev") {
					this.envLabel.classList.add("wsa-env-dev");
					this.envLabel.textContent = "Development Enviroment";
					this.envLabel.hidden = false;
				}
			}

		} catch (error) {
			console.error('Error:', error);
		}

	}

	render() {
		return html`<div id="envLabel" hidden></div>`;
	}


}

export default EnvLabelElement;

export interface Environment {
	env: string
	name: string
	token: string
}






