const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// added status here that way we aren't hard coding it anymore
const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const createResponse = (request, response, requestedObject, status, type) => {
  if (type[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${requestedObject.message}</message>`;
    responseXML = `${responseXML} <id>${requestedObject.id}</id>`;
    responseXML = `${responseXML} <name>${requestedObject.name}</name>`;
    responseXML = `${responseXML} </response>`;

  // return response passing out string and content type
    return respond(request, response, responseXML, status, 'text/xml');
  }

  const jsonResponse = JSON.stringify(requestedObject);

  return respond(request, response, jsonResponse, status, 'application/json');
};

const success = (request, response, type) => {
  const requestedObject = {
    message: 'This is a successful response',
  };

  createResponse(request, response, requestedObject, 200, type);
};

const badRequest = (request, response, type, params) => {
  const requestedObject = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    requestedObject.message = 'Missing valid query parameter set to true';
    requestedObject.id = 'badRequest';

    return createResponse(request, response, requestedObject, 400, type);
  }

  return createResponse(request, response, requestedObject, 200, type);
};


const unauthorized = (request, response, type, params) => {
  const requestedObject = {
    message: 'You have successfully viewed the content',
  };

  if (!params.loggedIn || params.loggedIn !== 'true') {
    requestedObject.message = 'Missing loggedIn query parameter set to yes';
    requestedObject.id = 'unauthorized';

    return createResponse(request, response, requestedObject, 401, type);
  }

  return createResponse(request, response, requestedObject, 200, type);
};

const forbidden = (request, response, type) => {
  const requestedObject = {
    message: 'This is a successful response',
    id: 'forbidden',
  };

  createResponse(request, response, requestedObject, 403, type);
};

const notImplemented = (request, response, type) => {
  const requestedObject = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  createResponse(request, response, requestedObject, 501, type);
};

const internal = (request, response, type) => {
  const requestedObject = {
    message: 'Interal Server Error. Something went wrong.',
    id: 'internalError',
  };

  createResponse(request, response, requestedObject, 500, type);
};

const notFound = (request, response, type) => {
  const requestedObject = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  createResponse(request, response, requestedObject, 404, type);
};

const getCSS = (request, response) => {
  respond(request, response, css, 200, 'text/css');
};

const getIndex = (request, response) => {
  respond(request, response, index, 200, 'text/html');
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
  getIndex,
  getCSS,
};


//
