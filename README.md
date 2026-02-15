# GameForum
Repositoriu pentru practica la USM

API-urile le gasiti la: C:\Users\mihai\IdeaProjects\GameForum\forum\src\backend\java\com\forum\controller

## Rulare (Windows)

### Prerechizite

- **Docker Desktop** (pornit)
- **Node.js + npm**
- **Java 17 JDK** (nu JRE)

### Import date initiale (DB)

La prima pornire a containerului Postgres, scripturile SQL din `forum/import` sunt rulate automat (montate in `/docker-entrypoint-initdb.d`).

Cand rulezi `node forum\start-dev.js`, scripturile SQL din `forum/import` sunt incercate automat si dupa ce DB-ul este up.

Daca ai pornit deja DB-ul inainte si vrei sa **reimporti** datele, trebuie sa stergi volumul / datele persistate si sa pornesti din nou DB-ul.

Din folderul `forum` poti face reset la DB astfel:

```powershell
docker compose -f compose.yaml down -v
docker compose -f compose.yaml up -d --force-recreate
```

Verificare rapida (tot din `forum`):

```powershell
docker compose -f compose.yaml exec -T ForumDataBase psql -U admin -d ForumDataBase -c "select count(*) from achievements;"
docker compose -f compose.yaml exec -T ForumDataBase psql -U admin -d ForumDataBase -c "select count(*) from users;"
```

### Pornire automata (DB + Backend + Frontend)

Din radacina proiectului (`GameForum`) ruleaza:

```powershell
node forum\start-dev.js
```

Daca nu ai Java 17 JDK instalat, poti incerca instalarea automata (Windows + winget):

```powershell
node forum\start-dev.js --install-jdk
```

Scriptul va:

- porni/crea baza de date din `forum/compose.yaml`
- porni backend-ul Spring Boot (Maven Wrapper)
- porni frontend-ul (Vite)

### Porturi folosite

- **DB (Postgres)**: `localhost:6000`
- **Backend**: `http://localhost:8080`
- **Frontend (Vite)**: afisat in consola (de obicei `http://localhost:5173`)

### Pornire manuala (alternativa)

1) **DB** (din folderul `forum`):

```powershell
docker compose -f compose.yaml up -d
```

2) **Backend** (din folderul `forum`):

```powershell
mvnw.cmd spring-boot:run
```

3) **Frontend** (din `forum\src\frontend\GameForum-master`):

```powershell
npm install
npm run dev
```

## Troubleshooting

### Eroare Maven: "No compiler is provided in this environment"

Inseamna ca rulezi cu **JRE** sau nu ai `javac` in PATH.

- Instaleaza **Java 17 JDK**
- Seteaza variabila **JAVA_HOME** catre folderul JDK (ex: `C:\Program Files\Java\jdk-17`)
- Adauga in **PATH**: `%JAVA_HOME%\bin`

Verificare (in terminal nou):

```powershell
java -version
javac -version
```

## API Documentation

### Authentication Endpoints (`/api/auth`)

#### **POST /api/auth/register**
- **Descriere**: Înregistrează un utilizator nou
- **Request Body**: `UserRequest` (email, password, username, etc.)
- **Response**: `UserResponse` cu datele utilizatorului creat
- **Status**: 201 Created, 400 Bad Request

#### **POST /api/auth/login**
- **Descriere**: Autentifică un utilizator și returnează token JWT
- **Request Body**: `LoginRequest` (email, password)
- **Response**: `LoginResponse` (success: boolean, token: string)
- **Status**: 200 OK, 401 Unauthorized

#### **GET /api/auth/me**
- **Descriere**: Returnează datele utilizatorului autentificat
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `UserResponse` cu datele utilizatorului curent
- **Status**: 200 OK, 401 Unauthorized

---

### User Management (`/api/user`)

#### **GET /api/user**
- **Descriere**: Returnează lista tuturor utilizatorilor
- **Response**: `List<UserResponse>`
- **Status**: 200 OK

#### **GET /api/user/{id}**
- **Descriere**: Returnează detaliile unui utilizator specific
- **Response**: `UserResponse`
- **Status**: 200 OK, 404 Not Found

#### **GET /api/user/{id}/titles**
- **Descriere**: Returnează titlurile deblocate de un utilizator
- **Response**: `List<TitleOptionResponse>` (achievementId, achievementName)
- **Status**: 200 OK

#### **PUT /api/user/{id}/title**
- **Descriere**: Setează titlul selectat de un utilizator
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `SetTitleRequest` (achievementId)
- **Response**: `UserResponse` actualizat
- **Status**: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### **POST /api/user**
- **Descriere**: Creează un utilizator nou
- **Request Body**: `UserRequest`
- **Response**: `UserResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/user/{id}**
- **Descriere**: Actualizează datele unui utilizator
- **Request Body**: `UserRequest`
- **Response**: `UserResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/user/{id}**
- **Descriere**: Șterge un utilizator
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### Category Management (`/api/category`)

#### **GET /api/category**
- **Descriere**: Returnează lista tuturor categoriilor
- **Response**: `List<CategoryResponse>`
- **Status**: 200 OK

