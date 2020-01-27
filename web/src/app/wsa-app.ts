import { LitElement, html, css, customElement, property } from 'lit-element';
import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCDrawer } from "@material/drawer";
import { MDCRipple } from '@material/ripple';

import { Router } from '@vaadin/router';

import '../features/admin/admin-page';
import '../features/home/home-page';
import '../features/location/locations-page';
import '../features/file/file-page';
import '../features/tabs/tabs-page';

import '../components/wsa-env-label';

// @ts-ignore
import initializeIcons from '@workday/canvas-kit-css-icon/lib/canvas-kit-css-icon.js';


const style = css(<any>[require('./wsa-app.scss').default]);

const fonts = require('./fonts.scss').default;


const logo = require('../assets/logo.png');



@customElement('wsa-app')
export class AppElement extends LitElement {

  firstUpdated() {

    //https://blog.webf.zone/on-styling-web-components-b74b8c70c492
    const fontStyleNode = document.createElement('style');
    fontStyleNode.innerHTML = fonts;
    document.head.appendChild(fontStyleNode);

    if (this.shadowRoot) {
      let mainContent: HTMLElement = this.shadowRoot.getElementById('main-content') as HTMLElement;
      let router = new Router(mainContent);
      router.setRoutes([
        { path: '/', component: 'wsa-home-page' },
        { path: '/admin', component: 'wsa-admin-page' },
        { path: '/locations', component: 'wsa-locations-page' },
        { path: '/location/:locationId', component: 'wsa-location-page' },
        { path: '/file', component: 'wsa-file-page' },
        { path: '/tabs', component: 'wsa-tabs-page' },
      ]);

      let iconButtonRipple = new MDCRipple(this.shadowRoot.getElementById('menu') as HTMLElement);
      iconButtonRipple.unbounded = true;

      let drawer = MDCDrawer.attachTo(this.shadowRoot.getElementById('drawer') as HTMLElement);
      let topAppBar = MDCTopAppBar.attachTo(this.shadowRoot.getElementById('app-bar') as HTMLElement);
      topAppBar.setScrollTarget(mainContent);
      topAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.open = !drawer.open;
      });

    }

  }


  static get styles() {
    return [style];
  }


  render() {

    return html`
     
   ${this.headerTemplate} 

   <div class="mdc-drawer-app-content mdc-top-app-bar--fixed-adjust">            
    <main class="main-content" id="main-content"></main>
   </div>
    `;
  }


  get headerTemplate() {
    return html`  
         
      <header class="mdc-top-app-bar mdc-top-app-bar--fixed" id="app-bar">
      
        <div class="mdc-top-app-bar__row">
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" id="menu">menu</button>

            <img src="${logo}"></img>
            <span class="mdc-top-app-bar__title">WD Starter Application</span>
          </section>
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
              <input type="search" id="site-search" name="search" list="searchResults" placeholder="Search..." size="50">        
          </section>
          
        </div>


          <datalist id="searchResults">
            <option value="Chocolate">
            <option value="Coconut">
            <option value="Mint">
            <option value="Strawberry">
            <option value="Vanilla">
          </datalist>

          <wsa-env-label id="stageLabel"></wsa-env-label>     
      </header>      

      <aside class="mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust" id="drawer"> 
        <div class="mdc-drawer__content">
          <div class="mdc-list">

            <a class="mdc-list-item mdc-list-item--activated" href="/" aria-current="page">
              <i class="material-icons mdc-list-item__graphic wdc-icon" data-icon="home" data-category="system"></i>
              <span class="mdc-list-item__text">Home</span>
            </a>
  
            <a class="mdc-list-item" href="/locations">
              <i class="material-icons mdc-list-item__graphic wdc-icon" data-icon="location" data-category="system"></i>
              <span class="mdc-list-item__text">Locations</span>
            </a>
            
            <a class="mdc-list-item" href="/file">
              <i class="material-icons mdc-list-item__graphic wdc-icon" data-icon="document" data-category="system"></i>
              <span class="mdc-list-item__text">File</span>
            </a>

            <a class="mdc-list-item" href="/tabs">
              <i class="material-icons mdc-list-item__graphic wdc-icon" data-icon="document" data-category="system"></i>
              <span class="mdc-list-item__text">Tabs</span>
            </a>

          </div>
        </div>
      </aside>

 
    `;
  }


  updated(changedProperties: Map<string, any>) {
    //console.log(changedProperties);
    initializeIcons(null, '.wdc-icon', this.shadowRoot);

  }



}

export default AppElement;


