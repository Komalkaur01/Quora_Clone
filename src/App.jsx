import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import AllQuestions from "./pages/AllQuestions";
import DiscoverPeople from "./pages/DiscoverPage";
import QuestionDetails from "./pages/QuestionDetails";
import Technology from "./pages/Technology";
import Science from "./pages/Science";
import Business from "./pages/Business";
import Health from "./pages/Health";
import { ThemeProvider } from "./components/theme-provider";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
      <ThemeProvider>
        {/* <ModeToggle /> */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/questions" element={<AllQuestions />} />
            <Route path="/discover" element={<DiscoverPeople />} />
            <Route path="/question/:questionId" element={<QuestionDetails />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/science" element={<Science />} />
            <Route path="/business" element={<Business />} />
            <Route path="/health" element={<Health />} />
            <Route path="/post/:id" element={<PostPage />} />

          </Routes>
        </Router>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </ThemeProvider>
      {/* </ThemeProvider> */}
    </>
  );
}

export default App;
