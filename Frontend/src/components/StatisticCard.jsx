import React from 'react';
import { Statistic } from 'antd';

const StatisticCard = ({ title, value, prefix, suffix, precision = 2 }) => (
  <div className="stat-card-container">
    <Statistic
      title={title}
      value={value}
      precision={precision}  
      prefix={prefix}       
      suffix={suffix}       
      className="statistic-text-white" 
    />
  </div>
);

export default StatisticCard;
