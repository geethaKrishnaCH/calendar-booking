### Steps to setup local development server

### Clone the project

```
git clone https://github.com/geethaKrishnaCH/calendar-booking.git
git checkout dev
```

### Backend

#### Prerequisites

- Docker & docker-compose
- Node.js v16+

#### Steps

```
cd backend
# create a .env file in backend/ folder and copy the below configuration
docker-compose up -d
npm i
npm start
```

```
-- sample .env file contents
PORT=8080
MONGO_URL=mongodb://{username}:{password}@localhost:27017/bookingDB?authSource=admin
JWT_ACCESS_SECRET=SECRET
JWT_REFRESH_SECRET=SECRET
SECRET_KEY=SECRET
```

> **Note**: You need to change the username and password in MONGO_URL accornding to what you used in docker-compose.yaml file. You are free to change it in docker-compose.yaml file and use the same in the url. (refer MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD in environment section)

### Frontend

#### Prerequisites

- Node.js v16+

#### Steps

```
cd frontend
npm i
npm run dev
```

> **Note**: depending on the PORT you are serving your backend, you need to change the axios configuration. In our case backend server is available at http://localhost:8080, so apiClient configuration in <code>src/apis/config/axiosConfig.js</code> file will look like below

```
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});
```
