# Geniality - Experiencias Interactivas para Eventos

Sitio web para Geniality, una empresa especializada en soluciones tecnológicas gamificadas para venues durante eventos deportivos, especialmente el Mundial 2026.

## 🌐 Páginas del Sitio

- **Inicio** (`/`) - Página principal con hero, pitch, experiencias, planes y CTA
- **El Reto** (`/reto`) - Información sobre el desafío actual de los venues
- **El Ecosistema** (`/ecosistema`) - Arquitectura y componentes de la plataforma
- **Experiencias** (`/experiencias`) - Las 5 experiencias interactivas principales
- **Admin** (`/admin`) - Panel interno para ver clientes y crear experiencias
- **Planes de Inversión** (`/planes`) - Modelos de inversión y precios
- **Hablemos** (`/hablemos`) - Información de contacto y formulario

## 🎨 Características del Diseño

- **Tema Oscuro** con acentos neón (cian y magenta)
- **Animaciones Dinámicas** inspiradas en gráficos deportivos
- **Responsive Design** para todos los dispositivos
- **Navegación Sticky** siempre visible
- **Efectos Visuales** con gradientes y transparencias

## 🛠️ Tecnologías Utilizadas

- **Astro** - Framework web moderno
- **Firebase Cloud Firestore** - Almacenamiento de leads y experiencias
- **Firebase Storage** - Carga de imágenes para experiencias desde admin
- **CSS3** - Estilos con gradientes, animaciones y efectos visuales
- **Inter Font** - Tipografía moderna de Google Fonts

## 🔥 Integración Firebase (Firestore + Storage)

Se agregó integración para:

- Guardar formularios de contacto en **Cloud Firestore** (`leads/{autoId}`)
- Crear experiencias desde `/admin` en **Cloud Firestore** (`experiences/{uid}`)
- Subir imágenes de experiencias a **Storage** (`/experiences/{uid}/...`)
- Mostrar experiencias en el catálogo de forma dinámica (imagen, título y descripción)

### Variables de entorno

Configura estas variables en `.env`:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_DATABASE_URL`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `PUBLIC_FIREBASE_MEASUREMENT_ID` (opcional)

### Archivos agregados

- `src/lib/firebase/client.ts` → Inicializa Firebase App
- `src/lib/firebase/database.ts` → Crea leads, lista clientes y gestiona experiencias
- `src/lib/firebase/storage.ts` → Sube imagen de experiencia y retorna URL pública
- `src/pages/admin.astro` → Sidebar (Clientes / Crear experiencia)
- `src/components/Experiences.astro` → Renderiza catálogo dinámico

### Reglas recomendadas (resumen)

- Permitir escritura en `/leads` con validaciones mínimas de esquema
- Limitar tipo/tamaño de archivos en Storage Rules
- Restringir acceso de lectura/escritura de `/experiences` según tus necesidades operativas

### Reglas ejemplo (Realtime Database)

Si estás creando experiencias desde el frontend en `/admin` sin autenticación, necesitas permitir escritura explícita en `experiences`.

```json
{
	"rules": {
		"leads": {
			".read": true,
			"$leadId": {
				".write": true
			}
		},
		"experiences": {
			".read": true,
			"$uid": {
				".write": true
			}
		}
	}
}
```

También puedes usar el archivo versionado del proyecto:

- `database.rules.json`

> ⚠️ Estas reglas son útiles para pruebas/arranque rápido, pero no son seguras para producción pública. Lo ideal es proteger `/admin` con Auth y restringir `.write` a usuarios autenticados o mover escrituras a un endpoint server-side.

> Nota importante: este proyecto actualmente usa **Cloud Firestore** (`firebase/firestore`) para datos y **Firebase Storage** para imágenes.

### Reglas de Storage para imágenes de experiencias

Se agregó configuración versionada para Storage:

- `storage.rules`
- `firebase.json`

Estas reglas permiten escritura solo en `experiences/{uid}/{fileName}` con validación de tipo de archivo imagen y tamaño máximo de 5MB.

Para publicarlas en Firebase:

- `firebase login`
- `firebase use <tu-proyecto>`
- `firebase deploy --only storage`

> Recomendación producción: mover write a usuarios autenticados admin (`request.auth != null && request.auth.token.admin == true`).

> Importante: usa el **Web SDK config** para frontend; nunca expongas llaves privadas de cuentas de servicio en el cliente.

## 🚀 Comandos

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Previsualiza el build localmente antes de desplegar |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                    |

## 📁 Estructura del Proyecto

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Hero.astro
│   │   ├── Pitch.astro
│   │   ├── Experiences.astro
│   │   ├── Investment.astro
│   │   └── FooterCTA.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── reto.astro
│       ├── ecosistema.astro
│       ├── experiencias.astro
│       ├── planes.astro
│       └── hablemos.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🎯 Experiencias Implementadas

1. **El Menú Dinámico Flash** - QR codes temporales para compras impulsivas
2. **Gritómetro de Dominio** - Competencia de ruido entre grupos
3. **La Ola Digital** - Reto cooperativo con acelerómetros
4. **Precisión Sphera** - Portería digital con sensores
5. **Espejo de Hinchas AR** - Filtros de realidad aumentada

## 📞 Contacto

**Juan López** - CEO  
📧 juan.lopez@geniality.com.co  
📞 +57 300 216 2757
