package wdstarterapp;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.enterprise.context.RequestScoped;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/file")
@RequestScoped
public class FileRS {

	static Logger logger = LoggerFactory.getLogger(FileRS.class);

	@GET()
	@Path("{id}")
	@Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	public Response downloadFile(@PathParam("id") String projectId) {
		XSSFWorkbook wb = new XSSFWorkbook();
		XSSFSheet sheet = wb.createSheet("Test");
		XSSFRow row = sheet.createRow(0);
		XSSFCell cell = row.createCell(0);
		cell.setCellValue("Example Excel File");

		StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(OutputStream os) throws IOException, WebApplicationException {
				wb.write(os);
			}
		};

		return Response.ok(stream).build();
	}

	@PUT()
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response transformFile(@PathParam("id") String projectId, MultipartFormDataInput input) {
		try {

			String id = input.getFormDataPart("id", String.class, null);
			byte[] fileContents = input.getFormDataPart("file", byte[].class, null);
			String fileName = getFileName(input.getFormDataMap().get("file").get(0).getHeaders());

			XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(fileContents));

			return Response.status(Response.Status.OK).entity(Json.createObjectBuilder().add("status", "ok").build()).build();
		} catch (Exception e) {
			logger.error("", e);
			JsonObject status = Json.createObjectBuilder().add("status", "error").add("message", e.getMessage() != null ? e.getMessage() : "").build();
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(status).build();
		}
	}

	@PUT()
	@Path("transform")
	@Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(@PathParam("id") String projectId, MultipartFormDataInput input) {
		try {

			String id = input.getFormDataPart("id", String.class, null);
			byte[] fileContents = input.getFormDataPart("file", byte[].class, null);
			String fileName = getFileName(input.getFormDataMap().get("file").get(0).getHeaders());

			try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(fileContents))) {

				XSSFSheet sheet = wb.getSheetAt(0);
				XSSFRow row = sheet.getRow(0);
				if (row == null) {
					row = sheet.createRow(0);
				}
				XSSFCell cell = row.createCell(1);
				cell.setCellValue("Example Transform");

				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				wb.write(bos);
				ResponseBuilder response = Response.status(Response.Status.OK);
				response.header("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
				// https://stackoverflow.com/a/49286437
				response.header("Access-Control-Expose-Headers", "Content-Disposition");
				response.entity(bos.toByteArray());
				return response.build();
			}

		} catch (Exception e) {
			logger.error("", e);
			JsonObject status = Json.createObjectBuilder().add("status", "error").add("message", e.getMessage() != null ? e.getMessage() : "").build();
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(status).build();
		}
	}

	private String getFileName(MultivaluedMap<String, String> header) {

		String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

		for (String filename : contentDisposition) {
			if ((filename.trim().startsWith("filename"))) {

				String[] name = filename.split("=");

				String finalFileName = name[1].trim().replaceAll("\"", "");
				return finalFileName;
			}
		}
		return "unknown";
	}

}