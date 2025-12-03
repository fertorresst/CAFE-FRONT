# 📚 MiCAFÉ - Sistema de Gestión de Actividades Complementarias

## 🎯 Descripción General

**MiCAFÉ** es un sistema web integral para la gestión de **Actividades Complementarias de Formación Estudiantil** del Instituto Tecnológico Superior de Salamanca. Permite a estudiantes registrar sus actividades extracurriculares y a los administradores validar, aprobar y generar reportes sobre estas actividades.

---

## 🚀 Build Setup

```bash
# Instalar dependencias
$ npm install

# Servidor de desarrollo en localhost:3000
$ npm run dev

# Build de producción y lanzar servidor
$ npm run build
$ npm run start

# Generar proyecto estático
$ npm run generate
```

---

## 🛠️ Stack Tecnológico

- **Framework:** Nuxt.js 2.15.8 (Vue.js 2.7.10)
- **UI Framework:** Vuetify 2.6.10
- **Backend:** Node.js + Express (API REST)
- **Base de datos:** MySQL
- **Estado:** Vuex
- **Autenticación:** JWT (cookies)
- **Puerto Frontend:** localhost:3000
- **Puerto Backend:** localhost:5010

### Dependencias Principales

- **axios** - Peticiones HTTP
- **moment** - Manejo de fechas
- **jspdf + jspdf-autotable** - Generación de PDFs
- **xlsx-js-style** - Generación de Excel
- **file-saver** - Descarga de archivos
- **v-mask** - Máscaras de input

---

## 🎨 Paleta de Colores

```scss
$azul-principal: #07538a    // Azul institucional
$dorado: #a3915f            // Dorado/café
$amarillo: #fed55e          // Amarillo destacado
$naranja: #cd7005           // Naranja acento
$fondo: #f5f5f5            // Gris claro
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
CAFE-FRONT/
├── assets/                    # Recursos estáticos (CSS, SCSS)
│   ├── css/global.css
│   └── variables.scss
├── components/                # Componentes reutilizables
│   ├── activities/           # Componentes de actividades
│   ├── admin/                # Componentes de administradores
│   ├── periods/              # Componentes de periodos
│   ├── shared/               # Componentes compartidos
│   │   └── LegendHelpDialog.vue
│   ├── student/              # Componentes de estudiantes
│   └── ui-alert.vue          # Alerta global
├── layouts/                   # Plantillas de diseño
│   ├── admin.vue             # Layout para administradores
│   ├── student.vue           # Layout para estudiantes
│   ├── empty.vue             # Layout vacío (login)
│   ├── default.vue           # Layout por defecto
│   └── error.vue             # Layout de errores
├── middleware/                # Middlewares de autenticación
│   ├── auth-admin.js         # Protege rutas admin
│   └── auth-student.js       # Protege rutas student
├── pages/                     # Vistas/Rutas de la aplicación
│   ├── admin/                # Vistas de administradores
│   │   ├── login/           # Login admin
│   │   ├── periods/         # Gestión de periodos
│   │   │   └── activities/  # Actividades por periodo
│   │   ├── students/        # Gestión de estudiantes
│   │   ├── admins/          # Gestión de admins
│   │   ├── qr-codes/        # Gestión de códigos QR
│   │   └── profile/         # Perfil admin
│   └── student/              # Vistas de estudiantes
│       ├── login/           # Login/registro estudiante
│       ├── index.vue        # Inicio con QR codes
│       ├── dashboard/       # Mis actividades
│       └── profile/         # Perfil estudiante
├── plugins/                   # Plugins de Vue/Nuxt
│   ├── axios.js              # Configuración de Axios
│   └── v-mask.js             # Máscaras de input
├── static/                    # Archivos estáticos públicos
├── store/                     # Vuex store (estado global)
│   └── index.js
└── nuxt.config.js            # Configuración de Nuxt
```

---

## 👥 Roles y Permisos

