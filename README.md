# Warehouse Management System (WMS)

A full-stack Warehouse Management System built with **Django**, **React**, **Tailwind CSS**, and **PostgreSQL**. This system supports inventory tracking, inbound/outbound management, user roles, and real-time insights — containerized with Docker and deployed on AWS EC2.

## 🚀 Features

### ✅ Compulsory Features
- Product Inventory Management (add/edit/archive/search)
- Inbound and Outbound Transaction Recording
- User and Role Management (Admin, Manager, Operator)
- Real-time Inventory Dashboard
- Audit Logs

### 🌟 Advanced Features
- Bulk Upload via CSV/XLSX (Inventory + Inbound)
- File Attachments for Transactions (Invoices, DOs)
- Low Stock Alerts
- Barcode/QR Code Support
- Inventory Cycle Count
- Audit Summary 
   - Visual log of user activity
   - Track most edited items, frequent stock adjustments, etc


## 🛠 Tech Stack

| Layer        | Technology                     |
|-------------|--------------------------------|
| Backend      | Django, Django REST Framework  |
| Frontend     | React, Tailwind CSS, Vite      |
| Database     | PostgreSQL                     |
| Auth         | JWT Authentication             |
| Containerization | Docker, Docker Compose     |
| Web Server   | Gunicorn, Nginx (Reverse Proxy)|
| Deployment   | AWS EC2 (Ubuntu)               |

## 📦 System Architecture

- **Backend:** Django REST API running with Gunicorn and served via Nginx.
- **Frontend:** Vite + React SPA served statically by Nginx.
- **Database:** PostgreSQL containerized via Docker.
- **Deployment:** AWS EC2 with Docker Compose, Nginx reverse proxy.

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/livekhagunasekar/warehouse-management-system.git
cd warehouse-management-system
```

### 2. Prepare the Environment
Make sure you have the following installed on your system:
  - Docker
  - Docker Compose

### 3. ⚙️ Add Environment Variables
  - For Django Backend: wms-app/.env
  - Create a .env file inside the wms-app directory:
```bash
DEBUG=True
SECRET_KEY=your_secret_key_here
POSTGRES_DB=wmsdb
POSTGRES_USER=wmsuser
POSTGRES_PASSWORD=wmspassword
POSTGRES_HOST=db
POSTGRES_PORT=5432
ALLOWED_HOSTS="localhost 127.0.0.1"
```
  - For React Frontend: wms-frontend/.env
  - Create a .env file inside the wms-frontend directory:

```bash
VITE_API_BASE_URL=http://13.222.50.158
```

### 4. 🐳 Build and Start All Services
From the root directory:

```bash
sudo docker-compose up -d --build

```
This command will:
  - Build the Django backend
  - Build the React frontend
  - Start the PostgreSQL database
  - Run Nginx reverse proxy

### 5. 🌐 Access the Application
- **Frontend UI**: [http://13.222.50.158](http://13.222.50.158)
- **Django Admin Panel**: [http://13.222.50.158/admin/](http://13.222.50.158/admin/)

 ### 6. 🔐 Default Admin Login Credentials
 Use the following credentials to log in:
   - Username: superadmin
   - Password: superadmin123

### 7. 🙋‍♀️ Author / Acknowledgments
**Livekha Gunasekar**  
Full-stack Developer | [LinkedIn](https://www.linkedin.com/in/livekha-gunasekar/)

## 🙏 Acknowledgments

- Special thanks to the Artiselite team for the opportunity. 





















