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
      "languages": ["6818c135515bec4eed672bf1", "6818c149515bec4eed672bf2", "6818c15b515bec4eed672bf3", "6818c188515bec4eed672bf4" ]// ["LANGUAGE-DOCUMENT-ID", "LANGUAGE-DOCUMENT-ID", ....] 
    }
    ```
* **Response Body (Success - HTTP 201):**
    ```json
    {
      "message": "User created successfully"
    }
    ```

---

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

---

## Language

* **Method:** `GET`
* **Endpoint:** `/api/language`
* **Request Body:**
    
    NO Request Body
    
* **Response Body (Success - HTTP 200):**
    ```json
        {
          "message": "Languages fetched",
          "languages": [
            {
              "_id": "6818c135515bec4eed672bf1",
              "name": "HINDI"
            },
            {
              "_id": "6818c149515bec4eed672bf2",
              "name": "ENGLISH"
            },
            {
              "_id": "6818c15b515bec4eed672bf3",
              "name": "MARATHI"
            },
            {
              "_id": "6818c188515bec4eed672bf4",
              "name": "GUJRATI"
            }
          ]
    }
    ```
