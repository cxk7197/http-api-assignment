const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  notFound: responseHandler.notFound,
};


// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
  // parse the url using the url module
  // This will let us grab any section of the URL by name
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

// grab the 'accept' headers (comma delimited) and split them into an array

  const acceptedTypes = request.headers.accept.split(',');

// adding params
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
