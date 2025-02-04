import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ArticleItem from "./components/ArticleItem.jsx";
import ArticleLists from "./components/ArticleLists.jsx";
import ArticleForm from "./components/ArticleForm.jsx";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
//import EditArticle from "./components/EditArticle.jsx";
import ProtectedEditArticle from "./components/ProtectedEditArticle";
import "./App.css";

function App() {
  return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<ArticleLists />} />
            <Route path="/articles/:slug" element={<ArticleItem />} />
            <Route path="/articles/:slug/edit" element={<ProtectedEditArticle />} />
            <Route path="/articles/new" element={<ArticleForm />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