### 1. SUPERADMIN (Máximo nivel)
✅ Crear, editar, eliminar periodos  
✅ Crear, editar, eliminar administradores  
✅ Gestionar códigos QR  
✅ Ver todas las actividades  
✅ Gestionar estudiantes  
✅ Generar reportes completos  
✅ Aprobar/rechazar actividades  

### 2. ADMIN (Administrador general)
✅ Crear, editar periodos (no eliminar)  
❌ No puede gestionar administradores  
❌ No puede gestionar códigos QR  
✅ Ver todas las actividades  
✅ Gestionar estudiantes  
✅ Generar reportes  
✅ Aprobar/rechazar actividades  

### 3. VALIDADOR
❌ No puede gestionar periodos  
❌ No puede gestionar administradores  
❌ No puede gestionar códigos QR  
✅ Ver todas las actividades  
✅ Aprobar/rechazar actividades  
✅ Contactar estudiantes  
❌ No genera reportes  

### 4. CONSULTA (Solo lectura)
✅ Solo visualizar información  
❌ No puede crear/editar/eliminar nada  

### 5. ESTUDIANTE
✅ Registrar actividades  
✅ Editar actividades pendientes  
✅ Eliminar actividades pendientes  
✅ Ver estado de sus actividades  
✅ Ver códigos QR de su carrera  
✅ Editar su perfil  

---

## 📄 Vistas del Sistema

### 🔐 Administrador

#### 1. Login Admin (`/admin/login`)
- Autenticación con email y contraseña
- Validación de credenciales
- Redirección automática si ya está logueado

#### 2. Dashboard de Periodos (`/admin/periods`)
**Gestión completa de periodos escolares**

**Características:**
- 3 paneles expandibles: Activos, Pendientes, Finalizados
- Crear nuevo periodo (nombre, fechas, tipo regular/exclusivo)
- Validaciones de solapamiento y rangos (Enero-Julio o Agosto-Diciembre)
- Ver detalles con conteo por área
- Editar fechas
- Activar/Finalizar/Cerrar periodos
- Eliminar (solo si no tiene actividades)

**Reportes:**
- 📊 Reporte de Horas Totales (PDF/Excel) - Alumnos con horas por área
- 📋 Reporte por Carrera (PDF) - Actividades de carrera específica
- 📄 Reporte Completo (PDF) - Todas las actividades del periodo

**Estados:**
- 🟢 Activo - Abierto, recibiendo solicitudes
- 🟡 Pendiente - En revisión
- ⚫ Finalizado - Cerrado permanentemente

#### 3. Actividades del Periodo (`/admin/periods/activities`)
**Gestión detallada de actividades de un periodo específico**

**Características:**
- Tabla con columnas: ID, NUA, Nombre, Área, Actividad, Horas, Evidencias, Estado, Acciones
- Estados con chips de color: Pendiente, En contacto, Aprobada, Rechazada
- Panel lateral con información completa del alumno y resumen por áreas

**Acciones:**
- 👁️ Ver detalles completos
- ✏️ Editar actividad
- 📧 Contactar alumno (registra motivo, cambia estado)
- ✅ Aprobar actividad
- ❌ Rechazar con motivo

**Filtros:**
- Por nombre/NUA
- Por área (DP/VSS, RS/VCI, CEE/EIE, FCI/ICP, AC)
- Por estado

#### 4. Gestión de Estudiantes (`/admin/students`)
**Administración y seguimiento de estudiantes**

**Características:**
- Tabla con: NUA, Nombre, Email, Teléfono, Carrera, Sede, Total Actividades
- Búsqueda avanzada por nombre, NUA, correo, carrera, sede
- Ver actividades del estudiante (panel lateral)
- Información detallada con historial y resumen de horas

#### 5. Gestión de Administradores (`/admin/admins`)
**Administración de usuarios del sistema (solo superadmin)**

**Características:**
- 2 tablas: Administradores Activos e Inactivos
- Estados con chips: 👑 Superadmin, 👔 Admin, ✅ Validador, 👁️ Consulta

