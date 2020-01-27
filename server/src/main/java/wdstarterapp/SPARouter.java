package wdstarterapp;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

@ApplicationScoped
public class SPARouter {

	public void setupRouter(@Observes Router router) {
		router.route("/client*").handler(StaticHandler.create("index.html"));
		router.route("/project*").handler(StaticHandler.create("index.html"));
	}

}