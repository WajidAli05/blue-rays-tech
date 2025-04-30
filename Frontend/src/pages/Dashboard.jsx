import React from 'react'
import SideBar from '../components/NavBar'
import CategoryWiseInventoryBarChart from '../components/charts/CategoryWiseInventoryBarChart'

const Dashboard = () => {
  return (
    <div>
      <SideBar />
      <CategoryWiseInventoryBarChart />
    </div>
  )
}

export default Dashboard
