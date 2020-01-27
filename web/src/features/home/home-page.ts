import { LitElement, html, css, customElement, property } from 'lit-element';

import { ViewElement } from '../../components/wsa-view';

@customElement('wsa-home-page')
export class HomePageElement extends ViewElement {

  @property({ type: String })
  pageTitle = 'Home';


  render() {

    return html`${this.pageTitleTemplate} 
 
      <section class="md-page-body">

				<p>Click the top left menu button to view a few sample pages.</p> 
				
				
			</section>
    `;
  }

}

export default HomePageElement;