**Acciones:**
- ➕ Crear administrador (nombre, email, contraseña, rol)
- ℹ️ Ver información completa
- ✏️ Editar datos y rol
- 🔒 Cambiar contraseña
- 🔴 Desactivar / 🟢 Activar
- 🗑️ Eliminar permanentemente

#### 6. Gestión de Códigos QR (`/admin/qr-codes`)
**Administración de códigos QR por carrera y área (solo superadmin)**

**Contexto:**
- Los QR son generados externamente por la universidad
- 60 códigos posibles: 12 carreras × 5 áreas
- Subida manual por superadmin

**Características:**
- Tabla con: Carrera, Área, Imagen QR, Descripción, Estado, Acciones
- Filtros por carrera y área con carga dinámica
- Vista previa antes de guardar

**Acciones:**
- ➕ Agregar QR (carrera, área, imagen, descripción)
- 👁️ Ver QR ampliado
- ✏️ Editar (descripción, imagen, estado)
- 🗑️ Eliminar (archivo + registro)
- 📥 Descargar imagen

**Validaciones:**
- Formato: PNG, JPG, JPEG
- Tamaño máximo: 5 MB
- Combinación carrera-área única

**Carreras:**
- Salamanca: 8 carreras (Mecánica, Eléctrica, Comunicaciones, Mecatrónica, Sistemas, Gestión, Artes, Datos e IA)
- Yuriria: 4 carreras (Comunicaciones, Sistemas, Gestión, Inglés)

**Áreas:** DP/VSS, RS/VCI, CEE/EIE, FCI/ICP, AC

#### 7. Perfil Admin (`/admin/profile`)
**Visualización y edición del perfil del administrador**

**Información:**
- Nombre completo (3 columnas)
- Correo, teléfono
- Rol (chip con color)
- Contraseña (oculta)
- Fechas de creación y modificación

**Edición:**
- Nombre, apellidos, email, teléfono
- Cambiar contraseña (separado)
- No puede cambiar su propio rol

---

### 👨‍🎓 Estudiante

#### 8. Login Estudiante (`/student/login`)
**Autenticación y registro de estudiantes**

**Características:**
- Login con email y contraseña
- Botón "REGÍSTRATE" abre dialog

**Registro:**
- NUA (10 dígitos, único)
- Nombre completo
- Email (institucional, único)
- Teléfono (con máscara)
- Sede (Salamanca/Yuriria)
- Carrera (dropdown según sede)
- Contraseña (mínimo 8 caracteres)
- Validaciones exhaustivas

#### 9. Inicio Estudiante (`/student/index`)
**Página principal con información relevante y accesos rápidos**

**Estructura:**

**1. Bienvenida Personalizada**
- Card azul con avatar
- Muestra nombre, carrera y sede

**2. CÓDIGOS QR (Sección Principal) ⭐**
- Los 5 QR codes de la carrera del estudiante
- Un QR por cada área (DP/VSS, RS/VCI, CEE/EIE, FCI/ICP, AC)
- Solo QR activos
- Grid responsivo (3 columnas desktop)
- Cada tarjeta incluye:
  * Header con nombre del área
  * Imagen del QR (clickeable)
  * Descripción
  * Botones: Ver QR ampliado, Descargar

**3. Accesos Rápidos**
- Mi Perfil (azul)
- Mis Actividades (dorado)
- Códigos QR (amarillo) - scroll suave

**4. Avisos Importantes**
- 3 alertas con información relevante
- Info, Warning, Success

#### 10. Mis Actividades (`/student/dashboard`)
**Gestión completa de actividades del estudiante**

**Características:**

**Información del Periodo Actual:**
- Nombre, fechas, tipo
- Días restantes, estado

**Acciones Principales:**
- ➕ Enviar Nueva Actividad
  * Área, nombre, fecha, horas
  * Evidencias (múltiples archivos)
  * Formatos: PDF, JPG, PNG (máx 10MB)
  * Vista previa de archivos

- 📊 Ver Resumen de Horas
  * Tabla con horas por área
  * Total acumulado

