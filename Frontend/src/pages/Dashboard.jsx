import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import CategoryWiseInventoryBarChart from '../components/charts/CategoryWiseInventoryBarChart'
import CateggoryWiseProductStrength from '../components/charts/CategoryWiseProductStrength'
import CategoryWiseSaleChart from '../components/charts/CategoryWiseSaleChart'
import OrderTrendsLineChart from '../components/charts/OrderTrendsLineChart'
import ProductPerformancePieChart from '../components/charts/ProductPerformancePieChart'
import StatisticCard from '../components/StatisticCard'
import { FaDollarSign, FaShoppingCart, FaCashRegister, FaUsers, FaStar, FaList, FaEye, FaClock, FaMobileAlt, FaLaptop} from 'react-icons/fa'; // Import icons from React Icons
import { Spin } from 'antd';
const Dashboard = () => {
  //states
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [websiteVisits, setWebsiteVisits] = useState(0);
  const [mobileTraffic, setMobileTraffic] = useState(0);
  const [desktopTraffic, setDesktopTraffic] = useState(0);
  const [sessionData, setSessionData] = useState({
    min: 0,
    max: 0,
    avg: 0,
  });

  //fetch session data from the server
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/session-duration/stats', {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => response.json())
    .then((data) => {
      setSessionData(data.data);
    })
    .catch((error) => {
      console.error('Error fetching session data:', error);
    });
  }, [])


  //fetch total users
  useEffect(()=> {
    fetch('http://localhost:3001/api/v1/total-users', {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => response.json())
    .then((data) => {
      setTotalUsers(data.data);
    })
    .catch((error) => {
      console.error('Error fetching total users:', error);
    });
  }, [])

  //fetch total categories
  useEffect(()=> {
    fetch('http://localhost:3001/api/v1/total-categories',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    .then((response) => response.json())
    .then((data) => {
      setTotalCategories(data.data);
    })
    .catch((error) => {
      console.error('Error fetching total categories:', error);
    });
  }, [])

  //fetch total average rating for all the products in the database
  useEffect(()=> {
    fetch('http://localhost:3001/api/v1/average-rating',
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    .then((response) => response.json())
    .then((data) => {
      setAverageRating(data.data);
    })
    .catch((error) => {
      console.error('Error fetching average rating:', error);
    });
  }, [])

  //count website visits
useEffect(() => {
  if (!sessionStorage.getItem('visited')) {
    fetch('http://localhost:3001/api/v1/visit-count', {
      method: 'POST',
    })
    .then(() => {
      sessionStorage.setItem('visited', 'true');
    })
    .catch(err => {
      console.error('Error counting visit:', err);
    });
  }
}, []);

  //fetch devices access stats
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/trackDevice', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => {
      //set total website visits
      setWebsiteVisits(data.data.totalAccesses || 0);
      //set mobile traffic
      setMobileTraffic(data.data.mobile.percentage || 0);
      //set desktop traffic
      setDesktopTraffic(data.data.desktop.percentage || 0);
    })
    .catch((error) => {
      console.error('Error fetching device access stats:', error);
    });
  }, []);

  if (!totalUsers || !totalCategories ) return <Spin tip="Loading dashboard..." />;

  return (
    <div>
      <NavBar />
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
          value={totalUsers}
          prefix={<FaUsers />}
          precision={0}
        />

        {/* Average Review */}
        <StatisticCard
          title="Average Review"
          value={averageRating}
          prefix={<FaStar />}
          precision={1}
        />

        {/* Total Categories */}
        <StatisticCard
          title="Total Categories"
          value={totalCategories}
          prefix={<FaList />}
          precision={0}
        />

        {/* Total Page Views */}
        <StatisticCard
          title="Total Website Visits"
          value={websiteVisits >= 1e10
                                ? websiteVisits.toFixed(0) + '+'
                                : websiteVisits.toFixed(0)}
          prefix={<FaEye />}
          precision={0}
        />

        {/* Minimum session duration by users*/}
        <StatisticCard
          title="Min Session"
          value={sessionData.min}
          prefix={<FaClock />}
          suffix="Sec"
          precision={0}
        />

        {/* Average Session Duration */}
        <StatisticCard
          title="Avg Session"
          value={sessionData.avg}
          suffix="Sec"
          prefix={<FaClock />}
          precision={1}
        />

        {/* Maximum Session Duration */}
        <StatisticCard
          title="Max Session"
          value={sessionData.max}
          prefix={<FaClock />}
          suffix="Sec"
          hoverable={true}
          precision={0}
        />

        {/* Mobile vs Desktop */}
        <div className="mobile-vs-desktop">
          <StatisticCard
            title="Mobile Traffic"
            value={mobileTraffic}
            suffix=""
            prefix={<FaMobileAlt />}
            precision={0}
          />
          <StatisticCard
            title="Desktop Traffic"
            value={desktopTraffic}
            suffix=""
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
