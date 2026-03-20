#!/bin/bash
API_URL="http://localhost:3000"

echo "1. Creating User..."
curl -s -X POST $API_URL/users -H "Content-Type: application/json" -d '{
    "username": "jwtuser",
    "email": "jwtuser@example.com",
    "password": "password123",
    "role_id": 1
}'
echo -e "\n"

echo "2. Logging in..."
LOGIN_RES=$(curl -s -X POST $API_URL/users/login -H "Content-Type: application/json" -d '{
    "email": "jwtuser@example.com",
    "password": "password123"
}')
echo "Login Response: $LOGIN_RES"
TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

echo "3. Accessing Protected Route (No Token)..."
curl -s -X GET $API_URL/users
echo -e "\n"

if [ -z "$TOKEN" ]; then
    echo "Failed to get token, skipping authenticated request."
else
    echo "4. Accessing Protected Route (With Token)..."
    curl -s -X GET $API_URL/users -H "Authorization: Bearer $TOKEN"
    echo -e "\n"
fi
