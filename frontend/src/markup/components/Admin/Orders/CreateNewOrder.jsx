import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import customerService from '../../../../services/customer.service';
import vehicleService from '../../../../Services/vehicle.service';
import serviceService from '../../../../Services/service.service';
import { useAuth } from '../../../../context/AuthContext';
import './CreateNewOrder.css';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { FaEdit } from 'react-icons/fa';

const api_url = import.meta.env.VITE_API_URL;

function CreateNewOrder() {
  const { employee } = useAuth();
  const token = employee?.employee_token;
  const employee_id = employee?.employee_id;
  const { ID, vID } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceDescription, setServiceDescription] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderTotalPrice, setOrderTotalPrice] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  console.log('Params:', { ID, vID });
  console.log('Token:', token);
  console.log('API URL:', api_url);

  const getServiceList = async () => {
    try {
      setIsLoadingServices(true);
      const data = await serviceService.getServiceList();
      setServices(data.data);
    } catch (error) {
      setErrorMessage('Failed to fetch services. Please try again.');
      console.error('Error fetching services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchSingleCustomerData = async () => {
    if (!token) {
      setErrorMessage('Authentication token is missing. Please log in.');
      navigate('/login');
      return;
    }
    try {
      const data = await customerService.singleCustomer(ID, token);
      setCustomerInfo(data.customer);
    } catch (error) {
      setErrorMessage('Failed to fetch customer information.');
      console.error('Error fetching customer:', error);
    }
  };

  const fetchVehicleInfo = async () => {
    if (!vID) {
      setErrorMessage('Vehicle ID is missing. Please select a vehicle.');
      setIsLoadingVehicle(false);
      return;
    }
    if (!token) {
      setErrorMessage('Authentication token is missing. Please log in.');
      navigate('/login');
      return;
    }
    try {
      setIsLoadingVehicle(true);
      const response = await vehicleService.getVehicleInfo(vID, token);
      setVehicleInfo(response);
    } catch (error) {
      setErrorMessage('Failed to fetch vehicle information: ' + error.message);
      console.error('Error fetching vehicle:', error);
    } finally {
      setIsLoadingVehicle(false);
    }
  };

  useEffect(() => {
    getServiceList();
    fetchSingleCustomerData();
    fetchVehicleInfo();
  }, [ID, vID, token]);

  const handleServiceSelection = (service_id) => {
    setSelectedServices((prevServices) =>
      prevServices.includes(service_id)
        ? prevServices.filter((id) => id !== service_id)
        : [...prevServices, service_id]
    );
  };

  const calculateOrderDescription = () => {
    return selectedServices
      .map((serviceId) => {
        const service = services.find((s) => s.service_id === serviceId);
        return service ? service.service_description : '';
      })
      .filter(Boolean)
      .join(' ');
  };

  useEffect(() => {
    setOrderDescription(calculateOrderDescription());
  }, [selectedServices]);

  const handleOrderTotalPriceChange = (e) => {
    setOrderTotalPrice(e.target.value);
  };

  const handleEstimatedCompletionDateChange = (event) => {
    setEstimatedCompletionDate(event.target.value);
  };

  const handleOrderDescriptionChange = (e) => {
    setOrderDescription(e.target.value);
  };

  const handleAdditionalRequest = (e) => {
    setServiceDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!customerInfo || !vehicleInfo) {
      setErrorMessage('Customer or vehicle information is missing.');
      return;
    }
    const requestBody = {
      employee_id,
      customer_id: customerInfo.customer_id,
      vehicle_id: vehicleInfo.vehicle_id,
      active_order: 2,
      order_description: orderDescription,
      estimated_completion_date: estimatedCompletionDate,
      completion_date: null,
      order_completed: 0,
      order_status: 3,
      order_total_price: orderTotalPrice,
      additional_request: serviceDescription,
      order_services: selectedServices.map((serviceId) => ({
        service_id: serviceId,
        service_completed: false,
      })),
    };
    try {
      const response = await fetch(`${api_url}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNotification('Order successfully submitted');
      setTimeout(() => navigate('/admin/orders'), 2000);
    } catch (error) {
      setErrorMessage('Error submitting order: ' + error.message);
      console.error('Error submitting order:', error);
    }
  };

  const handleCloseModal = () => {
    setNotification('');
    navigate('/admin/orders');
  };

  const handleEditCustomerClick = () => {
    navigate(`/admin/edit-customer/${customerInfo?.customer_id}`);
  };

  const handleEditVehicleClick = () => {
    navigate(`/admin/edit-vehicle/${vehicleInfo?.vehicle_id}`);
  };

  const handleRedirectVehicle = () => {
    navigate(`/admin/order-single/${ID}`);
  };

  const handleRedirectCustomer = () => {
    navigate(`/admin/create-order`);
  };

  const handleClickOut = (event) => {
    if (event.target.classList.contains('notification_main')) {
      setNotification('');
      navigate('/admin/orders');
    }
  };

  const handleNotificationButtonClick = () => {
    setNotification('');
    navigate('/admin/orders');
  };

  return (
    <div className="create-order-container">
      {notification && (
        <div onClick={handleClickOut} className="notification_main">
          <div className="notification">
            {notification} <br />
            <button onClick={handleNotificationButtonClick}>Ok</button>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="contact-section pad_1">
        <div className="contact-title mb-1">
          <h2>Create a new order</h2>
        </div>
      </div>
      {customerInfo ? (
        <div className="CustomerInfo">
          <div className="CustomerInfo_two">
            <div>
              <h2 className="customer_name">
                {customerInfo.customer_first_name}{' '}
                <span>{customerInfo.customer_last_name}</span>
              </h2>
            </div>
            <div>
              <CancelPresentationIcon onClick={handleRedirectCustomer} className="icon" />
            </div>
          </div>
          <p>
            <span className="label customer_label_info">Email:</span>{' '}
            <span className="value customer_label_value">{customerInfo.customer_email}</span>
          </p>
          <p>
            <span className="label customer_label_info">Phone Number:</span>{' '}
            <span className="value customer_label_value">{customerInfo.customer_phone_number}</span>
          </p>
          <p>
            <span className="label customer_label_info">Active Customer:</span>{' '}
            <span className="value customer_label_value">
              {customerInfo.active_customer_status ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            <span className="label customer_label_info">Edit customer info:</span>{' '}
            <Link to={`/admin/edit-customer/${customerInfo.customer_id}`}>
              <FaEdit className="icon" size={20} />
            </Link>
          </p>
        </div>
      ) : (
        <p>Loading customer information...</p>
      )}
      {isLoadingVehicle ? (
        <p>Loading vehicle information...</p>
      ) : vehicleInfo ? (
        <div className="VehicleInfo">
          <h2 className="customer_name">
            {vehicleInfo.vehicle_make}
            <CancelPresentationIcon onClick={handleRedirectVehicle} className="icon" />
          </h2>
          <p>
            <span className="label customer_label_info">Vehicle color:</span>{' '}
            <span className="value customer_label_value">{vehicleInfo.vehicle_color}</span>
          </p>
          <p>
            <span className="label customer_label_info">Vehicle tag:</span>{' '}
            <span className="value customer_label_value">{vehicleInfo.vehicle_tag}</span>
          </p>
          <p>
            <span className="label customer_label_info">Vehicle Year:</span>{' '}
            <span className="value customer_label_value">{vehicleInfo.vehicle_year}</span>
          </p>
          <p>
            <span className="label customer_label_info">Vehicle Mileage:</span>{' '}
            <span className="value customer_label_value">{vehicleInfo.vehicle_mileage}</span>
          </p>
          <p>
            <span className="label customer_label_info">Vehicle serial:</span>{' '}
            <span className="value customer_label_value">{vehicleInfo.vehicle_serial}</span>
          </p>
          <p>
            <span className="label customer_label_info">Edit Vehicle info:</span>{' '}
            <Link to={`/admin/edit-vehicle/${vehicleInfo.vehicle_id}`}>
              <FaEdit className="icon" size={20} />
            </Link>
          </p>
        </div>
      ) : (
        <p>Error loading vehicle information. Please check the vehicle ID.</p>
      )}
      <div className="service_list_container">
        <div className="services-list">
          <h2 className="customer_name v_font">Choose service</h2>
          {isLoadingServices ? (
            <p>Loading services...</p>
          ) : services?.length > 0 ? (
            services.map((service) => (
              <div key={service.service_id} className="service-item">
                <div className="service-d w-100">
                  <div>
                    <h3 className="service_font">{service?.service_name}</h3>
                    <p>{service?.service_description}</p>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.service_id)}
                      onChange={() => handleServiceSelection(service.service_id)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No services available</p>
          )}
        </div>
      </div>
      <div className="additional-requests">
        <div className="contact-section pad_1" style={{ background: '#fff' }}>
          <div className="contact-title mb-1">
            <h2 style={{ fontSize: '32px' }}>Additional requests</h2>
          </div>
        </div>
        <div className="serviceRequest">
          <input
            className="w-100"
            type="text"
            style={{ paddingLeft: '15px' }}
            placeholder="Service Description"
            value={serviceDescription}
            onChange={handleAdditionalRequest}
          />
        </div>
        <div className="price">
          <input
            className="w-100"
            type="text"
            style={{ padding: '10px 15px' }}
            placeholder="Price"
            value={orderTotalPrice}
            onChange={handleOrderTotalPriceChange}
          />
        </div>
        <div className="price">
          <input
            className="w-100"
            type="text"
            style={{ padding: '10px 15px' }}
            placeholder="Order Description"
            value={orderDescription}
            onChange={handleOrderDescriptionChange}
          />
        </div>
        <div className="py-2 px-3">
          <label>
            <span className="v_font">Expected Completion Date:</span>
            <input
              type="datetime-local"
              value={estimatedCompletionDate}
              onChange={handleEstimatedCompletionDateChange}
            />
          </label>
        </div>
        <div className="submit mt-3 mb-5">
          <button className="submit-order" onClick={handleSubmit}>
            SUBMIT ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewOrder;