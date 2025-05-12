
# 🧠 Proyecto tipo Traello con NestJS (Backend) + React (Frontend)

Este proyecto es una aplicación tipo Trello con funcionalidades en tiempo real. Utiliza:

- ⚙️ **Backend:** NestJS + MongoDB + WebSockets (Socket.IO)
- 💻 **Frontend:** React + DnD Kit + Axios + Socket.IO Client

---
## Datos para Loguearse

- email: 'nassa@gmail.com', password: 'admin123'
- email: 'user@gmail.com', password: 'user123'
---

## 📁 Estructura del Proyecto

```
/frontend   → Aplicación React (cliente)
/backend    → API NestJS + WebSockets (servidor)
```

---

## 🚀 Requisitos previos

Asegurate de tener instalado:

- Node.js >= 18
- npm >= 9 (o yarn)

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/nassahel/traello-front
git clone https://github.com/nassahel/traello-back
```

### 2. Instalar dependencias

#### Backend

```bash
cd traello-front
npm install
```

#### Frontend

```bash
cd traello-back
npm install
```

---

## ⚙️ Configuración

### Backend

No se necesita archivos .env

### Frontend

Modificar la URL del backend si es necesario en tus llamadas con Axios (`http://localhost:3000`).

---

## ▶️ Ejecución

### Backend

```bash
cd backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto configurado por Vite).

---

## 🔐 Autenticación

- Los usuarios están definidos en un array del backend.
- Para iniciar sesión, usar el componente `LoginBtn`.
- Se genera un JWT que se guarda en `localStorage`.
- El frontend muestra el nombre de usuario usando el email.

---

## ♻️ Funcionalidades

- ✅ Login y logout con token JWT
- ✅ Crear, mover y eliminar tareas
- ✅ Crear, mover y eliminar columnas
- ✅ Drag and drop fluido
- ✅ Sincronización en tiempo real con Socket.IO

---

## 📦 Tecnologías utilizadas

### Backend

- NestJS
- Mongoose
- Socket.IO
- JWT

### Frontend

- React + Vite
- @dnd-kit
- Axios
- Socket.IO Client
- TailwindCSS
- React Icons

---

## ✍️ Autor

Hecho por Nassahel Elias ✨

---

## 🧪 Importante!!!!

Ciertas fncionalidades no se realizaron por falta de tiempo. Considerar que fue hcho en 1 solo dia.


