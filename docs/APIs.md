# Authentication APIs

## Sign Up

* **Method:** `POST`
* **Endpoint:** `/api/auth/signup`
* **Request Body:**
    ```json
    {
      "fullName": "Aakash",
      "email": "aakashTeja@gmail.com",
      "password": 12345678,
      "role": "quality-assurance" | "candidate", // Role must be exactly "Quality-Assurance" or "Candidate"
      "languages": ["ENGLISH", "HINDI","MARATHI", "GUJRATI"]
    }
    ```
* **Response Body (Success - HTTP 201):**
    ```json
    {
      "message": "User created successfully"
    }
    ```

## Login

* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Request Body:**
    ```json
    {
      "email": "aakashTeja@gmail.com",
      "password": 12345678
    }
    ```
* **Response Body (Success - HTTP 200):**
    ```json
        {
      "message": "Login successful",
      "user": {
        "fullName": "Aakash",
        "email": "aakashteja@gmail.com",
        "role": "quality-assurance",
        "isBlocked": false,
        "languages": [
          "ENGLISH",
          "HINDI",
          "MARATHI",
          "GUJRATI"
        ]
      }
    }
    ```