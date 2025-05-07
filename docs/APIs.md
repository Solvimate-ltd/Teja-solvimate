# **Authentication APIs**

## **Sign Up**

* **Method:** `POST`
* **Endpoint:** `/api/auth/signup`

### **Request Body**

```json
{
  "fullName": "Aakash",
  "email": "aakashTeja@gmail.com",
  "password": 12345678,
  "role": "quality-assurance" | "candidate", 
  // Role must be exactly "quality-assurance" or "candidate"
  "languages": [
    "6818c135515bec4eed672bf1",
    "6818c149515bec4eed672bf2",
    "6818c15b515bec4eed672bf3",
    "6818c188515bec4eed672bf4"
  ]
}
```

✅ `languages` is an array of **Language Document IDs**.

---

### **Response Body (Success — HTTP 201)**

```json
{
  "message": "User created successfully"
}
```

---

## **Login**

* **Method:** `POST`
* **Endpoint:** `/api/auth/login`

### **Request Body**

```json
{
  "email": "aakashTeja@gmail.com",
  "password": 12345678
}
```

---

### **Response Body (Success — HTTP 200)**

```json
{
  "message": "Login successful",
  "user": {
    "fullName": "Aakash",
    "email": "aakashTeja@gmail.com",
    "role": "quality-assurance",
    "isBlocked": false
  }
}
```

---

## **Fetch Languages**

* **Method:** `GET`
* **Endpoint:** `/api/language`

---

### **Request Body**

*No request body required.*

---

### **Response Body (Success — HTTP 200)**

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

---

## **Add Language**

* **ADMIN ONLY**
* **Method:** `POST`
* **Endpoint:** `/api/language`

### **Request Body**

```json
{
  "language": "Hindi"
}
```

---

### **Response Body (Success — HTTP 200)**

```json
{
  "message": "Language already exists"
}
```

---

## **Employees related API**

### **Candidate API**
* **ADMIN ONLY**
* **Method:** `GET`
* **Endpoint:** `/api/employee/candidate`

---

#### **Request Body**

NO REQUEST BODY

---

#### **Response Body (Success — HTTP 200)**

```json
{
    "message": "List of Candidates",
    "candidates": [
        {
            "_id": "681af53b84c72b80333c8df8",
            "fullName": "Aakash Tamboli",
            "email": "aakash@teja.com",
            "password": "12345678",
            "role": "candidate",
            "isBlocked": false,
            "languages": [
                {
                    "_id": "6819e507a254dcd911eb0797",
                    "language": "ENGLISH"
                },
                {
                    "_id": "6819e556a254dcd911eb07a2",
                    "language": "HINDI"
                },
                {
                    "_id": "6819ff71630a7f816a6acb7e",
                    "language": "MARATHI"
                }
            ]
        },
        {
            "_id": "681af56c84c72b80333c8dfd",
            "fullName": "Gautam Updahyay",
            "email": "gautam@teja.com",
            "password": "12345678",
            "role": "candidate",
            "isBlocked": false,
            "languages": [
                {
                    "_id": "6819e507a254dcd911eb0797",
                    "language": "ENGLISH"
                },
                {
                    "_id": "6819e556a254dcd911eb07a2",
                    "language": "HINDI"
                }
            ]
        }
    ]
}
```


### **QA API**

* **ADMIN ONLY**
* **Method:** `GET`
* **Endpoint:** `/api/employee/quality-assurance`

---

### **Request Body**

NO REQUEST BODY

---

### **Response Body (Success — HTTP 200)**

```json
{
    "message": "List of quality_assurances",
    "quality_assurances": [
        {
            "_id": "681afb4660c0547104fe252b",
            "fullName": "Aakash Tamboli",
            "email": "aakashqa@teja.com",
            "password": "12345678",
            "role": "quality-assurance",
            "isBlocked": false,
            "languages": [
                {
                    "_id": "6819e507a254dcd911eb0797",
                    "language": "ENGLISH",
                    "__v": 0
                },
                {
                    "_id": "6819e556a254dcd911eb07a2",
                    "language": "HINDI",
                    "__v": 0
                }
            ],
            "__v": 0
        },
        {
            "_id": "681afb6160c0547104fe2530",
            "fullName": "Gautam Updahyay",
            "email": "gautamqa@teja.com",
            "password": "12345678",
            "role": "quality-assurance",
            "isBlocked": false,
            "languages": [
                {
                    "_id": "6819ff71630a7f816a6acb7e",
                    "language": "MARATHI",
                    "__v": 0
                },
                {
                    "_id": "6819e556a254dcd911eb07a2",
                    "language": "HINDI",
                    "__v": 0
                },
                {
                    "_id": "6819e507a254dcd911eb0797",
                    "language": "ENGLISH",
                    "__v": 0
                }
            ],
            "__v": 0
        }
    ]
}
```

---

### **toggle-blocked-status**

* **ADMIN ONLY**
* **Method:** `PATCH`
* **Endpoint:** `/api/employee/toggle-blocked-status/:employeeId`

---

### **Request Body**

NO REQUEST BODY

---

### **Response Body (Success — HTTP 200)**

NO RESPONSE BODY

---


### **Delete Employee**

* **ADMIN ONLY**
* **Method:** `DELETE`
* **Endpoint:** `/api/employee/delete/:employeeId`

---

### **Request Body**

NO REQUEST BODY

---

### **Response Body (Success — HTTP 200)**

```json
{
    "message": "Employee deleted successfully",
    "employee": {
        "_id": "681afb6160c0547104fe2530",
        "fullName": "Gautam Updahyay",
        "email": "gautamqa@teja.com",
        "password": "12345678",
        "role": "quality-assurance",
        "isBlocked": false,
        "languages": [
            "6819ff71630a7f816a6acb7e",
            "6819e556a254dcd911eb07a2",
            "6819e507a254dcd911eb0797"
        ],
        "__v": 0
    }
}
```
