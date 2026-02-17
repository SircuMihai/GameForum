import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import UserProfile from './pages/UserProfile'
import { TopicsList } from './pages/TopicsList'
import { ThreadView } from './pages/ThreadView'
import { NewTopicPage } from './pages/NewTopicPage'
import AdminPage from './pages/AdminPage'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPage from './pages/ForgotPasswordPage'
export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<TopicsList />} />
        <Route path="/topic/:id" element={<ThreadView />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/new-topic" element={<NewTopicPage />} />
        <Route path="/admin" element={<AdminPage />} />


    </Routes>
  )
}
