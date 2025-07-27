import DeviceAccess from '../models/deviceAccessModel.js';

const addDeviceAccess = (req, res) => {
    const { deviceType } = req.body;
    if (!['mobile', 'desktop'].includes(deviceType)) {
        return res.status(400).json({ status: false, error: 'Invalid device type' });
    }

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

export { addDeviceAccess, getDeviceAccess };
