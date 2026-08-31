# 🎮 Escape Room Placement Cell Game

An interactive web-based escape room game designed to simulate the placement process for engineering students. Complete aptitude tests, coding challenges, and HR interviews to "escape" and earn your placement!

Link for the preview : https://escape-placement-cell.vercel.app/

## ✨ Features

### 🎯 **Three-Round Challenge System**

- **Aptitude Test** - Multiple choice questions with timer
- **Coding Challenge** - Multi-language programming problems
- **HR Interview** - Voice-enabled interview with AI feedback

### 🏆 **Comprehensive Scoring & Reporting**

- Real-time score tracking across all rounds
- Detailed performance report with personalized feedback
- Overall performance evaluation (Excellent/Good/Average/Needs Improvement)

### 🎤 **Advanced Interview Features**

- Speech-to-text recognition (Chrome/Edge/Safari)
- Voice input with visual feedback
- Detailed answer analysis and scoring

### 🎨 **Modern UI/UX**

- Responsive design with Tailwind CSS
- Beautiful animations and transitions
- Dark/light theme support
- Accessible components with Radix UI

### 🛠️ **Technical Highlights**

- 3D graphics integration with Three.js
- Real-time speech recognition
- Async database operations
- Progressive Web App features

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern JavaScript library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Three Fiber** - 3D graphics in React
- **React Hook Form + Zod** - Form validation
- **Axios** - HTTP client

### Backend

- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL document database
- **Motor** - Async MongoDB driver
- **PyJWT** - JSON Web Token authentication
- **Uvicorn** - ASGI web server

### Development Tools

- **ESLint** - JavaScript linting
- **Black** - Python code formatting
- **MyPy** - Type checking
- **pytest** - Testing framework

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.8+
- **MongoDB** (local or cloud instance)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/escape-room-placement-cell.git
cd escape-room-placement-cell
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration

Create `.env` file in backend directory:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=placement_cell_game
CORS_ORIGINS=http://localhost:3000
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
# or
yarn install
```

## 🎮 Running the Application

### Start Backend Server

```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend Development Server

```bash
cd frontend
npm start
# or
yarn start
```

### Access the Game

Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Play

1. **Start the Game** - Click "Begin Your Journey" on the welcome screen
2. **Aptitude Round** - Answer 5 multiple-choice questions within 5 minutes
3. **Coding Round** - Solve a factorial programming problem in your preferred language
4. **Interview Round** - Answer 7 HR questions (type or use voice input)
5. **View Results** - Get detailed feedback and performance analysis

## 📁 Project Structure

```
escape-room-placement-cell/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── Game.jsx      # Main game component
│   │   │   ├── GameUI.jsx    # Game interface
│   │   │   └── Report.jsx    # Score report component
│   │   ├── mock/             # Mock data and game logic
│   │   └── App.js            # Main application
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.py             # FastAPI application
│   └── requirements.txt      # Python dependencies
├── .gitignore
└── README.md
```

## 🎨 Game Components

### AptitudeTest.jsx

- Timer-based multiple choice questions
- Real-time score calculation
- Passing criteria: 60% or higher

### CodingChallenge.jsx

- Multi-language support (Python, Java, C++, C)
- Test case validation
- Factorial algorithm implementation

### InterviewPanel.jsx

- Speech recognition integration
- Answer quality analysis
- Keyword-based scoring system

## 🔧 API Endpoints

### Status Management

- `GET /api/status` - Get all status checks
- `POST /api/status` - Create new status check

### Future Endpoints (Planned)

- `POST /api/auth/login` - User authentication
- `GET /api/scores` - Get user scores
- `POST /api/scores` - Save game results

## 🎨 Customization

### Adding New Questions

Edit `frontend/src/mock/gameData.js`:

```javascript
export const aptitudeQuestions = [
  {
    id: 1,
    question: "Your question here?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
  },
];
```

### Modifying Scoring Logic

Update evaluation functions in `gameData.js`:

```javascript
export const evaluateAptitudeTest = (answers, questions) => {
  // Custom scoring logic
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Community** - For the amazing ecosystem
- **FastAPI Team** - For the excellent web framework
- **Tailwind CSS** - For the utility-first CSS approach
- **Radix UI** - For accessible component primitives

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/escape-room-placement-cell/issues) page
2. Create a new issue with detailed description
3. Include browser console logs for debugging

## 🚀 Future Enhancements

- [ ] User authentication and profiles
- [ ] Leaderboard system
- [ ] Multiple difficulty levels
- [ ] Additional programming challenges
- [ ] Mobile app version
- [ ] Multiplayer mode
- [ ] Admin dashboard for question management

---

**Happy Gaming! 🎉**

Built with ❤️ for engineering students preparing for placements.
