import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import UserProfile from './pages/UserProfile'
import { TopicsList } from './pages/TopicsList'
import { ThreadView } from './pages/ThreadView'
import { NewTopicPage } from './pages/NewTopicPage'
import AdminPage from './pages/AdminPage'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import { useAuth } from './auth/useAuth'

function RequireAdmin({ children }) {
  const auth = useAuth()

  if (!auth?.token) {
    return <Navigate to="/login" replace />
  }

  const role = String(auth?.user?.role || auth?.user?.userRole || '').toUpperCase()
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<TopicsList />} />
        <Route path="/topic/:id" element={<ThreadView />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/new-topic" element={<NewTopicPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />

    </Routes>
  )
}
