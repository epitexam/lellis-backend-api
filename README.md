# Lellis

Lellis is a secure backend platform designed for healthcare professionals.
It focuses on the management of sensitive medical data, collaborative medical workspaces, and fine-grained access control, while strictly adhering to **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

The project places strong emphasis on **security**, **domain isolation**, and **long-term scalability**, making it suitable for healthcare contexts with high regulatory and confidentiality requirements.

---

## Project Overview

Lellis aims to provide healthcare professionals (such as nurses, medical practices, and care teams) with a modern and structured platform to:

* centralize patient and medical data,
* organize visits, rounds, and care activities,
* collaborate securely within professional workspaces,
* enforce explicit and auditable access control on sensitive information.

Rather than delivering a rigid or prematurely complex system, Lellis is designed to **evolve progressively**, with a strong focus on **clear domain boundaries**, **explicit security rules**, and **controlled architectural growth**.

---

## Problem Statement

Healthcare professionals face multiple operational challenges:

* daily rounds with strict scheduling constraints,
* fragmented and poorly structured patient information,
* unorganized or scattered medical documents,
* collaboration between multiple practitioners with different responsibilities,
* heavy administrative workload,
* very high confidentiality, traceability, and compliance requirements.

Existing solutions are often either too complex, too rigid, or insufficiently aligned with real-world medical workflows.

Lellis addresses these challenges by providing:

* a centralized and explicit domain model,
* collaborative medical workspaces,
* a robust and auditable authorization system,
* multi-platform access (desktop-first),
* a modern, secure, and evolutive backend architecture.

---

## Core Concepts

### Users and Workspaces

* A **User** represents an individual account at the platform level.
* A **Workspace** represents a collaborative medical environment (e.g. a practice, a care team, or a medical unit).
* A user interacts with a workspace through a **Workspace Member** context, which defines local roles, permissions, and responsibilities.

This separation allows the same user to belong to multiple workspaces while holding different roles and access levels in each.

---

## Architectural Trajectory

Lellis follows a **progressive architectural strategy**:

> **Modular Monolith first → Microservices when justified**

This approach is intentional and driven by both technical and organizational considerations.

### Why not microservices from day one?

While microservices offer strong scalability and isolation guarantees, they also introduce significant operational and cognitive overhead (deployment, orchestration, observability, distributed consistency).

For an early-stage project — especially in a healthcare context where correctness, auditability, and maintainability are critical — starting directly with microservices would be premature.

### Chosen Strategy

1. **Phase 1 – Modular Monolith (Current)**

   * Single deployable backend
   * Strong internal modularization
   * Explicit bounded contexts
   * One database per module
   * In-process communication and domain events

2. **Phase 2 – Progressive Microservices (Planned)**

   * Selective extraction of modules
   * Independent deployments where justified
   * Database ownership preserved
   * No architectural rewrite required

This trajectory preserves **development velocity and simplicity** early on, while keeping a **clear migration path** toward microservices if and when needed.

---

## Security Architecture – Progressive Implementation

Security is a **first-class concern** in Lellis due to the sensitive medical nature of the data.

However, implementing a fully expressive authorization model from the start would introduce unnecessary complexity and risk.

For this reason, the **Security Core is developed incrementally**.

---

## Foundational Security Core (Deliverable)

The first phase focuses on a **robust, deterministic, and auditable security foundation**.

Its objectives are:

* strong isolation between users and workspaces,
* explicit role-based access control,
* predictable and testable permission evaluation,
* centralized audit logging.

### Key Characteristics

* Role-Based Access Control (RBAC)
* Explicit permission codes as domain value objects
* Clear separation between global roles and workspace roles
* Deterministic authorization logic
* Centralized audit trail
* No contextual or attribute-based rules yet

This phase deliberately avoids advanced policy engines to guarantee **correctness, maintainability, and fast iteration**.

---

## Phase 1 – Security Core Class Diagram

The following diagram represents the **foundational Security Core domain model**, currently implemented and considered stable.

![Security Core – Phase 1](docs/security-core-v1.png)

---

## Phase 2 – Advanced Authorization (Planned)

The second phase will introduce **context-aware authorization**, built on top of the existing RBAC foundation.

Planned extensions include:

* Attribute-Based Access Control (ABAC)
* Contextual permissions (assignment, time, emergency access)
* Medical-specific access rules
* Policy composition and evaluation strategies
* Temporary and delegated permissions

This phase will **not break existing domain contracts** and will remain strictly isolated within the security module.

---

## Architecture Overview

Lellis follows **Clean Architecture**, with strict separation between:

* domain logic,
* application use cases,
* infrastructure concerns,
* delivery mechanisms.

The project documentation currently includes **five PlantUML diagrams**:

1. **Global Domain Class Diagram**
   → Represents the complete business domain.

2. **Security Core Class Diagram**
   → Focused view of the authorization model.

3. **Use Case Diagram**
   → Global and workspace-level interactions.

4. **Deployment Diagram – Modular Monolith (Current)**
   → Actual production target for Phase 1.

5. **Deployment Diagram – Microservices (Target)**
   → Long-term architectural vision.

---

## Deployment Architecture – Modular Monolith (Current)

The modular monolith is the **current and intended deployment model**.

![Deployment – Modular Monolith](docs/deployment-diagram-modular-monolith.png)

### Characteristics

* Single backend deployment
* Strong internal modular boundaries
* One database per module
* In-process domain events
* Simplified operations and debugging
* Self-hostable and OSS-friendly

---

## Deployment Architecture – Microservices (Target)

The microservices architecture represents a **future evolution**, not the initial implementation.

![Deployment – Microservices](docs/deployment-diagram.png)

Modules may be extracted independently when:

* operational scaling is required,
* organizational boundaries justify it,
* deployment isolation becomes necessary.

---

## Domain Model Overview

The medical domain is modeled independently from security and infrastructure.

![Domain Class Diagram](docs/class-diagram.png)

Core concepts include:

* patients and health records,
* visits, rounds, and care series,
* prescriptions and medical acts,
* documents and transmissions,
* collaborative workspace structures.

---

## Use Case Overview

The system distinguishes between **global platform operations** and **workspace-level medical workflows**.

![Use Case Diagram](docs/global-diagram.png)

---

## Technology Stack

### Backend

* TypeScript
* Bun
* HonoJS / ElysiaJS
* PostgreSQL (one database per module)
* Prisma
* Docker

### Clients

* Desktop (Tauri)
* Web (planned)
* Mobile (planned)

---

## Project Status and Roadmap

### Phase 1 – MVP (Current)

* identity and workspace management,
* modular monolith backend,
* foundational Security Core (RBAC),
* desktop client,
* basic patient records,
* visit and planning features.

Future phases will progressively introduce advanced authorization, medical workflows, and selective service extraction.

---

## License

This project is under active development.
License information will be defined at a later stage.