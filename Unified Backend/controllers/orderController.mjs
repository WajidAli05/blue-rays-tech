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

export {
    getOrders,
    getOrderByUserId,
    deleteOrderById,
    totalAmountOfOrdersTillDate
}