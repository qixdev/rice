# SharedForm

This is an app for users to create forms for various purposes
such as survey, test, etc.

Admin panel credentials:
Username: `danial@danial.com`
Password: `danialdanial`

instructions:

- `npm install`
- run backend via `node app.js`
- run frontend via
    - `cd client`
    - `npm install`
    - `npm run dev`
- go to `http://localhost:5173`

Database Structure

Collections and Relationships

1. Users Collection (users)

```json
{
  "_id": ObjectId,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "balance": 15.50,
  "createdSurveys": [
    ObjectId
  ],
  "completedSurveys": [
    ObjectId
  ],
  "joinedAt": ISODate
}
```

2. Surveys Collection (surveys)

```json

{
  "_id": ObjectId,
  "creatorId": ObjectId,
  "title": "Customer Satisfaction Survey",
  "description": "Survey about product quality",
  "questions": [
    {
      "questionId": ObjectId,
      "questionText": "How satisfied are you?",
      "questionType": "multiple_choice",
      "options": [
        "Very Satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied"
      ]
    }
  ],
  "responsesCount": 120,
  "rewardPerResponse": 0.50,
  "totalBudget": 60.00,
  "createdAt": ISODate
}
```

3. Responses Collection (responses)

```json
{
"_id": ObjectId,
"surveyId": ObjectId,
"userId": ObjectId,
"answers": [
{ "questionId": ObjectId, "answer": "Very Satisfied" }
],
"submittedAt": ISODate
}
```

API Endpoints

1. Authentication

##### User Registration

`POST /api/auth/register`
```json
{
"username": "john_doe",
"email": "john@example.com",
"password": "password123"
}
```
##### User Login

`POST /api/auth/login`
```json
{
"email": "john@example.com",
"password": "password123"
}
```
Response: Returns a JWT token.

2. User Endpoints

##### Get User Details

`GET /api/users/:id`

##### Get Balance

`GET /api/users/:id/balance`

3. Survey Endpoints

##### Create a Survey

`POST /api/surveys`
```json
{
"title": "Customer Feedback Survey",
"description": "Feedback on our new product",
"questions": [
{ "questionText": "How do you rate our service?", "questionType": "multiple_choice", "options": ["Good", "Bad"] }
],
"rewardPerResponse": 0.50,
"totalBudget": 100.00
}
```
##### Get All Surveys

`GET /api/surveys`

##### Get a Survey by ID

`GET /api/surveys/:id`

##### Get Surveys Created by a User

`GET /api/users/:id/surveys`

4. Response Endpoints

##### Submit a Response

`POST /api/responses`
```json
{
"surveyId": "survey_object_id",
"userId": "user_object_id",
"answers": [
{ "questionId": "question_object_id", "answer": "Good" }
]
}
```
##### Get Responses for a Survey

`GET /api/surveys/:id/responses`

### Security Measures

✅ Password Hashing using bcrypt

✅ JWT Authentication for secure access

✅ Surveys moderation(to prevent spam and fraud)

Future Enhancements

- Add payment gateway for withdrawing earnings
- Implement analytics dashboard for survey creators
- Add role-based access control (admin, user)

### License
MIT License.

### Contact
For issues, contact 230408@astanait.edu.kz or create an issue on GitHub.

🚀 Happy Coding!

