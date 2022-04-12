import { useState } from 'react'

const AdminsOnly = ({ app, chilren }) => {
  if (app.admin) return children
  else return <p>Login bitch</p>
}

export default AdminsOnly
