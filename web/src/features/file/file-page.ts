import { html, css, customElement, property } from 'lit-element';
import { render } from 'lit-html';

import { Router } from '@vaadin/router';

import { ViewElement } from '../../components/wsa-view';

import '../../components/wsa-toast';
import ToastElement from '../../components/wsa-toast';

@customElement('wsa-file-page')
export class FilePageElement extends ViewElement {

	@property({ type: String })
	message = 'File Uploaded.';

	toast?: ToastElement;
	uploadFile: HTMLInputElement | null = null;
	transformFile: HTMLInputElement | null = null;

	firstUpdated() {
		this.pageTitle = 'File Management';
		if (this.shadowRoot) {
			this.toast = this.shadowRoot.querySelector("wsa-toast") as ToastElement;
			this.uploadFile = this.shadowRoot.querySelector("#uploadFile") as HTMLInputElement;
			this.transformFile = this.shadowRoot.querySelector("#transformFile") as HTMLInputElement;
		}
	}

	render() {
		return html`
		
			${this.pageTitleTemplate}
			<section class="wsa-page-body">
				${this.loadingTemplate}				
				${this.fileTemplate}		 				
			</section>
			
    `;

	}


	async handleDownload(e: MouseEvent) {
		//Router.go('/api/file/2');
		let link = document.createElement('a');
		link.download = 'Sample.xlsx';
		link.href = '/api/file/2';
		link.click();
	}


	async handleUpload(e: MouseEvent) {
		console.log("handleUpload", this.uploadFile);
		if (this.uploadFile && this.uploadFile.files && this.uploadFile.files.length > 0) {
			this.uploadFile.value = '';
		}
		this.uploadFile && this.uploadFile.click();
	}

	async handleFileUpload() {
		if (this.uploadFile && this.uploadFile.files && this.uploadFile.files.length > 0) {

			let formData = new FormData();
			let file = this.uploadFile.files[0];
			formData.append("file", file);
			this.loading = true;
			try {
				const response = await fetch("/api/file/1", {
					method: 'PUT',
					body: formData
				});
				const result = await response.json();
				if (!response.ok) {
					throw new Error(result.message);
				}
				//console.log('Success:', JSON.stringify(result));
				this.toast!.icon = "check";
				this.toast!.iconColor = "greenApple400";
				this.toast!.message = "File Upload Succeeded";
			} catch (error) {				
				this.toast!.icon = "X";
				this.toast!.iconColor = "cinnamon500";
				this.toast!.message = "File Upload Failed. " + error.message ;
				//console.error('Error:', error, this.toast);
			}			
			this.loading = false;
			this.toast!.open();
		}

	}


	async handleTransform(e: MouseEvent) {
		console.log("handleTransform", this.transformFile);
		if (this.transformFile && this.transformFile.files && this.transformFile.files.length > 0) {
			this.transformFile.value = '';
		}
		this.transformFile && this.transformFile.click();
	}

	async handleFileTransform() {
		console.log("handleFileTransform", this.transformFile);
		if (this.transformFile && this.transformFile.files && this.transformFile.files.length > 0) {

			let formData = new FormData();
			formData.append("id", '3');

			let file = this.transformFile.files[0];
			let fileName = file.name;
			formData.append("file", file);
			this.loading = true;
			try {
				const response = await fetch(`/api/file/transform`, {
					method: 'PUT',
					body: formData
				});
				const result = await response.blob();
				let dispositionHeader = response.headers.get("content-disposition");
				if (dispositionHeader) {
					let fileNameRegEx = dispositionHeader.match("attachment;filename=\"(.*)\"");
					if (fileNameRegEx) {
						fileName = fileNameRegEx[1];
						console.log("header fileName", fileName);
					}
				}
				let link = document.createElement('a');
				link.download = fileName;
				link.href = URL.createObjectURL(result);

				link.click();

				URL.revokeObjectURL(link.href);

			} catch (error) {
				console.error('Error:', error);
			}
			this.loading = false;
		}

	}

	get fileTemplate() {
		return html`
		<wsa-toast message="${this.message}" action-text="View Data"></wsa-toast>
		<div class="wsa-upload-wrapper">
				 <input type="file" name="Upload File" id="uploadFile" @change="${this.handleFileUpload}" />
				 <input type="file" name="Transform File" id="transformFile" @change="${this.handleFileTransform}" />
		</div>

			<div class="wdc-action-bar" role="region" aria-label="Action Bar">
				<div class="wdc-action-bar-container">
					<div>
						<button class="wdc-btn wdc-btn-primary wdc-btn-size-m" @click="${this.handleDownload}">File Download</button>
						<button class="wdc-btn wdc-btn-primary wdc-btn-size-m" @click="${this.handleUpload}">File Upload</button>						
						<button class="wdc-btn wdc-btn-primary wdc-btn-size-m" @click="${this.handleTransform}">File Transform</button>
					</div>
				</div>
			</div>		
		`;

	}


}

export default FilePageElement;