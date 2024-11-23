# Authentication Flow

When a user logs in, Firebase authentication returns a token if they are a registered user. This token is stored in the cookies, and is sent to the backend/server on every request. The token tells the server if the user is allowed to perform certain actions or not.