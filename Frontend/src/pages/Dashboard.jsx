import React from 'react'
import SideBar from '../components/NavBar'
import CategoryWiseInventoryBarChart from '../components/charts/CategoryWiseInventoryBarChart'
import CateggoryWiseProductStrength from '../components/charts/CategoryWiseProductStrength'
import CategoryWiseSaleChart from '../components/charts/CategoryWiseSaleChart'
import OrderTrendsLineChart from '../components/charts/OrderTrendsLineChart'
import ProductPerformancePieChart from '../components/charts/ProductPerformancePieChart'

const Dashboard = () => {
  return (
    <div>
      <SideBar />
      <div className='charts-container'>
        <CategoryWiseInventoryBarChart />
        <CateggoryWiseProductStrength />
        <OrderTrendsLineChart />
        <CategoryWiseSaleChart />
        <ProductPerformancePieChart />
      </div>
    </div>
  )
}

export default Dashboard
