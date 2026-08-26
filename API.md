# API

`POST /api/urls` accepts `{ "originalUrl": "https://example.com", "customAlias": "docs" }` and returns a created URL. Only `http` and `https` schemes are accepted; aliases are lowercase, globally unique, and cannot use reserved routes.

`GET /api/urls` returns the current user’s URL collection. `GET /:shortCode` performs a 302 redirect when the mapping is active and not expired, otherwise returns a structured 404 error.