import "./app/wsa-app";
import './app/fonts.scss';

const appMount = document.querySelector("#wsa-container");
if (appMount) {

  const appRender = () => appMount.appendChild(document.createElement("wsa-app"));
  if (process.env.NODE_ENV === 'development' && (module as any).hot) {
    (module as any).hot.accept('./app/wsa-app', appRender);
  }
  appRender();
}




