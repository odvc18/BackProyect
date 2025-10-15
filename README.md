# BackProyect


BackProyect — Microservices Architecture



Proyecto académico de Arquitectura de Software

Sistema backend distribuido bajo el enfoque de microservicios, diseñado para gestionar concursos, usuarios, evaluaciones y análisis mediante IA.



📘 Descripción general



El proyecto implementa una arquitectura basada en microservicios independientes, cada uno con responsabilidades delimitadas (bounded contexts), comunicándose mediante APIs REST.

Su objetivo es ofrecer un entorno modular, escalable y mantenible para la gestión de un sistema de concursos con soporte de análisis automático e identidad segura.



🏗️ Arquitectura



Cada módulo representa un microservicio autónomo:



Microservicio	Descripción principal

ws-identity	Gestión de autenticación, usuarios y roles (servicio de identidad).

ws-contest	Administración de concursos, reglas y participantes.

ws-evaluation	Procesamiento y almacenamiento de resultados o evaluaciones.

ws-submission	Recepción, validación y envío de entregas o propuestas.

ws-ai\_analysis	Módulo de análisis con IA para revisión automatizada o scoring.

scripts	Contiene utilidades, pipelines o herramientas de despliegue.

.github/workflows	Flujos de integración y despliegue continuo (CI/CD) configurados para GitHub Actions.



📂 Estructura del repositorio

📦 BackProyect/

&nbsp;┣ 📁 .github/             # Workflows y CI/CD

&nbsp;┣ 📁 scripts/             # Scripts de utilidad o automatización

&nbsp;┣ 📁 ws-ai\_analysis/      # Microservicio de IA / análisis automático

&nbsp;┣ 📁 ws-contest/          # Microservicio de gestión de concursos

&nbsp;┣ 📁 ws-evaluation/       # Microservicio de evaluación

&nbsp;┣ 📁 ws-identity/         # Microservicio de autenticación y usuarios

&nbsp;┣ 📁 ws-submission/       # Microservicio de entregas o submissions

&nbsp;┣ 📄 .gitignore

&nbsp;┗ 📄 README.md



⚙️ Tecnologías principales

Componente	Tecnología

Lenguaje	Java / Spring Boot (puede adaptarse si usas otro stack)

Base de datos	PostgreSQL / MongoDB

Comunicación	REST API / JSON

Seguridad	JWT Authentication

CI/CD	GitHub Actions

Contenedores	Docker y Docker Compose

Versionamiento	Git + GitHub



🚀 Ejecución local



Clonar el repositorio



git clone https://github.com/odvc18/BackProyect.git

cd BackProyect





Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto:



DB\_USER=postgres

DB\_PASS=tu\_contraseña

JWT\_SECRET=clave\_segura

PORT=8080





Compilar y ejecutar (ejemplo con Maven o Gradle)



mvn clean package

java -jar ws-identity/target/identity.jar





O usar Docker Compose



docker compose up --build



🧪 Pruebas



Ejecuta pruebas unitarias y de integración:



mvn test





O en cada servicio (según su configuración individual):



cd ws-contest

mvn test



📡 Endpoints principales (ejemplo)

Servicio	Endpoint base	Ejemplos

Identity	/api/v1/auth	/login, /register, /users

Contest	/api/v1/contests	/, /create, /details/{id}

Evaluation	/api/v1/evaluation	/, /grade/{submissionId}

Submission	/api/v1/submissions	/, /upload, /history

AI Analysis	/api/v1/analysis	/evaluate, /metrics

🧰 CI/CD



Integración Continua: GitHub Actions en .github/workflows



Despliegue: Configurable hacia DockerHub, AWS, Render o Railway



Pipeline básico:



Linter →



Tests →



Build →



Deploy (opcional)



🔒 Seguridad



Autenticación mediante JWT



Validación de tokens en cada servicio



Manejo de CORS y sanitización de entrada



Configuración de roles (admin, user, evaluator)



👥 Equipo de desarrollo

Integrante	Rol	Contacto

Oscar Vanegas           	Arquitecto de Software / Backend	

Gina Carolina Paz Romero	QA / Documentación técnica	

Edward Santiago Rodriguez  	Desarrollador Backend / DevOps	



📝 Licencia



Proyecto académico - uso educativo.

© 2025 — Equipo de Arquitectura de Software.

