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

## **Logout**

* **Method:** `POST`
* **Endpoint:** `/api/auth/logout`

### **Request Body**

NO REQUEST BODY

---

### **Response Body (Success — HTTP 200)**

```json
{
    "message": "Logout successful",
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
* **Endpoint:** `/api/employee/common/toggle-blocked-status/:employeeId`

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

### **Assign Task**

* **ADMIN ONLY**
* **Method:** `POST`
* **Endpoint:** `/api/employee/service/translation`

---

**There are two cases**
**Case:1 Task for public**


### **Request Body**

```json
{
    "taskName": "Translate blog post",
        "deadlineDate": "2025-05-15",
        "fromLanguage": "6819e507a254dcd911eb0797",
        "toLanguage": "6819e556a254dcd911eb07a2",
        "mode": "public",
        "qualityAssurance": "681afb4660c0547104fe252b",
        "sentences": [
            "This is a sentence.",
        "This is another sentence."
        ]
}

```

---

### **Response Body (Success — HTTP 200)**

```json
{
    "msg": "Task Assigned",
        "task": {
            "taskName": "Translate blog post",
            "deadlineDate": "2025-05-15T00:00:00.000Z",
            "fromLanguage": "6819e507a254dcd911eb0797",
            "toLanguage": "6819e556a254dcd911eb07a2",
            "mode": "PUBLIC",
            "status": "UNDER CANDIDATE PROGRESSS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli",
                "email": "aakashqa@teja.com",
                "password": "12345678",
                "role": "quality-assurance",
                "isBlocked": false,
                "languages": [
                    "6819e507a254dcd911eb0797",
                "6819e556a254dcd911eb07a2"
                ],
                "__v": 0
            },
            "candidate": null,
            "sentences": [
            {
                "_id": "681c65535a227239c0cfdeb9",
                "sentence": "This is a sentence.",
                "__v": 0
            },
            {
                "_id": "681c65535a227239c0cfdeba",
                "sentence": "This is another sentence.",
                "__v": 0
            }
            ],
            "_id": "681c65535a227239c0cfdebd",
            "createdAt": "2025-05-08T08:03:31.761Z",
            "updatedAt": "2025-05-08T08:03:31.761Z",
            "__v": 0
        }
}

```

---


**Case:2 for assigned to specfic candidate**

### **Request Body**
```json
{
    "taskName": "Translate blog post",
        "deadlineDate": "2025-05-15",
        "fromLanguage": "6819e507a254dcd911eb0797",
        "toLanguage": "6819e556a254dcd911eb07a2",
        "mode": "assigned",
        "qualityAssurance": "681afb4660c0547104fe252b",
        "candidate": "681af53b84c72b80333c8df8",
        "sentences": [
            "This is a sentence.",
        "This is another sentence."
        ]
}
```

---

### **Response Body (Success — HTTP 200)**

```json
{
    "msg": "Task Assigned",
        "task": {
            "taskName": "Translate blog post",
            "deadlineDate": "2025-05-15T00:00:00.000Z",
            "fromLanguage": "6819e507a254dcd911eb0797",
            "toLanguage": "6819e556a254dcd911eb07a2",
            "mode": "ASSIGNED",
            "status": "UNDER CANDIDATE PROGRESSS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli",
                "email": "aakashqa@teja.com",
                "password": "12345678",
                "role": "quality-assurance",
                "isBlocked": false,
                "languages": [
                    "6819e507a254dcd911eb0797",
                "6819e556a254dcd911eb07a2"
                ],
                "__v": 0
            },
            "candidate": {
                "_id": "681af53b84c72b80333c8df8",
                "fullName": "Aakash Tamboli",
                "email": "aakash@teja.com",
                "password": "12345678",
                "role": "candidate",
                "isBlocked": false,
                "languages": [
                    "6819e507a254dcd911eb0797",
                "6819e556a254dcd911eb07a2",
                "6819ff71630a7f816a6acb7e"
                ],
                "__v": 0
            },
            "sentences": [
            {
                "_id": "681c668e5a227239c0cfdec3",
                "sentence": "This is a sentence.",
                "__v": 0
            },
            {
                "_id": "681c668e5a227239c0cfdec4",
                "sentence": "This is another sentence.",
                "__v": 0
            }
            ],
            "_id": "681c668e5a227239c0cfdec6",
            "createdAt": "2025-05-08T08:08:46.830Z",
            "updatedAt": "2025-05-08T08:08:46.830Z",
            "__v": 0
        }
}

