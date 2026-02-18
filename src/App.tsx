import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Habits from '@/pages/Habits'
import Statistics from '@/pages/Statistics'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161b22',
            color: '#e6edf3',
            border: '1px solid #30363d',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#238636', secondary: '#e6edf3' },
          },
          error: {
            iconTheme: { primary: '#da3633', secondary: '#e6edf3' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
