**Workday® is the registered trademark of Workday, Inc. This project is not affiliated with Workday, Inc. and Workday, Inc. does not endorse this project.**


# WD Start Kit - Reference Application using the Workday Canvas Kit

This baseline application serves as a functional reference of the blending of several popular Java and Web technologies together including the Workday Canvas Kit. Often times technology selection and building a functional development environment are the most challenging tasks when designing and building a new application. This application is intended to help with both these concerns and it is available for partial or full reuse. 

This application framework could be used to interact with Workday or other related services. 

## Server Technologies

* [Java](https://www.oracle.com/technetwork/java/javase/overview/index.html)
* [Quarkus](https://quarkus.io/)
* [Vert.x](https://vertx.io/)
* [Microprofile](https://microprofile.io/)
* [GraphQL](https://graphql.org/)
* [OIDC](https://developer.okta.com/docs/reference/api/oidc/)
* [Docker](https://www.docker.com/)
* [Maven](https://maven.apache.org/)
* [Maven Frontend Plugin](https://github.com/eirslett/frontend-maven-plugin)

## Client Technologies
* [TypeScript](https://www.typescriptlang.org/)
* [LitElement](https://lit-element.polymer-project.org/)
* [Apollo GraphQL Client](https://www.apollographql.com/docs/react/)
* [Workday Canvas Kit](https://github.com/Workday/canvas-kit)
* [Material Design Web Components](https://material.io/develop/web/)
* [Vaadin Router](https://vaadin.com/router)
* [Redux](https://redux.js.org/)
* [Redux Thunk](https://github.com/reduxjs/redux-thunk)
* [ImmerJS](https://immerjs.github.io/immer/docs/introduction)
* [SCSS](https://sass-lang.com/)
* [Yarn](https://legacy.yarnpkg.com/en/)
* [WebPack](https://webpack.js.org/)

## Running the Application

[JDK 13](https://jdk.java.net/13/) and [Maven](https://maven.apache.org/) are required to build the project. All other dependencies should be automatically downloaded during the build process. Linux is required unless the package.json file is adjusted. nodejs and yarn should be installed for development but the Maven frontend plugin will automatically download them as part of the build process.

1. Checkout the source code

`git clone https://github.com/aaronanderson/wd-starter-app.git`

2. Run the maven build

`mvn clean install`

3. Run Quarkus in devmode

```
cd server
mvn package quarkus:dev -Dquarkus.profile=dev 

```
Once the Quarkus server is running in devmode any changes to the Java resources, server/src, will trigger an automatic update.


4. Access the application

`http://localhost:5000`

5. Run the webpack developer server

Make sure the Quarkus application server is running since the webpack dev server forwards API requests to it.

```
cd web
yarn install
yarn build
yarn start
```

Access the dev server:

`http://localhost:8080`

Once the dev server is running any changes to the web source, web/src, will cause an immediate webpack incremental build and browser page update.


6. Run the application in Docker (Optional) 

```
cd server
mvn package
docker build -f src/main/docker/Dockerfile.jvm -t quarkus/wsa-app-jvm .
docker run -i --rm -p 5000:5000 quarkus/wsa-app-jvm
```


## Considerations

* The Workday Canvas Kit provides components for both CSS and React. Even though there are more React components available now than CSS this application does not use React. Hopefully at some point in the future there will be feature parity between the components. After working with Polymer and LitElement I personally feel that React and the VDOM are antiquated especially in light of the shift of React development to React Hooks. Custom elements, events, shadow DOM, and HTML templates all orchestrated through LitElement are more efficient and productive in my view. A few Google Material Design web components are used to supplement the missing features in the CSS components. This includes the appheader, drawer, and tabs.  


* If the Canvas Kit React components must be used then [pReact](https://preactjs.com/) can be added to this application using the methods outlined by this [sample application](https://github.com/aaronanderson/lit-react).

* The Quarkus application source is in the server directory and the web application source is in the web directory. Keeping the web directory separate allows for the standard webpack file layout to be used. As part of the Maven build process the webpack output is zipped up and included in the Quarkus application's resources directory. At some point in the future Quarkus will [support external resources](https://github.com/quarkusio/quarkus/issues/3886) and the web assets could be included via configuration instead of a source merge.


* Okta OIDC authentication has been successfully tested with this application. Configure Okta OIDC following the [instructions here](https://github.com/aaronanderson/thorntail-oidc). Then comment in the related properties in the server/src/main/resources/application.properties file and restart Quarkus.

* Currently the Quarkus OAuth extension only supports service access with an existing bearer token and not the full OAuth Code Mechanism flow. Once Quarkus supports OAuth for web applications I will update this application with Workday SSO.

* Using this [Maven plugin for generating JAX-WS API stubs](https://github.com/aaronanderson/wdutil/tree/master/wdjws-maven-plugin) this application could [interact with Workday](https://github.com/aaronanderson/wdutil/tree/master/wdjws-example) and perform various operations. To keep this application's build and dependencies simple an example of this integration was not included.

* This application should work with Quarkus GraalVM [native image support](https://quarkus.io/guides/building-native-image) but this has not been tested. 

* This application can be scaled in the AWS ECS environment as document by this [quarkus-ecs-example](https://github.com/aaronanderson/quarkus-ecs-example).

* In Quarkus devmode the GraphiQL client can be accessed at `http://localhost:5000/graphql-ui`

* The Redux DevTools middleware is installed and can be accessed via the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) Chrome extension.

* The search bar and location update example are still a work in progress.

* I used Eclipse and the [CodeMix 3](https://www.genuitec.com/products/codemix/) plugin to develop this application.