```

---

### **Get All Task**

* **ROLE SPECIFIC**
* **Method:** `GET`
* **Endpoint:** `/api/employee/service/translation`

---

### ADMIN

#### **Request Body**

NO REQUEST BODY

---

#### **Response Body**

```json

{
    "msg": "Tasks Fetched",
        "tasks": [
        {
            "_id": "681c65535a227239c0cfdebd",
            "taskName": "Translate blog post",
            "deadlineDate": "2025-05-15T00:00:00.000Z",
            "fromLanguage": {
                "_id": "6819e507a254dcd911eb0797",
                "language": "ENGLISH"
            },
            "toLanguage": {
                "_id": "6819e556a254dcd911eb07a2",
                "language": "HINDI"
            },
            "mode": "PUBLIC",
            "status": "UNDER CANDIDATE PROGRESSS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli"
            },
            "candidate": null,
            "createdAt": "2025-05-08T08:03:31.761Z",
            "updatedAt": "2025-05-08T08:03:31.761Z",
            "__v": 0
        },
        {
            "_id": "681c668e5a227239c0cfdec6",
            "taskName": "Translate blog post",
            "deadlineDate": "2025-05-15T00:00:00.000Z",
            "fromLanguage": {
                "_id": "6819e507a254dcd911eb0797",
                "language": "ENGLISH"
            },
            "toLanguage": {
                "_id": "6819e556a254dcd911eb07a2",
                "language": "HINDI"
            },
            "mode": "ASSIGNED",
            "status": "UNDER CANDIDATE PROGRESSS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli"
            },
            "candidate": {
                "_id": "681af53b84c72b80333c8df8",
                "fullName": "Aakash Tamboli"
            },
            "createdAt": "2025-05-08T08:08:46.830Z",
            "updatedAt": "2025-05-08T08:08:46.830Z",
            "__v": 0
        },
        {
            "_id": "681ed7e12ac970a4dadaefc7",
            "taskName": "Translate blog post - 1",
            "deadlineDate": "2025-05-15T00:00:00.000Z",
            "fromLanguage": {
                "_id": "6819e507a254dcd911eb0797",
                "language": "ENGLISH"
            },
            "toLanguage": {
                "_id": "6819e556a254dcd911eb07a2",
                "language": "HINDI"
            },
            "mode": "ASSIGNED",
            "status": "UNDER CANDIDATE PROGRESS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli"
            },
            "candidate": {
                "_id": "681af53b84c72b80333c8df8",
                "fullName": "Aakash Tamboli"
            },
            "createdAt": "2025-05-10T04:36:49.838Z",
            "updatedAt": "2025-05-10T04:36:49.838Z",
            "__v": 0
        }
    ]
}

```

### CANDIDATE

#### **Request Body**

NO REQUEST BODY

---

#### **Response Body**

```json

{
    "msg": "Tasks Fetched",
        "tasks": [
        {
            "_id": "68202ea0b9761cecd0acf70e",
            "taskName": "Task 1",
            "deadlineDate": "2025-05-18T00:00:00.000Z",
            "fromLanguage": {
                "_id": "6819e507a254dcd911eb0797",
                "language": "ENGLISH"
            },
            "toLanguage": {
                "_id": "6819e556a254dcd911eb07a2",
                "language": "HINDI"
            },
            "mode": "ASSIGNED",
            "status": "UNDER CANDIDATE PROGRESS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli"
            },
            "createdAt": "2025-05-11T04:59:12.454Z",
            "updatedAt": "2025-05-11T04:59:12.454Z",
            "__v": 0
        },
        {
            "_id": "68203a861b70f0763b2e8ac8",
            "taskName": "Task 2",
            "deadlineDate": "2025-05-24T00:00:00.000Z",
            "fromLanguage": {
                "_id": "6819e507a254dcd911eb0797",
                "language": "ENGLISH"
            },
            "toLanguage": {
                "_id": "6819e556a254dcd911eb07a2",
                "language": "HINDI"
            },
            "mode": "ASSIGNED",
            "status": "UNDER CANDIDATE PROGRESS",
            "qualityAssurance": {
                "_id": "681afb4660c0547104fe252b",
                "fullName": "Aakash Tamboli"
            },
            "createdAt": "2025-05-11T05:49:58.841Z",
            "updatedAt": "2025-05-11T05:49:58.841Z",
            "__v": 0
        }
    ]
}


```

---

### **Get All Sentences For Candidate **

* **CANDIDATE ONLY**
* **Method:** `GET`
* **Endpoint:** `/api/employee/candidate/service/translation/:taskId`

---

#### **Request Body**

NO REQUEST BODY

---

#### **Response Body**

##### CASE 1 NO REMARKS FRESHLY SENTENCE ASSIGNED

```json

