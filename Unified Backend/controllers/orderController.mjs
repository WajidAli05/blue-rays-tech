import Order from "../models/orderModel.js";

const getOrders = (req, res) => {
    Order.find()
    .then(orders => {
        if(orders.length === 0){
            res.status(404).json({
                status: false,
                data: orders,
                message: "No order at the moment!"
            })
        }
        else{
            res.status(200).json({
                status: true,
                message: "Orders fetched successfully!",
                data: orders
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            status: false,
            message: err.message
        })
    })
}

const getOrderByUserId = (req, res) => {

}

const deleteOrderById = (req, res) => {
  const orderId = req.params.orderId;

  Order.findByIdAndDelete(orderId)
    .then((deletedOrder) => {
      if (!deletedOrder) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Order deleted successfully",
        data: deletedOrder,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    });
};

const totalAmountOfOrdersTillDate = (req, res) => {
  Order.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }, // number of paid orders
      },
    },
  ])
    .then(result => {
      if (result.length === 0) {
        return res.json({ totalAmount: 0, count: 0, averageOrderValue: 0 });
      }

      const totalAmount = result[0].totalAmount;
      const count = result[0].count;
      const averageOrderValue = count > 0 ? totalAmount / count : 0;

      res.json({
        totalAmount,
        count,
        averageOrderValue,
      });
    })
    .catch(err => {
      console.error("Error calculating total amount of orders:", err.message);
      res.status(500).json({ error: "Server error" });
    });
};

const getOrderTrends = (req, res) => {
  const { interval } = req.query; // "day" or "week"

  let groupFormat;
  if (interval === "week") {
    groupFormat = { $dateToString: { format: "%Y-%U", date: "$createdAt" } }; // Year-WeekNumber
  } else {
    groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }; // Default = daily
  }

  Order.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: groupFormat,
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .then((result) => {
      const formatted = result.map((item) => ({
        name: item._id, // e.g. "2025-09-20" or "2025-38"
        orders: item.orders,
      }));

      res.json(formatted);
    })
    .catch((err) => {
      console.error("Error getting order trends:", err.message);
      res.status(500).json({ error: "Server error" });
    });
};

export {
    getOrders,
    getOrderByUserId,
    deleteOrderById,
    totalAmountOfOrdersTillDate,
    getOrderTrends
}