# TasteShare – Final Report

## ✅ What I accomplished
During the semester I developed **TasteShare**, a full-stack web application for managing and sharing recipes.  
The system includes:  
- **Authentication & Authorization** – JWT login/register/logout, role-based access.  
- **Recipe management** – add, edit, delete, and view recipes with images, ingredients, and steps.  
- **Search & filters** – by difficulty, food type, and free-text search.  
- **Responsive UI** – modern Angular frontend styled with Angular Material and custom CSS.  
- **Backend API** – built with ASP.NET Core Web API, Entity Framework Core (Code-First), connected to SQL Server.  
- **Error handling** – clear validation and messages both client- and server-side.  
- **GitHub repository** – continuous commits that document design, implementation, and bug fixing.  

---

## 🛠️ How I built it
- **Backend:**  
  - ASP.NET Core Web API.  
  - EF Core Code-First with migrations.  
  - DTOs, Services, Controllers layered architecture.  
  - JWT authentication with roles (Admin, Member).  
  - Validation with FluentValidation.  
  - Swagger for API testing.  

- **Frontend:**  
  - Angular 17 standalone components.  
  - Services (e.g., `auth.service`, `recipe.service`) with HttpClient.  
  - Angular Material components (forms, navbar, cards, chips).  
  - RxJS for state management (`BehaviorSubject` for user session).  
  - Responsive design with custom CSS and Material overrides.  

- **Tools:**  
  - GitHub for version control.  
  - Visual Studio & VS Code.  
  - SQL Server Management Studio.  
  - Postman / Swagger for API testing.  

---

## 👥 Division of work
This project was developed by tomer and shmuel.  
backend and database was mostly design by tomer, and most of the front developed by shmuel.
but eventully we made it in perfect work-flow for the 2 of us, also worked togheter most of the time.
---

## 📚 What I learned
- **Full-stack development**: connecting Angular frontend with a .NET backend.  
- **Authentication**: JWT tokens, decoding claims, storing securely in localStorage, handling login/logout state.  
- **State management in Angular**: using `BehaviorSubject` and observables.  
- **Database design**: Code-First EF, migrations, relationships (ingredients, steps, recipes).  
- **Frontend design**: Angular Material theming, dark mode design, responsive grids.  
- **GitHub workflows**: pushing commits, structuring repo with backend, frontend, and docs.  

---

## ⚡ Challenges & how I solved them
1. **Auth Navbar refresh issue** – initially the navbar did not update after login.  
   - ✅ Solved by binding to `BehaviorSubject` in `auth.service` and subscribing in navbar.  

2. **PUT vs POST update error (405 Method Not Allowed)** – backend expected `PUT` with `/api/recipes/{id}` but I mistakenly used `/update`.  
   - ✅ Fixed by aligning Angular service calls with backend routes.  

3. **Token decoding differences** – backend returned claims with slightly different field names (`nameid`, `role`).  
   - ✅ Handled gracefully in frontend with fallback parsing logic.  


---

## 🚀 Future features
If I had more time, I would add:  
- User profiles with avatars and bio.  
- Social features: likes, comments, and sharing recipes between users.  
- Advanced search with multiple filters (kosher, prep time, ingredients).  
- option for smart Ai "assistence" that u write him what ingridients u have and he give u themost suitable recipe
---

## 🤖 Use of ChatGPT
ChatGPT was a helpfull tool in this project:  
- Helped **debug issues** (405 errors, navbar refresh, auth service).  
- Assisted in **UI/UX design decisions** (dark mode, consistent color palette).  
- Provided **step-by-step learning support** in Angular and .NET.  

---

## 🔄 What I would do differently
- Start earlier cause we had not enough time.  
- Add **unit tests** (Jest for Angular, xUnit for .NET).  
- Use a **cloud deployment** from the beginning (AWS/Azure) to test in a real production-like environment.  
- Improve commit granularity – make smaller, more descriptive commits.  

---

## 📂 Repository
All code and documentation:  
👉 [GitHub – TasteShare](https://github.com/tomerhadas/TasteShare.git)
