import { html, css, customElement, property } from 'lit-element';
import { render } from 'lit-html';

import { ViewElement } from '../../components/wsa-view';

import { WSAStore } from '../../app/store';
import { User, fetchUsers } from './admin-actions';

import '../../components/wsa-table';



@customElement('wsa-admin-page')
export class AdminPageElement extends ViewElement {

	@property({ type: String })
	pageTitle = 'Administration';

	@property({ type: Array })
	users: Array<User> = [];


	workdayTemplatesFile: HTMLInputElement | null = null;


	firstUpdated() {
		console.log("firstUpdate");
		this.dispatch(fetchUsers());
		if (this.shadowRoot) {
			this.workdayTemplatesFile = this.shadowRoot.querySelector("#workdayTemplates");
		}
	}


	render() {

		return html`
		
			${this.pageTitleTemplate}
			<section class="wsa-page-body">
				${this.loadingTemplate}
				${this.usersTemplate}
				${this.fileTemplate}		 				
			</section>
			
    `;
	}


	async handleUpload(e: MouseEvent) {
		console.log("handleUpload", this.workdayTemplatesFile);
		if (this.workdayTemplatesFile && this.workdayTemplatesFile.files && this.workdayTemplatesFile.files.length > 0) {
			this.workdayTemplatesFile.value = '';
		}
		this.workdayTemplatesFile && this.workdayTemplatesFile.click();
	}

	async handleFileUpload() {
		console.log("handleFileUpload", this.workdayTemplatesFile);
		if (this.workdayTemplatesFile && this.workdayTemplatesFile.files && this.workdayTemplatesFile.files.length > 0) {

			let formData = new FormData();
			let file = this.workdayTemplatesFile.files[0];
			formData.append("file", file);
			this.loading = true;
			try {
				const response = await fetch("/api/admin/templates", {
					method: 'PUT',
					body: formData
				});
				const result = await response.json();
				console.log('Success:', JSON.stringify(result));
			} catch (error) {
				console.error('Error:', error);
			}
			this.loading = false;
		}

	}

	get fileTemplate() {
		return html`
		<div class="wsa-upload-wrapper">
				 <input type="file" name="workdayTemplates" id="workdayTemplates" @change="${this.handleFileUpload}" />
		</div>

		`;

	}

	get usersTemplate() {
		return html`
			<div class="wsa-scroll" style="height: 300px">
					<wsa-table name="Users" .entries=${this.users}>
							<wsa-row width="100px" .renderer=${this.editRenderer}></wsa-row>
							<wsa-row key="name" header="Name"></wsa-row>						
							<wsa-row .renderer=${this.roleAssignmentRenderer} header="Role Assignments"></wsa-row>
					</wsa-table>
			</div>
		`;

	}
	editRenderer(u: User) {
		return html`<div class="wdc-icon-list-icon">
						<span @click="${(m: MouseEvent) => this.editUser(u)}">
							<i class="wdc-icon" data-icon="edit" data-category="system" data-size="20"></i>
						</span>
					</div>

		`;
	}


	editUser(u: User) {
		console.log("editUser", u);
	}

	roleAssignmentRenderer(u: User) {
		return html``;
	}


	stateChanged(state: WSAStore) {
		if (state.admin.users) {
			this.users = state.admin.users;
		}

	}




}


export default AdminPageElement;