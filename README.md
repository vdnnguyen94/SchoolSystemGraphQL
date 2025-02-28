# 📚 School System Web Application using Node.js and React JS



## **Overview**
The **School System Web Application** enables administrators to **manage courses, enroll students, and oversee student-course relationships** efficiently. This project was originally built using the **MERN stack with RESTful APIs**, but has now been **migrated to GraphQL APIs** for enhanced flexibility and efficiency.

## **Key Features**
### ✅ **Admin Functionalities**
- Create, update, and delete **courses**.
- Register and manage **students**.
- Assign and manage **student enrollments** in courses.

### ✅ **Student Functionalities**
- View **enrolled courses**.
- Request **course section changes**.
- Manage their **profile** (excluding email and username changes).

### 🔒 **Authentication & Security**
- **JWT Token Authentication** for secure access.
- **HTTP-only Cookies** to prevent token exposure.
- **Role-based access control** for **admins** and **students**.

---

## **Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React 18, Material-UI 4, TypeScript
- **API:** GraphQL, Apollo Client
- **Authentication:** JWT, HTTP-only Cookies
- **Deployment:** Render

---

## **Transition from RESTful APIs to GraphQL**
Originally, this project used **RESTful APIs** but was **migrated to GraphQL APIs** for:
✅ **Efficient data fetching** – Fetch only the required data instead of multiple REST endpoints.  
✅ **Improved flexibility** – Clients can request **nested data** (e.g., students with courses) in a **single query**.  
✅ **Reduced network load** – Eliminates over-fetching and under-fetching issues in RESTful APIs.  

This transition **maintains the same MongoDB database structure** while significantly improving performance and user experience.

---

## **🛠️ Installation & Setup**
### **1. Clone the Repository**
\`\`\`sh
git clone https://github.com/vdnnguyen94/SchoolSystemGraphQL.git .
\`\`\`

### **2. Install Dependencies**
#### **Main Folder (Server)**
\`\`\`sh
npm install
\`\`\`

#### **Client Folder (React App)**
Since this project uses **React 18 with Material-UI 4**, use **yarn**:
\`\`\`sh
cd client
yarn install
\`\`\`

### **3. Build the Client**
\`\`\`sh
yarn build
\`\`\`

### **4. Start the Application**
\`\`\`sh
npm run dev
\`\`\`
This will **start both the server and the client at the same time**.

---

## **📝 Credits**
This project was developed as part of the **COMP229 Group 1 Project**.  
Special thanks to **Seyeon Jo (@sjo9)** for her contributions! 🚀  

---

## **🔐 Security Features**
✅ **Token Security** – Using **HTTP-only cookies**, ensuring **no access from client-side JavaScript**.  
✅ **Optimized GraphQL Queries** – Fetch related **student and course** data in a **single request**.  
✅ **Admin and Student Role Management** – Prevents unauthorized access to admin functions.  

---

## **🚀 Future Improvements**
- ✅ Add real-time **WebSockets** for instant course updates.
- ✅ Implement a **course waitlist** for full classes.
- ✅ Improve **error handling & logging** for debugging.

---

This transformation **elevates the original MERN-based RESTful app** into a **GraphQL-powered School System**, **enhancing efficiency, security, and flexibility**. 🎯  

Feel free to contribute! 🔥  
📌 **GitHub:** [School System GraphQL](https://github.com/vdnnguyen94/SchoolSystemGraphQL)
EOF