{
    "message": "Task With sentences fetched successfully.",
        "task": {
            "taskName": "Task 1",
            "deadLine": "2025-05-18T00:00:00.000Z",
            "fromLanguage": "ENGLISH",
            "toLanguage": "HINDI",
            "sentences": [
            {
                "_id": "68218ffc4bc62baeef0a30a8",
                "sentence": "s1",
                "review": null
            },
            {
                "_id": "68218ffc4bc62baeef0a30a9",
                "sentence": "s2",
                "review": null
            },
            {
                "_id": "68218ffc4bc62baeef0a30aa",
                "sentence": "s3",
                "review": null
            }
            ]
        }
}

##### CASE 2 REMARKS PASSED BY QA

```json

{
    "message": "Task With sentences fetched successfully.",
        "task": {
            "taskName": "Task 1",
            "deadLine": "2025-05-18T00:00:00.000Z",
            "fromLanguage": "ENGLISH",
            "toLanguage": "HINDI",
            "sentences": [
            {
                "_id": "68218ffc4bc62baeef0a30a8",
                "sentence": "",
                "review": {
                    "candidateSentence": "S1",
                    "remark": "Write properly"
                }
            },
            {
                "_id": "68218ffc4bc62baeef0a30a9",
                "sentence": "",
                "review": {
                    "candidateSentence": "S2",
                    "remark": "Write properly"
                }

            },
            {
                "_id": "68218ffc4bc62baeef0a30aa",
                "sentence": "",
                "review": {
                    "candidateSentence": "s3",
                    "remark": "Write properly"
                }
            }
            ]
        }
}



```

---

### **Submit Sentence By Candidate**

* **CANDIDATE ONLY**
* **Method:** `PATCH`
* **Endpoint:** `/api/employee/candidate/service/translation`

---

#### **Request Body**

```json
{
    "_id": "68242856687c3d39dda14f0b",
        "translatedSentence": "Don Done"
}
```

---

#### **Response Body**

```json
{
    "message": "Sentence updated successfully."
}
```

---

### **Get All Sentence For Quality Assurance**

* **Quality Assurance ONLY**
* **Method:** `GET`
* **Endpoint:** `/api/employee/quality-assurance/service/translation/:taskId`

---

#### **Request Body**

NO REQUEST BODY

---

#### **Response Body**

```json
{
    "message": "Task with sentences fetched successfully.",
        "task": {
            "taskName": "Task 1",
            "deadLine": "2025-05-24T00:00:00.000Z",
            "fromLanguage": {
                "language": "ENGLISH"
            },
            "toLanguage": {
                "language": "HINDI"
            },
            "sentences": [
            {
                "_id": "6824839ac015ee78fa98c5c4",
                "sentence": "S1",
                "translatedSentence": "T1"
            },
            {
                "_id": "6824839ac015ee78fa98c5c5",
                "sentence": "S2",
                "translatedSentence": "T2"
            },
            {
                "_id": "6824839ac015ee78fa98c5c6",
                "sentence": "S3",
                "translatedSentence": "T3"
            },
            {
                "_id": "6824839ac015ee78fa98c5c7",
                "sentence": "S4",
                "translatedSentence": "T4"
            }
            ]
        }
}
```

---

### **Verified Sentences By QA**

* **QUALITY ASSURANCE ONLY**
* **Method:** `PATCH`
* **Endpoint:** `/api/employee/qualityAssurance/service/translation`

---

#### **Request Body**

```json
{
verifiedSentences: [{_id, finalTranslatedSentence}...], 
                       reworkedSentences: [{_id: dsasadsdadsa, remark: "MSG"},...], 
                       deletedSentences: [_id,_id,...]
}
```

---

#### **Response Body**

```json
{
    "message": "Review process completed successfully."
}
```

---


### **Assign Task**

* **ADMIN ONLY**
* **Method:** `POST`
* **Endpoint:** `/api/employee/service/translation/extract-data-from-sheet`
* **Special Things:** `In project folder, create /public/uploads for storing temporary xlsx files On Linux Grant permission

MAKE SURE IT HAS READ PERMISSION TO SERVER
chmod 755 /home/aakash/projects/Teja-solvimate/public/uploads
chmod 644 /home/aakash/projects/Teja-solvimate/public/uploads/*
                                                                `
                                                                ---

### **Request Body**

```json
{
"sheetName": "Sheet1",
"columnName": "B"
"file": "In PAY LOAD"
}

```

---

### **Response Body (Success — HTTP 200)**

```json
{
sheetName: ____,
header: ____, // column Name
data: ["Sentences","Sentences"]
}

```

---


