# Project Documentation & API Endpoints

This document provides a comprehensive overview of the hospital management backend system, detailing the architecture, user roles, authentication mechanism, database models, and all API endpoints.

---

## 1. System Overview & Architecture

The application is built as an Express.js server using ES module imports, structured with distinct layers for controllers, validators, routers, and database schemas:

- **Database Layer**: MongoDB managed via Mongoose. Schemas are defined in `db/models/` and consolidated in `db/index.js`.
- **Validation Layer**: Request validation using Joi schemas in each module to sanitize incoming headers, body inputs, parameters, and query fields.
- **Controller Layer**: House the core business logic, database queries, and response formatting.
- **Routing Layer**: Express routers mapped to controller handlers and validated via middlewares.
- **Security Middleware**: Centralized authentication (`isAuthenticated`) and authorization (`isAuthorized`) checks.

---

## 2. Authentication & Authorization Flow

### JWT Authentication
- To access protected endpoints, requests must include a JWT token in the headers as:
  - `Authorization: Bearer <token>` OR
  - `token: <token>`
- The token payload contains:
  - `id`: The database `_id` of the User or Employee.
  - `email`: The email of the account.
  - `role`: The role associated with the account.

### User Roles
The application defines roles divided into **Patients** and **Employees (Staff)**:
1. `patient`: A registered patient (uses the `User` database model).
2. `admin`: Has full privileges over employee management, departments, medicines, and prescriptions.
3. `hr`: Manages employees, departments, and sub-departments.
4. `doctor`: Can prescribe medicines to patients and add clinical notes/complete appointments.
5. `receptionist`: Can view details and schedule appointments on behalf of patients.
6. `pharmacist`: Manages the medicine catalog and dispenses prescriptions.

---

## 3. Database Models

### 1. User Model
Used for patients.
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `phone` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: `['patient']`, default: `'patient'`)
- `dateOfBirth` (Date)

### 2. Employee Model
Used for hospital staff.
- `employeeId` (String, unique, sparse)
- `firstName` (String, required)
- `lastName` (String)
- `email` (String, required, unique, lowercase)
- `password` (String, required, hashed)
- `phone` (String, required, unique)
- `role` (String, enum: `['admin', 'doctor', 'hr', 'receptionist', 'pharmacist']`)
- `department` (ObjectId, ref: 'Department')
- `supDepartment` (ObjectId, ref: 'SupDepartment')
- `position` (String)
- `hireDate` (Date)
- `status` (String, enum: `['active', 'inactive', 'terminated']`, default: `'active'`)
- `avatar` (String)

### 3. Department Model
- `name` (String, required, unique, lowercase)
- `slug` (String, required, unique, lowercase)
- `employee` (Array of ObjectIds, ref: 'Employee')

### 4. SupDepartment (Sub-Department) Model
- `name` (String, required, unique, lowercase)
- `slug` (String, required, unique, lowercase)
- `employee` (Array of ObjectIds, ref: 'Employee')
- `department` (ObjectId, ref: 'Department', required)

### 5. Medicine Model
- `name` (String, required, unique)
- `slug` (String, required, unique, lowercase)
- `description` (String)
- `quantity` (Number, default 0, min 0)
- `price` (Number, required, min 0)
- `expiryDate` (Date, required)
- `status` (String, enum: `['available', 'outOfStock']`, auto-updated)
- `addedBy` (ObjectId, ref: 'Employee', required)

### 6. Prescription Model
- `patient` (ObjectId, ref: 'User', required)
- `doctor` (ObjectId, ref: 'Employee', required)
- `medicines` (Array of: `{ medicine, dosage, duration, quantity }`)
- `status` (String, enum: `['pending', 'dispensed', 'cancelled']`, default: `'pending'`)
- `dispensedBy` (ObjectId, ref: 'Employee')
- `dispensedAt` (Date)

### 7. Appointment Model
- `patient` (ObjectId, ref: 'User', required)
- `doctor` (ObjectId, ref: 'Employee', required)
- `appointmentDate` (Date, required)
- `timeSlot` (String, required)
- `status` (String, enum: `['scheduled', 'completed', 'cancelled', 'noShow']`, default: `'scheduled'`)
- `reason` (String)
- `notes` (String, clinical notes added by the doctor)
- **Unique Constraint**: `{ doctor, appointmentDate, timeSlot }` must be unique to prevent double-booking.

---

## 4. API Endpoints Reference

