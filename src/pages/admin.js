import React from 'react'
import dynamic from 'next/dynamic'

// ✅ 关键修改：这里全部改成小写 adminsystem
const AdminComponent = dynamic(
  () => import('../components/adminsystem/AdminDashboard'),
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