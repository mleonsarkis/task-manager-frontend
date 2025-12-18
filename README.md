# Project Task Manager – Frontend

## Overview

This project is the **frontend application** for the Project Task Manager system.

It is a **single page application (SPA)** built with **React**.  
The frontend communicate with the backend REST API to manage **Projects** and **Tasks**.

User can:
- See list of projects
- Create, update and delete projects
- Manage tasks inside a selected project

---

## Technology Stack

### React
React is used to build the user interface.

**Why React**
- Component based architecture
- Easy to manage UI state
- Very popular and well supported
- Good performance for SPA applications

React allow building reusable UI components.

---

### TypeScript
TypeScript is used instead of plain JavaScript.

**Why TypeScript**
- Strong typing reduce runtime errors
- Better developer experience
- Easier to refactor code
- Works very well with React

TypeScript help catch many bugs during development.

---

### Vite
Vite is used as build tool and dev server.

**Why Vite**
- Very fast startup time
- Instant hot reload
- Simple configuration
- Modern tooling out of the box

Vite make development faster and smoother.

---

### Fetch API
Browser Fetch API is used to communicate with backend.

**Why Fetch**
- Built-in browser API
- No extra dependency required
- Simple for small applications

All API calls are centralized in one place.

---

### HTML + CSS (Inline styles)
Simple HTML and inline CSS is used for layout.

**Why simple styling**
- Focus on functionality instead of design
- Reduce complexity
- Easy to read and understand code

This can be improved later with UI libraries.

---

## Project Structure

src/
├── api -> API communication logic
├── pages -> Page components
├── types.ts -> Shared TypeScript types
├── App.tsx -> Application root
├── main.tsx -> React entry point


This structure keep frontend simple and organized.

---

## How to Run Frontend (Windows)

### Requirements
- Node.js 18 or higher installed
- Backend running on `http://localhost:8080`

---

### Step 1: Install dependencies

Open terminal in frontend folder:

## Future Improvements

The frontend was implemented in a simple way, but many improvements can be added in future.

- **Better User Interface**  
  Replace browser prompts with real forms and modal dialogs.  
  Use better layout and spacing for improved user experience.

- **Loading and Empty States**  
  Add loading indicators when data is fetching from backend.  
  Show better empty states when no projects or tasks exist.

- **Improved Error Handling**  
  Display more user friendly error messages.  
  Handle network errors and backend errors in a better way.

- **State Management**  
  Use React Query or similar library to manage server state.  
  This reduce duplicated API calls and improve performance.

- **Pagination and Filtering**  
  Add pagination when list of projects or tasks becomes large.  
  Add more filtering options for task status and due date.

- **Form Validation**  
  Add client side validation before sending data to backend.  
  This avoid unnecessary API calls.

- **Authentication and Authorization**  
  Add user login and permissions.  
  Restrict access to projects based on logged in user.

- **Testing**  
  Add unit tests and integration tests for components.  
  This increase confidence when refactoring code.

- **Production Build and Deployment**  
  Add environment based configuration for production.  
  Optimize build and deploy to cloud or static hosting.

These improvements would make the frontend more scalable,  
more user friendly and production ready.
