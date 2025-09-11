import React, { useState, useEffect } from "react";
import "./orderDetail.css";
import { useParams } from "react-router-dom";
import ordersService from "../../../../Services/order.service";
import { useAuth } from "../../../../context/AuthContext";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { employee } = useAuth();
  const token = employee?.employee_token;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        console.error("Token is not available");
        return;
      }
      try {
        const fetchedOrder = await ordersService.getOrderDetailById(token, id);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, id]);

  const formatMileage = (mileage) => {
    return mileage?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  // Determine overall progress status
  const overallStatus = order.services.every((s) => s.service_completed === 1)
    ? "Completed"
    : order.services.some((s) => s.service_completed === 0)
    ? "In Progress"
    : "Received";

  return (
    <div className="order-detail-container">
      <div className="order-detail-card">
        <div
          className={`status-box-inline highlight overall-status-${overallStatus
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <h6 className="overallstatus">{overallStatus}</h6>
        </div>

        <div className="sec-title style-two order_customer_name red-bottom-border">
          <h2>
            {order.customerFirstName} {order.customerLastName}
          </h2>
          <div className="text">
            This page provides the current status of the order. It will be
            updated regularly to reflect the progress of the work. Once the
            order is completed, the status will turn green, indicating that the
            car is ready for the next step in processing.
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 service-block-one">
            <div className="inner-boxx hvr-float-shadow">
              <h5>CUSTOMER</h5>
              <h2>
                {order.customerFirstName} {order.customerLastName}
              </h2>
              <div>Email: {order.customerEmail}</div>
              <div>Phone Number: {order.customerPhoneNumber}</div>
              <div>
                Active Customer: {order.customerActiveStatus ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <div className="col-lg-6 service-block-one">
            <div className="inner-boxx hvr-float-shadow">
              <h5>CAR IN SERVICE</h5>
              <h2>
                {order.vehicleModel} <span>({order.vehicleColor})</span>
              </h2>
              <div>Vehicle tag: {order.vehicleTag}</div>
              <div>Vehicle year: {order.vehicleYear}</div>
              <div>Vehicle mileage: {formatMileage(order.vehicleMileage)}</div>
            </div>
          </div>
        </div>

        <div className="order_details">
          <h5>{order.vehicleModel}</h5>
          <h2>Requested Service</h2>
          {order.services.map((service, index) => (
            <div key={index} className="order_detail_items">
              <div className="requested_service">
                <h2>{service.service_name}</h2>
                <p>{service.service_description}</p>
                <div
                  className={`status-box ${
                    service.service_completed === 0
                      ? "status-in-progress"
                      : service.service_completed === 1
                      ? "status-completed"
                      : "status-received"
                  }`}
                >
                  <h6>
                    {service.service_completed === 0
                      ? "In Progress"
                      : service.service_completed === 1
                      ? "Completed"
                      : "Received"}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
