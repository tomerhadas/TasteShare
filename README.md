<<<<<<< HEAD
sections:
  - title: "Header"
    content: |
      # TasteShare 🍴

      A **social recipe-sharing web application** built with:

      - **Backend:** ASP.NET Core Web API (.NET 8), Entity Framework Core, SQL Server, FluentValidation, AutoMapper, JWT Authentication.
      - **Frontend:** Angular 17, TypeScript, RxJS, Angular Material/Tailwind (TBD by design).
      - **Database:** SQL Server (local/AWS RDS).

  - title: "Project Structure"
    content: |
      ## 📂 Project Structure

      ```
      TasteShare/
      │── backend/
      │   └── TasteShare-Backend/      # ASP.NET Core Web API
      │
      │── frontend/
      │   └── tasteshare-frontend/     # Angular 17 client
      │
      └── .gitignore
      ```

  - title: "Backend"
    content: |
      ## 🚀 Backend (ASP.NET Core)

      - **Authentication & Authorization**
        - JWT Bearer Tokens
        - Roles: `Admin`, `Member`
      - **Entities**
        - `User`, `Recipe`, `RecipeIngredient`, `RecipeStep`, `RecipeImage`, `Comment`
      - **Features**
        - User registration & login
        - CRUD for Recipes
        - Nested collections (ingredients, steps, images, comments)
        - Validation with FluentValidation
        - Mapping with AutoMapper

      Run backend:

      ```bash
      cd backend/TasteShare-Backend
      dotnet restore
      dotnet ef database update
      dotnet run
      ```

      Backend will run at:  
      👉 https://localhost:7015

  - title: "Frontend"
    content: |
      ## 🎨 Frontend (Angular)

      - Angular 17 standalone components
      - Routing, Services, and Guards
      - API integration with backend
      - Reactive forms + validations
      - Authentication handling with JWT

      Run frontend:

      ```bash
      cd frontend/tasteshare-frontend
      npm install
      ng serve -o
      ```

      Frontend will run at:  
      👉 http://localhost:4200

  - title: "Tech Stack"
    content: |
      ## 🛠️ Tech Stack

      **Backend**
      - C# / ASP.NET Core Web API
      - EF Core (Code First, Migrations)
      - SQL Server
      - FluentValidation
      - AutoMapper
      - JWT Authentication

      **Frontend**
      - Angular 17
      - TypeScript
      - RxJS
      - Angular Material / TailwindCSS

  - title: "Deployment"
    content: |
      ## 🌐 Deployment

      - **Backend**: Azure App Service / AWS Elastic Beanstalk
      - **Database**: Azure SQL / AWS RDS
      - **Frontend**: Vercel / Netlify / Azure Static Web Apps

  - title: "Future Plans"
    content: |
      ## 📌 Future Plans
      - Advanced search & filtering
      - Favorites & Likes
      - Real-time updates (SignalR)
      - User profiles & social features

  - title: "Authors"
    content: |
      ## 👨‍💻 Authors
      - **Tomer Hadas**  
      - **Shmuel Cohen**

      📧 [LinkedIn](https://www.linkedin.com/) | 🌍 [Portfolio](#)
=======
# TasteShare
A social recipe-sharing web application built with ASP.NET Core Web API and Angula
>>>>>>> 0ba51cd (Initial commit)