#### **GET /api/category/{id}**
- **Descriere**: Returnează detaliile unei categorii
- **Response**: `CategoryResponse`
- **Status**: 200 OK, 404 Not Found

#### **POST /api/category**
- **Descriere**: Creează o categorie nouă
- **Request Body**: `CategoryRequest`
- **Response**: `CategoryResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/category/{id}**
- **Descriere**: Actualizează o categorie
- **Request Body**: `CategoryRequest`
- **Response**: `CategoryResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/category/{id}**
- **Descriere**: Șterge o categorie
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### Subject Management (`/api/subject`)

#### **GET /api/subject**
- **Descriere**: Returnează lista tuturor subiectelor
- **Response**: `List<SubjectResponse>`
- **Status**: 200 OK

#### **GET /api/subject?categoryId={categoryId}**
- **Descriere**: Returnează subiectele dintr-o categorie specifică
- **Query Param**: `categoryId` (Integer)
- **Response**: `List<SubjectResponse>`
- **Status**: 200 OK

#### **GET /api/subject/{id}**
- **Descriere**: Returnează detaliile unui subiect
- **Response**: `SubjectResponse`
- **Status**: 200 OK, 404 Not Found

#### **POST /api/subject**
- **Descriere**: Creează un subiect nou
- **Request Body**: `SubjectRequest`
- **Response**: `SubjectResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/subject/{id}**
- **Descriere**: Actualizează un subiect
- **Request Body**: `SubjectRequest`
- **Response**: `SubjectResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/subject/{id}**
- **Descriere**: Șterge un subiect
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### Message Management (`/api/message`)

#### **GET /api/message**
- **Descriere**: Returnează lista tuturor mesajelor
- **Response**: `List<MessageResponse>`
- **Status**: 200 OK

#### **GET /api/message?subjectId={subjectId}**
- **Descriere**: Returnează mesajele dintr-un subiect specific
- **Query Param**: `subjectId` (Integer)
- **Response**: `List<MessageResponse>`
- **Status**: 200 OK

#### **GET /api/message/{id}**
- **Descriere**: Returnează detaliile unui mesaj
- **Response**: `MessageResponse`
- **Status**: 200 OK, 404 Not Found

#### **POST /api/message**
- **Descriere**: Creează un mesaj nou
- **Request Body**: `MessageRequest`
- **Response**: `MessageResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/message/{id}**
- **Descriere**: Actualizează un mesaj
- **Request Body**: `MessageRequest`
- **Response**: `MessageResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/message/{id}**
- **Descriere**: Șterge un mesaj
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### Achievement Management (`/api/achievement`)

#### **GET /api/achievement**
- **Descriere**: Returnează lista tuturor realizărilor (achievements)
- **Response**: `List<AchievementResponse>`
- **Status**: 200 OK

#### **GET /api/achievement/{id}**
- **Descriere**: Returnează detaliile unei realizări
- **Response**: `AchievementResponse`
- **Status**: 200 OK, 404 Not Found

#### **POST /api/achievement**
- **Descriere**: Creează o realizare nouă
- **Request Body**: `AchievementRequest`
- **Response**: `AchievementResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/achievement/{id}**
- **Descriere**: Actualizează o realizare
- **Request Body**: `AchievementRequest`
- **Response**: `AchievementResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/achievement/{id}**
- **Descriere**: Șterge o realizare
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### User Achievements (`/api/achievementsusers`)

#### **GET /api/achievementsusers**
- **Descriere**: Returnează lista tuturor legăturilor utilizator-realizare
- **Response**: `List<AchievementsUsersResponse>`
- **Status**: 200 OK

#### **GET /api/achievementsusers/{id}**
- **Descriere**: Returnează detaliile unei legături utilizator-realizare
- **Response**: `AchievementsUsersResponse`
- **Status**: 200 OK, 404 Not Found

#### **POST /api/achievementsusers**
- **Descriere**: Asociază o realizare unui utilizator
- **Request Body**: `AchievementsUsersRequest`
- **Response**: `AchievementsUsersResponse`
- **Status**: 201 Created, 400 Bad Request

#### **PUT /api/achievementsusers/{id}**
- **Descriere**: Actualizează o asociere utilizator-realizare
- **Request Body**: `AchievementsUsersRequest`
- **Response**: `AchievementsUsersResponse` actualizat
- **Status**: 200 OK, 404 Not Found

#### **DELETE /api/achievementsusers/{id}**
- **Descriere**: Șterge o asociere utilizator-realizare
- **Response**: Void (no content)
- **Status**: 204 No Content, 404 Not Found

---

### Note Generale

- **Base URL**: `http://localhost:8080`
- **Autentificare**: Majoritatea endpoint-urilor necesită header-ul `Authorization: Bearer <token>`
- **Content-Type**: `application/json` pentru toate request-urile POST/PUT
- **Error Handling**: API-ul returnează coduri HTTP standard (400, 401, 403, 404, 500)
- **JWT Token**: Valabil 24 de ore, se obține la login

