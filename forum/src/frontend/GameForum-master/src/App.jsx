import { Routes, Route } from "react-router-dom";
import { ForumLayout } from "./components/layout/ForumLayout";

import { Home } from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import { TopicsList } from "./pages/TopicsList";
import { ThreadView } from "./pages/ThreadView";
import { NewTopicPage } from "./pages/NewTopicPage";
import AdminPage from "./pages/AdminPage";
import OptionsPage from "./pages/OptionsPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      {/* fara layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* cu layout (NU se reseteaza muzica) */}
      <Route element={<ForumLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<TopicsList />} />
        <Route path="/topic/:id" element={<ThreadView />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/new-topic" element={<NewTopicPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/options" element={<OptionsPage />} />
      </Route>
    </Routes>
  );
}
