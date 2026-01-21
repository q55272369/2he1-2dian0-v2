import React from 'react'
import dynamic from 'next/dynamic'

// ✅ 这里的路径必须和文件夹名 AdminSystem 一模一样 (大小写敏感)
const AdminComponent = dynamic(
  () => import('../components/AdminSystem/AdminDashboard'),
  { ssr: false }
)

const AdminPage = () => {
  return (
    <div suppressHydrationWarning>
      <AdminComponent />
    </div>
  )
}

export default AdminPage