import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1
app.get("/filteredimage", async (req, res) => {
  const param_img_url = req.query.param_image_header;
  if (!param_img_url) {
    return res.status(400).send("param_image_header is required");
  }

  try {
    const filteredPath = await filterImageFromURL(param_img_url);
    res.status(200).sendFile(filteredPath, () => {
      deleteLocalFiles([filteredPath]);
    });
  } catch (error) {
    console.error("Error filtering image:", error);
    res.status(500).send("Error filtering image");
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("Try GET /filteredimage?image_url={{URL}}");
});


// Start the Server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
  console.log(`Press CTRL+C to stop server`);
});