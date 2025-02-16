# PhishShield Application

This is the PhishShield application, a multi-service application using Docker and Docker Compose.

## Prerequisites

1. **Docker and Docker Compose:**
    - Make sure you have Docker and Docker Compose installed on your machine. You can download them from [Docker's official website](https://www.docker.com/get-started).

2. **Clone Repository:**
    - Clone this repository to your local machine:

      ```bash
      git clone https://github.com/akvasniuk/PhishShield.git
      cd PhishShield
      ```

3. **Download files into the phishshield-ml folder:**
   - Link to files:

      ```files
     https://drive.google.com/drive/folders/17ypyaLJTHWZesOYeVrHcBPdyNpq7m7k9?usp=drive_link
     ```

4. **Environment Variables:**
    - Link to .env files:

      ```env
      https://drive.google.com/drive/folders/1FmXvDFEmTtyZBk3o0Uk7NWRA-f4sD2BF?usp=drive_link
      ```

## Running Docker with Docker Compose

### Step 1: Navigate to Project Directory

```bash
cd PhishShield
```

### Step 2: Build Docker Images

```bash
docker-compose build
```

### Step 3:  Run Docker Containers

```bash
docker-compose up -d
```

### Step 4: Access Services

```urls
    Backend: http://localhost:3005
    MongoDB: Accessible through the configured port (default: 27017)
    ML: http://localhost:8000
    UI: http://localhost:3000
```

### Step 5: Stop Docker Containers

```bash
docker-compose down
```