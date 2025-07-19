@echo off
echo Testing Blood Disease Classification API Endpoints
echo ================================================
echo.

set BASE_URL=http://localhost:5000/api

echo 1. Testing Health Check...
curl -X GET "%BASE_URL%/health" -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing Prediction Endpoint...
curl -X POST "%BASE_URL%/predict" ^
  -H "Content-Type: application/json" ^
  -d "{\"glucose\":120,\"hemoglobin\":14.5,\"platelets\":250000,\"cholesterol\":180,\"whiteBloodCells\":7000,\"hematocrit\":42}"
echo.
echo.

echo 3. Testing Live Metrics...
curl -X GET "%BASE_URL%/live-metrics" -H "Content-Type: application/json"
echo.
echo.

echo 4. Testing Recent Predictions...
curl -X GET "%BASE_URL%/recent-predictions?limit=5" -H "Content-Type: application/json"
echo.
echo.

echo 5. Testing Disease Distribution...
curl -X GET "%BASE_URL%/disease-distribution" -H "Content-Type: application/json"
echo.
echo.

echo 6. Testing Statistics...
curl -X GET "%BASE_URL%/stats" -H "Content-Type: application/json"
echo.
echo.

echo 7. Testing Chatbot Session Creation...
echo Creating session and saving to temp file...
curl -X POST "%BASE_URL%/chatbot/session" -H "Content-Type: application/json" > session_temp.json
type session_temp.json
echo.
echo.

echo 8. Testing Chatbot Message (Note: You'll need to manually extract sessionId from above)...
echo Please run this manually with actual sessionId:
echo curl -X POST "%BASE_URL%/chatbot/message" -H "Content-Type: application/json" -d "{\"sessionId\":\"YOUR_SESSION_ID\",\"message\":\"What are the symptoms of diabetes?\"}"
echo.
echo.

echo 9. Testing Chat History (Note: You'll need to manually extract sessionId from above)...
echo Please run this manually with actual sessionId:
echo curl -X GET "%BASE_URL%/chatbot/history?sessionId=YOUR_SESSION_ID" -H "Content-Type: application/json"
echo.
echo.

echo API Testing Complete!
echo.
echo Note: For chatbot tests, extract the sessionId from the session creation response above
echo and replace YOUR_SESSION_ID in the commands.
del session_temp.json 2>nul
pause
