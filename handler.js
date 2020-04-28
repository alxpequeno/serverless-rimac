'use strict';

const https = require('https')
const AWS = require('aws-sdk')

const defaultOptions = {
  host: 'swapi.dev',
  port: 443,
  headers: {
    'Content-Type': 'application/json',
  }
};

const get = (path) => new Promise((resolve, reject) => {
  const options = { ...defaultOptions, path, method: 'GET' };
  const req = https.request(options, res => {
    let buffer = "";
    res.on('data', chunk => buffer += chunk)
    res.on('end', () => resolve(JSON.parse(buffer)))
  });
  req.on('error', e => reject(e.message));
  req.write('');
  req.end();
});

module.exports = {

  darthvader: async event => {
    const response = await get("/api/people/4/");
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          nombre: response.name,
          estatura: response.height + " cm",
          peso: response.mass + " kg",
          fecha_nacimiento: response.birth_year,
          _link: response.url,
        },
        null,
        2
      ),
    };
  },

  create: async event => {
    let body = JSON.parse(event.body);
    let params = {
      TableName: process.env.DYNAMODB_PERSON_TABLE,
      Item: {
        name: body.name,
        age: body.age
      }
    }
    let result = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      result = await dynamodb.put(params).promise()
    } catch (error) {
      console.log(error);
      return { 
        statusCode: 400 }
    }

    return { statusCode: 201 }
  },

  find: async event => {
    let params = {
      TableName: process.env.DYNAMODB_PERSON_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    let result = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      result = await dynamodb.get(params).promise()
    } catch (error) {
      console.log(error)
      return { statusCode: 500 }
    }
    console.log(result);
    if (result === null) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: result.Item.name,
        age: result.Item.age
      })
    }
  }
}