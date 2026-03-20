#!/bin/bash
API_URL="http://localhost:3000"

echo "1. Logging in..."
LOGIN_RES=$(curl -s -X POST $API_URL/users/login -H "Content-Type: application/json" -d '{
    "email": "jwtuser@example.com",
    "password": "password123"
}')
echo "Login Response: $LOGIN_RES"
TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

if [ -z "$TOKEN" ]; then
    echo "Failed to get token, skipping authenticated request."
    exit 1
fi

echo "2. Accessing Protected Route (With Token)..."
curl -s -X GET $API_URL/users -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Optional: You could check the DB here if you had a CLI for it, but for now we rely on the app working.
# If the previous step worked, it means the token was found in the DB.
