# App Patrimonio

Aplicación web para la gestión y seguimiento de un portafolio de activos financieros en tiempo real.

Desarrollado por **Enrique Redondo Cortés** para la asignatura de *Servicios y Plataformas Web*.

***
*Acceso a la aplicación directamente en este enlace a **Render**:*

https://app-patrimonio.onrender.com
***

Vídeo de uso:

`// TODO`

## Descripción

App Patrimonio es una aplicación web que permite a los usuarios gestionar 
y hacer seguimiento de su portafolio de activos financieros. 
La aplicación permite, entre otras cosas:

- Visualizar información sobre diferentes símbolos financieros
- Añadir símbolos a favoritos con cantidades específicas
- Actualizar las cantidades de los símbolos favoritos
- Eliminar símbolos de favoritos
- Ver precios en tiempo real en USD o EUR
- Comprobar el estado actual del mercado

## API utilizada

Twelve Data API: extracción de datos financieros en tiempo real.

### Limitaciones de la API
 
En la capa gratuita, API de Twelve Data tiene algunas limitaciones:

- Límite diario de llamadas a la API: 800 llamadas por día.
- No admite función de búsqueda por símbolo.
- Cobertura de mercados limitada: solo incluye datos de mercados de EE. UU. y Forex.
- Sin acceso a datos específicos: No incluye datos de desglose de fondos mutuos y ETFs, 
  datos de análisis, datos pre/post mercado de EE. UU., "market movers".

Se han probado otras APIs gratuitas de datos financieros, pero han resultado ser aún peores en la mayoría de aspectos.
En concreto, han sido:

- [Polygon.io](https://polygon.io/)
- [Finnhub](https://finnhub.io/)


## Endpoints de la API desarrollada

### API de datos de patrimonio

- `GET /api/patrimonio/datos-simbolos` - Obtiene datos sobre símbolos financieros
- `GET /api/patrimonio/simbolos-favoritos` - Obtiene los símbolos favoritos del usuario
- `POST /api/patrimonio/simbolos-favoritos` - Añade un nuevo símbolo favorito con una cantidad
- `PUT /api/patrimonio/simbolos-favoritos/:symbol` - Actualiza la cantidad de un símbolo favorito
- `DELETE /api/patrimonio/simbolos-favoritos/:symbol` - Elimina un símbolo de favoritos

### API que utiliza los servicios de Twelve Data

- `GET /api/twelvedata/exchange-rate/usd-eur` - Obtiene el tipo de cambio de USD a EUR
- `GET /api/twelvedata/price/:symbol/:currency` - Obtiene el precio de un símbolo en una moneda específica
- `GET /api/twelvedata/market-state` - Obtiene el estado actual del mercado

## Instalación local (no recomendado, mejor acceder a Render y visualizar el código en GitHub)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd app-patrimonio
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```
DB_NAME=nombre_de_la_base_de_datos
MONGO_URI=url_de_la_conexion_a_mongodb
API_KEY_TWELVE_DATA=la_api_key_de_twelve_data
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

## Ejecución

### Iniciar el backend

```bash
cd backend
npm start
```

El servidor se iniciará en `http://localhost:8080`.

### Iniciar el frontend

```bash
cd frontend
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.