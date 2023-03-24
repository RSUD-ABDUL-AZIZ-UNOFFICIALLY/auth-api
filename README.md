# Auth



## Getting started

### Install

```bash
npm install
```
```bash
npx sequelize-cli db:migrate
```


### Run

```bash
npm start
```
## API Endpoints

### Login

```bash
POST /api/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body`    | `json`   | {"email": "Fakhry@gmail.com", "password": "123"} |

#### Response
- valid respons

{
    "status": true,
    "message": "success login",
    "data": {
        "id": 1,
        "name": "fakhry",
        "email": "Fakhry@gmail.com",
        "access_token": "eyJhbGcixxxx",
        "refresh_token": "eyJhbGciOiJIUzIxxxx",
        "created_at": "2022-12-22T09:02:11.000Z",
        "updated_at": "2022-12-22T09:02:11.000Z"
    }
}
```
- invalid response

```json
{
    "status": false,
    "message": "user not found!",
    "data": null
}
```

### Register

```bash
POST /api/register
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body`    | `json`   | {"name" : "fakhry", "email": "Fakhry@gmail.com", "password": "123"} |

#### Response

- valid respons

```json
{
    "status": true,
    "message": "user registered",
    "data": {
        "gid": "304a31fc-28e2-4eb7-a795-b308e8bde1ad",
        "name": "fakhry",
        "email": "Fakhry@gmail.com",
        "updatedAt": "2022-12-22T12:09:20.090Z",
        "createdAt": "2022-12-22T12:09:20.090Z"
    }
}
```
- invalid response

```json
{
    "status": false,
    "message": "user already exist!",
    "data": null
}
```
- invalid post
```json
{
    "status": false,
    "message": "data and salt arguments required",
    "data": null
}
```

### Refresh Token

```bash
PUT /api/refresh
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body`    | `json`   | {"refresh_token" : "eyJhbGciOiJIUzI1NiIsxx"} |

#### Response

- Valid respound

```json
{
    "status": true,
    "message": "success refresh access token",
    "data": {
        "access_token": "eyJhbGciOiJUxxx"
    }
}
```

- Invalid respound

```json
{
    "status": false,
    "message": "Session not found!",
    "data": null
}
```