**Tabla de Mis Actividades:**
- Columnas: ID, Área, Nombre, Fecha, Horas, Evidencias, Estado, Acciones
- Estados: Pendiente, En contacto, Aprobada, Rechazada

**Acciones por Estado:**
- **Pendiente:** Editar, Eliminar
- **En contacto:** Ver, Ver historial de contactos
- **Aprobada:** Ver (solo lectura)
- **Rechazada:** Ver + motivo de rechazo

**Filtros:**
- Por nombre de actividad
- Por área
- Por estado
- Por periodo (histórico)

#### 11. Perfil Estudiante (`/student/profile`)
**Visualización y edición del perfil del estudiante**

**Información:**
- NUA, nombre completo
- Correo, teléfono
- Carrera, sede
- Contraseña (oculta)
- Fecha de registro

**Edición:**
- Todos los campos editables (incluso NUA y carrera)
- Validaciones: NUA único, email válido
- Cambiar contraseña (separado)

---

## 🧩 Componentes Compartidos

### LegendHelpDialog
**Sistema de ayuda contextual para todas las páginas**

**Uso:**
```vue
<LegendHelpDialog v-model="dialogLegend" page="periods" />
```

**Páginas soportadas:**
- `periods` - Ayuda para periodos
- `activities` - Ayuda para actividades
- `students` - Ayuda para estudiantes
- `admins` - Ayuda para administradores
- `qr-codes` - Ayuda para códigos QR
- `student-dashboard` - Ayuda para dashboard estudiante
- `student-home` - Ayuda para inicio estudiante
- `general` - Ayuda general

**Estructura:**
- Sección de colores (chips explicativos)
- Grupos de ayuda por contexto
- Filtrado automático según página
- Tip contextual específico

### ui-alert
**Componente global de alertas/notificaciones**

**Tipos:** success, error, warning, info  
**Posición:** Top-right  
**Duración:** 3 segundos  
**Auto-cierre:** Sí  

**Uso:**
```javascript
this.mostrarAlerta('green', 'success', 'OPERACIÓN EXITOSA')
```

---

## 📊 Flujos Principales

### Flujo 1: Registro y Aprobación de Actividad

```
1. Superadmin crea PERIODO → Estado: Pendiente
2. Superadmin/Admin aprueba PERIODO → Estado: Activo
3. Estudiante ve periodo activo en dashboard
4. Estudiante registra ACTIVIDAD:
   - Selecciona área
   - Llena datos
   - Sube evidencias
   - Submit → Estado: Pendiente

5. Admin/Validador revisa actividad:
   
   OPCIÓN A - Aprobar directo:
   - Click en ✅ Aprobar
   - Estado: Aprobada
   
   OPCIÓN B - Necesita más info:
   - Click en 📧 Contactar
   - Escribe motivo
   - Estado: En contacto
   - Admin vuelve a revisar
   
   OPCIÓN C - Rechazar:
   - Click en ❌ Rechazar
   - Escribe motivo
   - Estado: Rechazada

6. Cuando todas están aprobadas/rechazadas:
   - Admin finaliza periodo → Estado: Pendiente (revisión)
7. Admin cierra revisión → Estado: Finalizado
8. Superadmin/Admin descarga reportes
```

### Flujo 2: Gestión de Códigos QR

```
1. Universidad genera códigos QR externamente
2. Superadmin sube QR al sistema
3. Sistema valida unicidad (carrera + área)
4. QR se guarda en /uploads/qr-codes/
5. Estudiante accede a /student/index
6. Sistema consulta QR codes de su carrera
7. Muestra los 5 QR (uno por área)
8. Estudiante puede ver, descargar y escanear
9. Al registrar actividad, estudiante escanea QR
```

### Flujo 3: Generación de Reportes

