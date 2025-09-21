import DeviceAccess from '../models/deviceAccessModel.js';

const addDeviceAccess = (req, res) => {
    const { deviceType } = req.body;
    if (!['mobile', 'desktop'].includes(deviceType)) {
        return res.status(400).json({ status: false, error: 'Invalid device type' });
    }
    console.log(`Tracking device access: ${deviceType}`);

    const newDeviceAccess = new DeviceAccess({ deviceType });
    newDeviceAccess.save()
        .then(() => res.status(201).json({ status: true, message: 'Device access tracked successfully' }))
        .catch((error) => res.status(500).json({ status: false, error: 'Failed to track device access' }));
};

const getDeviceAccess = (req, res) => {
    let deviceStats;
    let totalCount;

    // First promise: Get device statistics using aggregation
    DeviceAccess.aggregate([
        {
            $group: {
                _id: '$deviceType',
                count: { $sum: 1 }
            }
        }
    ])
    .then((stats) => {
        deviceStats = stats;
        // Second promise: Get total count
        return DeviceAccess.countDocuments();
    })
    .then((total) => {
        totalCount = total;
        
        // Initialize counts
        let mobileCount = 0;
        let desktopCount = 0;

        // Extract counts from aggregation result
        deviceStats.forEach(stat => {
            if (stat._id === 'mobile') {
                mobileCount = stat.count;
            } else if (stat._id === 'desktop') {
                desktopCount = stat.count;
            }
        });

        // Calculate percentages
        const mobilePercentage = totalCount > 0 ? ((mobileCount / totalCount) * 100).toFixed(2) : 0;
        const desktopPercentage = totalCount > 0 ? ((desktopCount / totalCount) * 100).toFixed(2) : 0;

        // Return processed data for next then block
        return {
            totalAccesses: totalCount,
            mobile: {
                count: mobileCount,
                percentage: `${mobilePercentage}%`
            },
            desktop: {
                count: desktopCount,
                percentage: `${desktopPercentage}%`
            }
        };
    })
    .then((responseData) => {
        // Send successful response
        res.status(200).json({ 
            status: true, 
            data: responseData 
        });
    })
    .catch((error) => {
        console.error('Error retrieving device accesses:', error);
        res.status(500).json({ 
            status: false, 
            error: 'Failed to retrieve device accesses' 
        });
    });
}

// Device access trend over time
const getDeviceAccessOverTime = (req, res) => {
  const { interval = "day" } = req.query; // default daily, can extend later

  let dateFormat;
  if (interval === "day") dateFormat = "%Y-%m-%d";
  else if (interval === "month") dateFormat = "%Y-%m";
  else dateFormat = "%Y-%m-%d"; // fallback

  DeviceAccess.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: dateFormat, date: "$accessedAt" } },
          deviceType: "$deviceType"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        devices: {
          $push: {
            deviceType: "$_id.deviceType",
            count: "$count"
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ])
    .then(results => {
      // Transform data into recharts-friendly format
      const formatted = results.map(item => {
        const row = { name: item._id, mobile: 0, desktop: 0 };
        item.devices.forEach(d => {
          row[d.deviceType] = d.count;
        });
        return row;
      });

      res.json({ status: true, data: formatted });
    })
    .catch(err => {
      console.error("Error retrieving device access over time:", err);
      res.status(500).json({ status: false, error: "Server error" });
    });
};

export { addDeviceAccess, getDeviceAccess, getDeviceAccessOverTime };
