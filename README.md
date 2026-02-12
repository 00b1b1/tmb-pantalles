# 🚇 TMB Pantalles - Pantalles digitals d'informació a l'usuari

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://tmb-metro.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌍 Idiomes / Idiomas
- [Català (ca)](#català)
- [Español (es)](#español)

---

<img width="1878" height="521" alt="image" src="https://github.com/user-attachments/assets/4d3b2462-1cc7-442f-a5eb-95dcd73e02b9" />
<img width="1878" height="521" alt="image" src="https://github.com/user-attachments/assets/06ca68d4-efaf-4071-b5f5-c7e70fdb91c7" />


<a name="català"></a>
## 🏙️ Català

### 📌 Descripció
**TMB Pantalles** és una rèplica digital d'alta fidelitat de les pantalles d'informació en temps real del **Metro de Barcelona (TMB)**. Dissenyada per ser utilitzada en monitors de vivendes, oficines o negocis, oferint una experiència visual prèmium i 100% funcional.

### ✨ Característiques Principals
*   **📡 Temps Real**: Connexió directa amb l'API oficial de TMB per a horaris exactes.
*   **🛠️ Configurador Integrat**: Selecciona qualsevol línia (L1-L11) i estació en segons.
*   **⚠️ Sistema d'Alertes**:
    *   **Oficials**: Incidències reals de la xarxa de TMB.
    *   **Personalitzades**: Crea els teus propis avisos per a Rodalies, FGC o Tram.
*   **🔗 API dinàmica**: Genera URLs preconfigurades per a sistemes de senyalització digital.
*   **🖥️ Mode Pantalla Completa**: Optimitzat per a resolucions 1080p.

### 🚀 Instal·lació i Ús
1.  **Clonar el repositori**:
    ```bash
    git clone https://github.com/00b1b1/tmb-pantalles.git
    cd tmb-metro
    ```
2.  **Instal·lar dependències**:
    ```bash
    npm install
    ```
3.  **Executar en mode desenvolupament**:
    ```bash
    npm run dev
    ```
4.  **Generar build de producció**:
    ```bash
    npm run build
    ```

### 🔑 Configuració de l'API
Aquest projecte requereix dades oficials de TMB. Per configurar-les:
1.  **Obtenir credencials**: Registra't al portal de [TMB Developer](https://developer.tmb.cat/) i crea una aplicació per obtenir el teu `App Id` i `App Key`.
2.  **Configurar variables d'entorn**:
    *   Crea un arxiu `.env` a l'arrel del projecte.
    *   Afegeix les teves claus seguint el format de `.env.example`:
        ```env
        VITE_TMB_APP_ID=el_teu_app_id
        VITE_TMB_APP_KEY=la_teva_app_key
        ```
3.  **Seguretat**: L'arxiu `.env` està ignorat per Git per evitar que les teves claus es publiquin a GitHub.

### ⚙️ Customització
El projecte és altament flexible i permet les següents configuracions:
*   **Selecció d'Estació**: Totes les estacions de la xarxa de TMB (L1 a L11), incloent els ramals de la L9 i L10.
*   **Sentit de la marxa**: Canvia entre el sentit d'anada i tornada per visualitzar els temps correctes de cada andana.
*   **Alertes Personalitzades**: Sistema d'edició visual per crear avisos amb:
    *   Títol i text personalitzat.
    *   Colors de fons, text i capçalera (selector HEX).
    *   Icones de transport (Metro TMB, FGC, Tram, Rodalies, etc.).
*   **Mode Kiosk**: Possibilitat d'ocultar el botó de configuració per a pantalles públiques (accessible mitjançant la tecla 'c').

### ✍️ Gestió de Textos
Tots els textos de l'aplicació estan centralitzats per facilitar la seva edició o traducció:
*   **Arxiu**: `src/constants/texts.ts`
*   **Com editar**: Obre l'arxiu i modifica els valors de l'objecte `APP_TEXTS`. Els canvis es reflectiran instantàniament en tota l'interfície (pantalla, configurador i documentació).

### 📊 Obtenint les Dades
Les dades es recullen en temps real de les següents fonts:
*   **TMB API (v1)**: Utilitzem el portal [TMB Developer](https://developer.tmb.cat/) per obtenir:
    *   `lines/metro`: Llistat de les línies i els seus colors oficials.
    *   `stations`: Estacions associades a cada línia.
    *   `ibus/lines`: Propers trens (temps d'arribada previstos) des de l'endpoint d'iBus adaptat a Metro.
    *   `alerts`: Estat del servei i incidències programades o en temps real.
*   **Càlcul Dinàmic**: Els "minuts restants" es calculen comparant el timestamp d'arribada (`temps_arribada`) de l'API amb l'hora actual del sistema per garantir una precisió total.

---

<a name="español"></a>
## 🏙️ Español

### 📌 Descripción
**TMB Pantalles** es una réplica digital de alta fidelidad de las pantallas de información en tiempo real del **Metro de Barcelona (TMB)**. Diseñada para ser utilizada en monitores de viviendas, oficinas o negocios, ofreciendo una experiencia visual prémium y 100% funcional.

### ✨ Características Principales
*   **📡 Tiempo Real**: Conexión directa con la API oficial de TMB para horarios exactos.
*   **🛠️ Configurador Integrado**: Selecciona cualquier línea (L1-L11) y estación en segundos.
*   **⚠️ Sistema de Alertas**:
    *   **Oficiales**: Incidencias reales de la red de TMB.
    *   **Personalizadas**: Crea tus propios avisos para Rodalies, FGC o Tram.
*   **🔗 API dinámica**: Genera URLs preconfiguradas para sistemas de señalización digital.
*   **🖥️ Modo Pantalla Completa**: Optimizado para resoluciones 1080p.

### 🚀 Instalación y Uso
1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/00b1b1/tmb-pantalles.git
    cd tmb-pantalles
    ```
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Ejecutar en modo desarrollo**:
    ```bash
    npm run dev
    ```
4.  **Generar build de producción**:
    ```bash
    npm run build
    ```

### 🔑 Configuración de la API
Este proyecto requiere datos oficiales de TMB. Para configurarlos:
1.  **Obtener credenciales**: Regístrate en el portal de [TMB Developer](https://developer.tmb.cat/) y crea una aplicación para obtener tu `App Id` y `App Key`.
2.  **Configurar variables de entorno**:
    *   Crea un archivo `.env` en la raíz del proyecto.
    *   Añade tus claves siguiendo el formato de `.env.example`:
        ```env
        VITE_TMB_APP_ID=tu_app_id
        VITE_TMB_APP_KEY=tu_app_key
        ```
3.  **Seguridad**: El archivo `.env` está ignorado por Git para evitar que tus claves se publiquen en GitHub.

### ⚙️ Personalización
El proyecto es altamente flexible y permite las siguientes configuraciones:
*   **Selección de Estación**: Todas las estaciones de la red de TMB (L1 a L11), incluyendo los ramales de la L9 y L10.
*   **Sentido de la marcha**: Cambia entre el sentido de ida y vuelta para visualizar los tiempos correctos de cada andén.
*   **Alertas Personalizadas**: Sistema de edición visual para crear avisos con:
    *   Título y texto personalizado.
    *   Colores de fondo, texto y cabecera (selector HEX).
    *   Iconos de transporte (Metro TMB, FGC, Tram, Rodalies, etc.) obtenidos gracias al repositorio de Iconos de la App de TMB: https://github.com/TMB-Barcelona/TMB-Icons
*   **Modo Kiosk**: Posibilidad de ocultar el botón de configuración para pantallas públicas (accesible mediante la tecla 'c').

### ✍️ Gestión de Textos
Todos los textos de la aplicación están centralizados para facilitar su edición o traducción:
*   **Archivo**: `src/constants/texts.ts`
*   **Cómo editar**: Abre el archivo y modifica los valores del objeto `APP_TEXTS`. Los cambios se reflejarán instantáneamente en toda la interfaz (pantalla, configurador y documentación).

### 📊 Obtención de Datos
Los datos se recogen en tiempo real de las siguientes fuentes:
*   **TMB API (v1)**: Utilizamos el portal [TMB Developer](https://developer.tmb.cat/) para obtener:
    *   `lines/metro`: Listado de las líneas y sus colores oficiales.
    *   `stations`: Estaciones asociadas a cada línea.
    *   `ibus/lines`: Próximos trenes (tiempos de llegada previstos) desde el endpoint de iBus adaptado a Metro.
    *   `alerts`: Estado del servicio e incidencias programadas o en tiempo real.
*   **Cálculo Dinámico**: Los "minutos restantes" se calculan comparando el timestamp de llegada (`temps_arribada`) de la API teniendo en cuenta que estos datos se alojan en Unix TimeStamp, con la hora actual del sistema para garantizar una precisión total.

---

## 🎨 Paleta de Colors (Oficial TMB)
- **Vermell TMB**: `#C8102E`
- **Groc Alerta**: `#FFE501`
- **Fons**: `#FFFFFF`
- **Text/Detalls**: `#000000`

---

## 👨‍💻 Crèdits
Desenvolupat amb el cor per a la comunitat de transport de Barcelona per [Ahmed Bibi](https://x.com/b_1__b_1). No és una aplicació oficial de Transports Metropolitans de Barcelona (TMB).

---

## 📄 Llicència
Aquest projecte és de codi obert sota la llicència MIT.
