import { LitElement, html, css, customElement, property, TemplateResult } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

// @ts-ignore
import initializeIcons from '@workday/canvas-kit-css-icon/lib/canvas-kit-css-icon.js';


const style = css(<any>[require('../app/wsa-app.scss').default]);


@customElement('wsa-table')
export class TableElement<E> extends LitElement {

	@property({ type: String, attribute: true })
	name?: string;

	@property({ type: Boolean })
	editMode: boolean = false;

	@property({ type: Boolean })
	inlineEditMode: boolean = false;

	@property({ type: Object })
	additionalEditRenderer?: Function;

	//@property({ type: Object })
	//pendingChanges: Set<E> = new Set();

	_entries: E[] = []

	rows: TableRowElement[] = [];


	@property({ type: Array })
	public get entries(): E[] {
		return this._entries;
	}

	public set entries(value: E[]) {
		const oldValue = this._entries;
		this._entries = [...value];
		this.requestUpdate('entries', oldValue);
	}


	static get styles() {
		return [style];
	}

	constructor() {
		super();
		this.rows = Array.from(this.children) as TableRowElement[];
	}

	firstUpdated() {

	}

	render() {
		if (this.editMode) {
			return this.editEntriesTemplate;
		} else {
			return this.entriesTemplate;
		}
	}


	// <div class="wdc-icon-list-icon">
	// 						<i class="wdc-icon" data-icon="sort" data-category="system"></i>
	// 					</div>
	get entriesTemplate() {
		return html`
				<div class="wdc-table-meta">
					<div class="wdc-table-info">
						<span class="wdc-table-name">${this.name}</span>
						<span class="wdc-table-row-count">${this.entries.length} Items</span>
					</div>

					<div class="wdc-icon-list">
						
						<div class="wdc-icon-list-icon">
							<i class="wdc-icon" data-icon="filter" data-category="system"></i>
						</div>										
					</div>
				</div>
			
				<table class="wdc-table">
					<thead>
						<tr>
							${this.rows.map((r: TableRowElement) => html`<th scope="col" style="${this.cellWidth(r)}">${r.header}</th>`)}
						</tr>
					</thead>
					<tbody>
						${this.entries.map((e: E) => this.entryRow(e))}               
					</tbody>
				</table>
			`
	}

	// <div class="wdc-icon-list-icon">
	// 						<i class="wdc-icon" data-icon="sort-up" data-category="system"></i>
	// 					</div>
	get editEntriesTemplate() {
		return html`			
				<div class="wdc-table-meta">
					<div class="wdc-table-info">
						<span class="wdc-table-name">${this.name}</span>
						<span class="wdc-table-row-count">${this.entries.length} Items</span>
					</div>

					<div class="wdc-icon-list">
						
						<div class="wdc-icon-list-icon">
							<i class="wdc-icon" data-icon="filter" data-category="system"></i>
						</div>										
					</div>
				</div>
				
				<table class="wdc-table">
					<thead>
						<tr>
							<th scope="col" style="width: 100px">
								<span @click="${(m: MouseEvent) => this.addEntry()}">	
									<i class="wdc-icon" data-icon="plus" data-category="system" data-size="20"></i>
								</span>	
							</th>
							${this.rows.map((r: TableRowElement) => html`<th scope="col" style="${this.cellWidth(r)}">${r.header}</th>`)} 
						</tr>
					</thead>
					<tbody>
						${this.entries.map((e: E) => this.entryEditRow(e))}               
					</tbody>
				</table>
				
				${this.additionalEditRenderer ? this.additionalEditRenderer(this._entries) : null}
			
			`


	}

	updated(changedProperties: Map<string, any>) {
		//console.log(changedProperties);
		initializeIcons(null, '.wdc-icon', this.shadowRoot);

	}

	entryRow(e: E) {
		let body: TemplateResult[] = [];
		this.rows.forEach((row: TableRowElement) => {
			body.push(this.renderCell(e, row));
		});
		return html`<tr>${body}</tr>`;

	}

	entryEditRow(e: E) {
		let body: TemplateResult[] = [];
		body.push(html`
						<td style="width: 100px"
							<div class="wdc-icon-list">
								${!this.inlineEditMode ? html`
								<div class="wdc-icon-list-icon">
									<span @click="${(m: MouseEvent) => this.editEntry(e)}">
										<i class="wdc-icon" data-icon="edit" data-category="system" data-size="20"></i>
									</span>
								</div>`: null
			}																
								<div class="wdc-icon-list-icon">
									<span @click="${(m: MouseEvent) => this.removeEntry(e)}">
										<i class="wdc-icon" data-icon="minus" data-category="system" data-size="20"></i>
									</span>
								</div>										
							</div>
						</td>
		`);
		this.rows.forEach((row: TableRowElement) => {
			if (this.inlineEditMode) {
				if (row.key) {
					let obj = e as any;
					let k: string = row.key;
					body.push(html`
						<td style="${this.cellWidth(row)}">
							<div class="wdc-form-textinput">
									<input type="text" class="wdc-form-textinput" .value="${obj.hasOwnProperty(k) ? obj[k] : null}" @change=${(c: Event) => { obj[k] = (<HTMLInputElement>c.target).value; this.fireEvent('edit', e); this.requestUpdate(); }}/>
							</div>
						</td>								
					`);
				} else if (row.renderer) {
					body.push(html`<td style="${this.cellWidth(row)}">${row.renderer(e)}</td>`);
				}
			} else {
				body.push(this.renderCell(e, row));
			}
		});
		return html`<tr>${body}</tr>`;

	}

	cellWidth(row: TableRowElement) {
		return ifDefined(row.width ? 'width: ' + row.width : undefined);
	}

	renderCell(e: E, row: TableRowElement): TemplateResult {
		if (row.key) {
			let obj = e as any;
			return html`<td style="${this.cellWidth(row)}">${obj[row.key]}</td>`;
		} else if (row.renderer) {
			return html`<td style="${this.cellWidth(row)}">${row.renderer(e)}</td>`;
		} else {
			return html``;
		}
	}

	fireEvent(type: string, e?: E) {
		this.dispatchEvent(new CustomEvent(`wsa-table-${type}`, e ? {
			detail: {
				entry: e
			}
		} : undefined));
	}

	addEntry() {
		console.log("addEntry");
		if (this.inlineEditMode) {
			let entry = <any>{};
			this.entries.push(entry);
			this.requestUpdate();
			this.fireEvent('add', entry);
		} else {
			this.fireEvent('add');
		}
	}

	editEntry(e: E) {
		console.log("editEntry");
		this.fireEvent('edit', e);
	}


	removeEntry(e: E) {
		console.log("removeEntry");
		if (this.inlineEditMode) {
			let index = this.entries.indexOf(e);
			if (index > -1) {
				this.entries.splice(index, 1);
			}
			this.requestUpdate();
		}

		this.fireEvent('remove', e);
	}



}


@customElement('wsa-row')
export class TableRowElement extends LitElement {

	@property({ type: String, attribute: true })
	key?: string;

	@property({ type: String, attribute: true })
	header?: string;

	@property({ type: String, attribute: true })
	width?: string;

	@property({ type: Object })
	renderer?: Function;


}

export default TableElement;








