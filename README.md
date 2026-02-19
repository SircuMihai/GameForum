# GameForum
Repositoriu pentru practica la USM

API-urile le gasiti la: C:\Users\mihai\IdeaProjects\GameForum\forum\src\backend\java\com\forum\controller

## Pornire pentru utilizarea finala (recomandat)

Aceasta metoda este recomandata pentru utilizarea aplicatiei (cat mai aproape de productie).

Prerechizite:

- **Docker Desktop** (pornit)

Din radacina proiectului (`GameForum`) ruleaza:

```powershell
docker compose up -d --build
```

Aplicatia va porni:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **DB (Postgres)**: intern (nu e expus pe host)

Oprire:

```powershell
docker compose down
```

Loguri (debug):

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Reset complet DB (sterge volumul):

```powershell
docker compose down -v
```

### Date initiale (seed DB)

La pornirea backend-ului, datele initiale sunt inserate automat (idempotent) din `forum/src/main/resources/db/seed`.

## Rulare (Windows) - pentru dezvoltare/testare functionalitati

### Prerechizite

- **Docker Desktop** (pornit)
- **Node.js + npm**
- **Java 17 JDK** (nu JRE)

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

- **DB (Postgres)**: intern (nu e expus pe host)
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

## Minikube/Kubernetes (prod-like)

Prerechizite:

- **kubectl**
- **minikube**

### Pornire (Ingress - recomandat)

1) Porneste minikube si activeaza Ingress:

```powershell
minikube start
minikube addons enable ingress
```

2) Build imaginile direct in minikube (astfel nu ai nevoie de registry):

```powershell
minikube image build -t gameforum-backend:latest -f forum/Dockerfile forum
minikube image build -t gameforum-frontend:latest -f forum/src/frontend/GameForum-master/Dockerfile forum/src/frontend/GameForum-master
```

3) Aplica manifestele:

```powershell
kubectl apply -f k8s/
```

4) Mapare domeniu local (Windows):

- afla IP-ul:

```powershell
minikube ip
```

- adauga in `C:\Windows\System32\drivers\etc\hosts`:

```
<MINIKUBE_IP> gameforum.local
```

5) Acces:

- `http://gameforum.local`

### Pornire (NodePort - alternativa)

Dupa `kubectl apply -f k8s/`:

```powershell
minikube ip
```

- **Frontend**: `http://<MINIKUBE_IP>:30080`
- **Backend**: `http://<MINIKUBE_IP>:30081`

### Debug / troubleshooting

```powershell
kubectl get pods
kubectl get svc
kubectl get ingress
kubectl describe ingress gameforum
kubectl logs -l app=backend --tail=200
kubectl logs -l app=db --tail=200
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
- **Request Body**: `UserRequest` (`userEmail`, `password`, `nickname`, optional `avatar`)
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

Nota: endpoint-ul necesita rol **ADMIN**.

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

Nota: poti modifica doar propriul utilizator.

#### **PUT /api/user/{id}/avatar**
- **Descriere**: Seteaza/actualizeaza avatarul utilizatorului (poza)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `SetAvatarRequest` (`avatar` = Base64 sau data URL `data:image/...;base64,...`)
- **Response**: `UserResponse` actualizat (campul `avatar` este Base64 fara prefix)
- **Status**: 200 OK, 401 Unauthorized, 403 Forbidden

Nota: poti modifica doar propriul utilizator.

#### **POST /api/user**
- **Descriere**: Creează un utilizator nou
- **Request Body**: `UserRequest`
- **Response**: `UserResponse`
- **Status**: 201 Created, 400 Bad Request

Nota: endpoint-ul necesita rol **ADMIN**. Pentru signup normal foloseste `POST /api/auth/register`.

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

#### **PUT /api/subject/{id}/photo**
- **Descriere**: Seteaza/actualizeaza poza subiectului
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `SetSubjectPhotoRequest` (`subjectPhoto` = Base64 sau data URL `data:image/...;base64,...`)
- **Response**: `SubjectResponse` actualizat (campul `subjectPhoto` este Base64 fara prefix)
- **Status**: 200 OK, 401 Unauthorized, 403 Forbidden

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

Nota imagini: backend-ul returneaza imaginile ca Base64 (fara prefix). Pe frontend trebuie normalizat ca `data:image/png;base64,<base64>`.

