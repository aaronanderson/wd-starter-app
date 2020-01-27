package wdstarterapp;

import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;
//import org.eclipse.microprofile.jwt.JsonWebToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//import io.quarkus.oidc.IdToken;
 
@Path("/env")
@RequestScoped
public class EnvRS {

	static Logger logger = LoggerFactory.getLogger(EnvRS.class);
	
	@ConfigProperty(name = "quarkus.profile")
	String profile;

//	@Inject
//	@IdToken
//	JsonWebToken idToken;

	@GET
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response status() {
		try {

			JsonObjectBuilder status = Json.createObjectBuilder();
			status.add("env", profile);
			//status.add("name", idToken.getName());
			//status.add("token", idToken.getRawToken());

			return Response.status(200).entity(status.build()).build();

		} catch (Exception e) {
			logger.error("", e);
			JsonObject status = Json.createObjectBuilder().add("status", "error").add("message", e.getMessage() != null ? e.getMessage() : "").build();
			// output.addFormData("status", status, MediaType.APPLICATION_JSON_TYPE);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(status).build();

		}

	}

}
