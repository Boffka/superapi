### TEST Api
Made according to the terms of reference including the [best practice](https://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/) of constructing the REST API

### Prerequisites
Tested with following node versions:
- 9.5.0 

## Getting Started

```
git clone https://github.com/Boffka/superapi.git
cd superapi
npm setup
npm start
```

### Authorization & Authentication
Updating the token occurs using the sliding expiration method: With each request, the creation date of the token is updated.

The lifetime of the token in seconds can be changed in "options" section `server\model-config.json` (Default ttl = 10 minutes) :
```
"profile": {
    "dataSource": "mongodb",
    "public": true,
    "options":{
      "ttl": 600
    }
  }
```
#### Making authenticated requests with access tokens
Once a user is logged in, API creates a new AccessToken referencing the user. 
This token is required when making subsequent REST requests for the access control system to validate that the user can invoke methods on a given method.


```
ACCESS_TOKEN=6Nb2ti5QEXIoDBS5FQGWIz4poRFiBCMMYJbYXSGHWuulOuy0GTEuGx2VCEVvbpBK

# Authorization Header
curl -X GET -H "Authorization: $ACCESS_TOKEN" \
http://localhost:3000/api/v1/services

# Query Parameter
curl -X GET http://localhost:3000/api/services?access_token=$ACCESS_TOKEN
```

The token is returned in the format:
```
{
  "id": "yv60C6TjlHtf1750jWvo7QZbHzIexlwQlqxFQVDk2zGfsNjhV8aL8jrdmkCYqK2t", //Access token
  "ttl": 600,                                                               //time in s.
  "created": "2018-04-01T15:42:10.500Z",
  "userId": "5ac0cd4602c4e31fb8d5b2c1"
}
```

## Api Url

```
http://localhost:3000/api/v1
```
    
## API Methods
### Profile:

`http://localhost:3000/api/v1/profile`

**signup** *[POST]* - Signup user with Username(phonenumber or email)
After registration, the type of account (phone / e-mail) is automatically set in the profile. If the registration is successful, it returns a token.

Accepted parameters:
```
{
  username: String,
  password: String
}
```

**signin** *[POST]* Signin with credentials.

**logout** *[GET]* Logout

*params:*
- all *[true/false]*: `true` removes all user tokens, `false` deletes only the current token

**info** *[GET]* Returns the name of the current user and account type

Returns:
```
{
  "username": "Username",
  "usertype": "phone/email",
  "id": "userId"
}
```

### Services:

`http://localhost:3000/api/v1/services`

**latency** *[GET]* Returns the delay from the service to the source (by default: `https://google.com`).

*params:*
- URI *link*: Source endpoint url

Returns:
```
{
  "source": "Source URI",
  "latency": "Latency in ms"
}
``` 

##todo
- Username sanitize
- Tests
- Handle Errors
- Documentation