```
1. Admin selecciona periodo finalizado
2. Click en "Descargar Reportes"
3. 3 opciones disponibles:

   A. Reporte de Horas (PDF/Excel):
      - Tarjetas por alumno
      - Horas por área

   B. Reporte por Carrera (PDF):
      - Selecciona sede y carrera
      - Todas las actividades

   C. Reporte Completo (PDF):
      - Todas las actividades sin filtros

4. Archivo se genera y descarga automáticamente
```

---

## 🗄️ Estructura de Datos

### Usuarios (users)
```sql
use_id, use_nua (UNIQUE), use_name, use_last_name, 
use_second_last_name, use_email (UNIQUE), use_phone, 
use_career, use_sede, use_password, use_active, use_created_at
```

### Administradores (admins)
```sql
adm_id, adm_name, adm_last_name, adm_second_last_name, 
adm_email (UNIQUE), adm_password, 
adm_role (superadmin/admin/validador/consulta), 
adm_active, adm_created_at
```

### Periodos (periods)
```sql
per_id, per_name, per_date_start, per_date_end, 
per_exclusive (boolean), 
per_status (active/pending/ended), 
per_created_by, per_created_at
```

### Actividades (activities)
```sql
act_id, act_period_id, act_user_id, 
act_area (DP/VSS, RS/VCI, etc.), 
act_name, act_date, act_hours, 
act_evidence_paths (JSON), 
act_status (pending/contacted/approved/rejected), 
act_rejection_reason, act_created_at, act_updated_at
```

### Contactos (contacts)
```sql
con_id, con_activity_id, con_admin_id, 
con_reason, con_date, con_created_at
```

### Códigos QR (qr_codes)
```sql
qr_id, qr_career, qr_area, qr_image_path, 
qr_description, qr_active, qr_created_by, 
qr_created_at, qr_updated_at
UNIQUE(qr_career, qr_area)
```

---

## 🎨 Convenciones de Diseño

### Tipografía
- **Fuente principal:** Montserrat (400, 500, 600, 700)
- **Alternativas:** Roboto, Open Sans, Gandhi Sans

### Componentes Vuetify
- **Cards:** rounded-xl, elevation-2/3
- **Buttons:** rounded-pill o rounded, elevation-0
- **Dialogs:** max-width 500-900px, persistent
- **Data Tables:** dense, items-per-page 10
- **Chips:** small, dark, colored
- **Forms:** outlined, dense

### Responsividad
- **Desktop:** cols="12" md="4"
- **Tablet:** cols="12" sm="6"
- **Móvil:** cols="12"

---

## 📝 Buenas Prácticas Implementadas

### Frontend
1. **Validación de Formularios** - En tiempo real, mensajes claros
2. **Manejo de Errores** - Try-catch, mensajes amigables
3. **Seguridad** - Inputs sanitizados, validación de archivos
4. **Performance** - Lazy loading, imágenes optimizadas, paginación
5. **UX** - Loading states, confirmaciones, help tooltips

### Código
1. **Nomenclatura** - camelCase, PascalCase, UPPER_CASE
2. **Estructura** - Un componente por archivo, lógica separada
3. **Reutilización** - Componentes compartidos, props tipados
4. **Comentarios** - Documentación de lógica compleja

---

## 🚀 Futuras Mejoras

1. **Notificaciones** - Email, recordatorios, alertas
2. **Dashboard Mejorado** - Gráficas, estadísticas, tendencias
3. **Reportes Avanzados** - Filtros personalizados, programados
4. **Sistema de Archivos** - Preview PDFs, compresión, zoom
5. **Accesibilidad** - Modo oscuro, tamaños ajustables
6. **Mobile App** - PWA, notificaciones push, modo offline
7. **Integraciones** - SSO, sincronización, API pública

---

## 📞 Contacto y Soporte

**Desarrollador:** Fer Torres  
**Institución:** Instituto Tecnológico Superior de Salamanca  
**Propósito:** Gestión de Actividades Complementarias de Formación Estudiantil  

---

**Última actualización:** 2 de diciembre de 2025  
**Versión:** 1.0.0

---

Para más información sobre Nuxt.js, consulta la [documentación oficial](https://nuxtjs.org).