### User (Patient) Module
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/user/register` | No | Public | Registers a new patient user. Hashes the password. |
| `POST` | `/user/login` | No | Public | Logs in a patient. Returns a JWT token. |
| `GET` | `/user/allUsers` | Yes | All Employees | Retrieves list of all registered patients. |
| `GET` | `/user/user/:id` | Yes | All Roles | Retrieves profile details of a single patient. |
| `PUT` | `/user/updateUser/:id` | Yes | Patient (self) / Admin | Updates a patient profile details. |
| `DELETE` | `/user/deleteUser/:id` | Yes | Patient (self) / Admin | Deletes a patient user account. |

### Employee Module
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/employee/login` | No | Public | Logs in any employee. Returns a JWT token. |
| `POST` | `/employee/addEmployee` | Yes | `admin`, `hr` | Registers a new employee, hashes their password, checks duplicate emails/phones. |
| `GET` | `/employee/allEmployees` | Yes | `admin`, `doctor`, `hr`, `receptionist`, `pharmacist` | Retrieves list of all employees (excludes password field). |
| `GET` | `/employee/employee/:id` | Yes | `admin`, `doctor`, `hr`, `receptionist`, `pharmacist` | Retrieves profile of a single employee by ID. |
| `PUT` | `/employee/updateEmployee/:id` | Yes | `admin`, `hr` | Updates employee details (re-hashes password if updated). |
| `DELETE` | `/employee/deleteEmployee/:id` | Yes | `admin`, `hr` | Deletes an employee from the system. |

### Department Module
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/department/addDepartment` | Yes | `admin`, `hr` | Creates a new department. |
| `GET` | `/department/allDepartments` | Yes | All Staff Roles | Retrieves all departments. |
| `GET` | `/department/department/:id` | Yes | All Staff Roles | Retrieves a single department by ID. |
| `PUT` | `/department/updateDepartment/:id` | Yes | `admin`, `hr` | Updates department info. |
| `DELETE` | `/department/deleteDepartment/:id` | Yes | `admin`, `hr` | Deletes a department. |

### Sub-Department Module
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/supDepartment/addSupDepartment` | Yes | `admin`, `hr` | Creates a new sub-department under a parent department. |
| `GET` | `/supDepartment/allSupDepartments` | Yes | All Staff Roles | Retrieves all sub-departments. |
| `GET` | `/supDepartment/supDepartment/:id` | Yes | All Staff Roles | Retrieves a single sub-department by ID. |
| `PUT` | `/supDepartment/updateSupDepartment/:id` | Yes | `admin`, `hr` | Updates sub-department details. |
| `DELETE` | `/supDepartment/deleteSupDepartment/:id` | Yes | `admin`, `hr` | Deletes a sub-department. |

### Pharmacy Module (Medicines & Prescriptions)
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/pharmacy/medicine` | Yes | `admin`, `pharmacist` | Adds a new medicine to inventory. Auto-generates slug. |
| `PUT` | `/pharmacy/medicine/:id` | Yes | `admin`, `pharmacist` | Updates medicine fields or stock. Recalculates status. |
| `DELETE` | `/pharmacy/medicine/:id` | Yes | `admin`, `pharmacist` | Deletes a medicine from the database. |
| `GET` | `/pharmacy/medicine` | Yes | All Roles | Fetches all medicines in the catalog. |
| `GET` | `/pharmacy/medicine/:id` | Yes | All Roles | Fetches a single medicine details. |
| `POST` | `/pharmacy/prescription` | Yes | `doctor` | Prescribes a list of medicines to a patient. |
| `PUT` | `/pharmacy/prescription/:id/dispense` | Yes | `admin`, `pharmacist` | Dispenses a prescription. Decrements stock quantities. |
| `GET` | `/pharmacy/prescription` | Yes | `admin`, `doctor`, `pharmacist` | Fetches all prescriptions list. |
| `GET` | `/pharmacy/prescription/patient` | Yes | All Roles | Fetches prescriptions of the current patient. Staff must specify a `patientId` query param. |
| `GET` | `/pharmacy/prescription/:id` | Yes | All Roles | Fetches a single prescription by ID (Patients can only view theirs). |

### Appointment Module
| Method | Endpoint | Auth Required | Roles | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/appointment/book` | Yes | All Roles | Books a doctor slot. Patients book for themselves; staff can book on behalf of any patient. |
| `PUT` | `/appointment/:id/status` | Yes | All Roles | Updates slot status. Patients can only cancel. Staff can set to cancelled/noShow. Doctors can set to completed. |
| `PUT` | `/appointment/:id/notes` | Yes | `doctor` | Allows the assigned doctor to add clinical notes. |
| `GET` | `/appointment` | Yes | All Roles | Fetches appointments. Patients see their own; Doctors see their assigned ones; Staff sees all. |
| `GET` | `/appointment/:id` | Yes | All Roles | Fetches detailed appointment info by ID. Ownership checks applied. |
