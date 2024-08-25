Intento de clon de Taringa! hecho con [Next.js](https://nextjs.org/)

https://taringa-clone.vercel.app/

## Requisitos Previos

Asegúrate de tener los siguientes requisitos antes de comenzar:

- Node.js
- MongoDB
- Firebase Storage

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Augusto-Fernandez/clon-taringa.git
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```


## Configuración

Crear archivo .env con el siguiente formato:

- DATABASE_URL= Uri de la base de datos Mongo.
- NEXTAUTH_URL="http://localhost:3000"
- NEXTAUTH_SECRET= Secreto para NextAuth

Se creó el archivo .example.env como ejemplo.

Desde Firabase, copiar archivo firebaseConfig y reemplazar el archivo firebaseConfig.ts en:
    
```
    src
    └── app
        └── services
            └── firebaseConfig.ts
```

Ejemplo de formato de firebaseConfig.ts:

```typescript
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: "ejemplo.firebaseapp.com",
  projectId: "ejemplo",
  storageBucket: "ejemplo.appspot.com",
  messagingSenderId: "111111111111",
  appId: "1:111111111111:web:1111111111111111111111"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

## Script

Ejecutar este script para correr el servidor de desarrollo

```bash
npm run dev
```

Acceder a http://localhost:3000/ para ver el resultado

## Deploy en Vercel

Documentación para deploy en Vercel [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## To-Do

- Crear un muro de posteo de imágenes como era el Mi
- Agregar sistema de baneo de usuarios
- Modificar el sistema de moderación para que pueda funcionar con varios administradores
- Agregar sistema de validación de mail y recuperación de contraseña