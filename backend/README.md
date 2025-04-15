# API de Patrimonio Financiero

## Endpoints

### GET /api/patrimonio/datos-simbolos

Obtener todos los datos de símbolos financieros.

```shell
curl http://localhost:8080/api/patrimonio/datos-simbolos
```

### GET /api/patrimonio/simbolos-favoritos

Obtener todos los símbolos favoritos.

```shell
curl http://localhost:8080/api/patrimonio/simbolos-favoritos
```

### POST /api/patrimonio/simbolos-favoritos

Añadir un nuevo símbolo favorito.

#### Ejemplos

```shell
curl -X POST http://localhost:8080/api/patrimonio/simbolos-favoritos -H 'Content-Type: application/json' -d '{ "symbol": "AAPL", "cantidad": 10 }'
```

```shell
curl -X POST http://localhost:8080/api/patrimonio/simbolos-favoritos -H 'Content-Type: application/json' -d '{ "symbol": "MSFT", "cantidad": 5 }'
```

### PUT /api/patrimonio/simbolos-favoritos/:symbol

Actualizar la cantidad de un símbolo favorito.

#### Ejemplos

```shell
curl -X PUT http://localhost:8080/api/patrimonio/simbolos-favoritos/AAPL -H 'Content-Type: application/json' -d '{ "cantidad": 20 }'
```

```shell
curl -X PUT http://localhost:8080/api/patrimonio/simbolos-favoritos/MSFT -H 'Content-Type: application/json' -d '{ "cantidad": 15 }'
```

### DELETE /api/patrimonio/simbolos-favoritos/:symbol

Eliminar un símbolo favorito.

#### Ejemplos

```shell
curl -X DELETE http://localhost:8080/api/patrimonio/simbolos-favoritos/AAPL
```

```shell
curl -X DELETE http://localhost:8080/api/patrimonio/simbolos-favoritos/MSFT
```
