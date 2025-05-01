import React from 'react'
import SideBar from '../components/NavBar'
import CategoryWiseInventoryBarChart from '../components/charts/CategoryWiseInventoryBarChart'
import CateggoryWiseProductStrength from '../components/charts/CategoryWiseProductStrength'
import CategoryWiseSaleChart from '../components/charts/CategoryWiseSaleChart'
import OrderTrendsLineChart from '../components/charts/OrderTrendsLineChart'
import ProductPerformancePieChart from '../components/charts/ProductPerformancePieChart'
import StatisticCard from '../components/StatisticCard'
import { FaDollarSign, FaShoppingCart, FaCashRegister, FaUsers, FaStar, FaList, FaBoxOpen, FaEye, FaClock, FaMobileAlt, FaLaptop} from 'react-icons/fa'; // Import icons from React Icons

const Dashboard = () => {
  return (
    <div>
      <SideBar />
      <div className='statistic-cards-container'> 
         {/* Total Sales */}
         <StatisticCard
          title="Total Sales"
          value={500000}
          prefix={<FaDollarSign />}
          precision={0}
          hoverable={true}
        />

        {/* Total Orders */}
        <StatisticCard
          title="Total Orders"
          value={4500}
          prefix={<FaShoppingCart />}
          precision={0}
        />

        {/* Average Order Value (AOV) */}
        <StatisticCard
          title="Average Order Value"
          value={35.4}
          prefix={<FaCashRegister />}
          precision={2}
        />

        {/* Total Users */}
        <StatisticCard
          title="Total Users"
          value={5000}
          prefix={<FaUsers />}
          precision={0}
        />

        {/* Average Review */}
        <StatisticCard
          title="Average Review"
          value={4.5}
          prefix={<FaStar />}
          precision={1}
        />

        {/* Total Categories */}
        <StatisticCard
          title="Total Categories"
          value={12}
          prefix={<FaList />}
          precision={0}
        />

        {/* Total Products Sold to Date */}
        <StatisticCard
          title="Total Products Sold"
          value={80000}
          prefix={<FaBoxOpen />}
          precision={0}
        />

        {/* Total Page Views */}
        <StatisticCard
          title="Total Page Views"
          value={350000}
          prefix={<FaEye />}
          precision={0}
        />

        {/* Average Session Duration */}
        <StatisticCard
          title="Average Session Duration"
          value={5.2}
          suffix="min"
          prefix={<FaClock />}
          precision={1}
        />

        {/* Best Selling Product */}
        <StatisticCard
          title="Best Selling Product"
          value="Headphones"  
          prefix={<FaBoxOpen />} 
          precision={0}
        />

        {/* Mobile vs Desktop */}
        <div className="mobile-vs-desktop">
          <StatisticCard
            title="Mobile Traffic"
            value={70}
            suffix="%"
            prefix={<FaMobileAlt />}
            precision={0}
          />
          <StatisticCard
            title="Desktop Traffic"
            value={30}
            suffix="%"
            prefix={<FaLaptop />}
            precision={0}
          />
        </div>
      </div>
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
