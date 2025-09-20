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

export {
    getOrders,
    getOrderByUserId,
    deleteOrderById
}