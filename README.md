# Hugo Hotel Dashboard

A full-stack application for managing hotel rooms with a FastAPI backend and React frontend.

## 🏗 Architecture

### Backend (Python/FastAPI)
- Built with FastAPI for high-performance API endpoints
- Implements a clean architecture pattern with:
  - Routes (`app/api/routes`)
  - Services (`app/services`)
  - Repositories (`app/repositories`)
  - Models (`app/models` and `app/db/models`)
- PostgreSQL database with SQLAlchemy ORM
- PDF generation service for room reports
- CORS enabled for local development

### Frontend (React/TypeScript)
- Built with React and TypeScript
- Uses Vite for fast development and building
- Component library built on Shadcn UI and Radix UI
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation
- Toast notifications for user feedback

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd hotel-dashboard-backend
pip install -r requirements.txt
```

3. Set up your PostgreSQL database and update the connection string in `.env`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/hugohotel
```

4. Initialize the database:
```bash
python app/db/init_db.py
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with Swagger docs at `/docs`.

### Frontend Setup

1. Install dependencies:
```bash
cd hotel-dashboard-frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.


## 🔑 Key Features

- Room Management
  - Create, read, update, and delete hotel rooms
  - Room details including facilities and images
  - PDF report generation for rooms
- Modern UI
  - Responsive design
  - Toast notifications
  - Loading states
  - Error handling
- Type Safety
  - Full TypeScript support on frontend
  - Pydantic models for backend validation

## 🛠 Development Choices

1. **FastAPI**
   - High performance
   - Automatic OpenAPI documentation
   - Native async support
   - Type validation with Pydantic

2. **React with TypeScript**
   - Type safety
   - Better developer experience
   - Easier maintenance

3. **Shadcn UI & Radix**
   - Accessible components
   - Customizable design system
   - Consistent UI patterns

4. **Repository Pattern**
   - Separation of concerns
   - Easier testing
   - Maintainable code structure

## 📝 API Endpoints

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/{room_id}` - Get room details
- `PUT /api/rooms/{room_id}` - Update room
- `DELETE /api/rooms/{room_id}` - Delete room
- `GET /api/rooms/{room_id}/pdf` - Generate room PDF report

## 🧪 Testing

Run backend tests:
```bash
cd hotel-dashboard-backend
pytest
```

Run frontend tests:
```bash
cd hotel-dashboard-frontend
npm test
```

## 🔒 Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- Default API URL is configured to `http://localhost:8000`

## 📚 Additional Documentation

- FastAPI Swagger docs: `http://localhost:8000/docs`
- Frontend component documentation is available through the codebase
