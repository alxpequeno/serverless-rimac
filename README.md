# Serverless Rimac

Ejemplo serverless framework con node.

## Instalación
```bash
npm install
serverless deploy
```

## Endpoint
```bash
  GET - https://****.execute-api.us-east-1.amazonaws.com/dev/darthvader
  POST - https://****.execute-api.us-east-1.amazonaws.com/dev/person
  GET - https://****.execute-api.us-east-1.amazonaws.com/dev/person/{name}
```

## Person 
Payload de la inserción
```json
{
   "name":"alexis",
   "age": 29
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
