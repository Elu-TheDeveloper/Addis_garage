import React, { useEffect, useState } from 'react';
import AdminMenu from '../../../components/AdminMenu/AdminMenu';
import Vehicleform from '../../../components/Admin/VehicleForm/VehicleForm';
import { useParams, Link } from 'react-router-dom';
import customerService from '../../../../Services/customer.service';
import { useAuth } from '../../../../context/AuthContext';
import { FaEdit } from 'react-icons/fa';

const Vehicle = () => {
  const [customerinfo, setCustomerInfo] = useState(null);
  const [addvehicle, setVehicle] = useState(false);
  const [table, setTable] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const { employee } = useAuth();
  const { id } = useParams();

  const token = employee?.employee_token;



  const circleStyle = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
    color: 'white',
    display: 'inline-block',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '100px',
    position: 'relative',
    zIndex: '100',
  };

  const singleCustomerData = async () => {
    if (!id || !token) {
      console.warn('Missing id or token', { id, token });
      setError('Missing customer ID or authentication token');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setOrdersError(null);

    try {
      const data = await customerService.singleCustomer(id, token);
      console.log('Customer API response:', JSON.stringify(data, null, 2));
      // Extract first customer from array
      const customerData = Array.isArray(data?.customer) ? data.customer[0] : data?.customer || data?.data?.customer || null;
      console.log('Extracted customer data:', JSON.stringify(customerData, null, 2));
      setCustomerInfo(customerData);

      // Fetch orders data
     try {
  const orders = await customerService.getCustomerOrderbyId(id, token);
  console.log('Orders API response:', JSON.stringify(orders, null, 2));
  setTable(orders); // <- keep only this line
} catch (orderError) {
  console.error('Error fetching orders:', orderError);
  setOrdersError(
    orderError.response?.status === 404
      ? 'No orders found for this customer'
      : 'Failed to get orders'
  );
  setTable([]);
}

    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError(error.response?.status === 404 ? 'Customer not found' : 'Failed to fetch customer information');
      setCustomerInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const searchFunction = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || !id || !token) {
      setSearchResult([]);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    try {
      console.log('Searching vehicles with query:', trimmedQuery);
      const response = await customerService.searchCustomerVehicles(id, token, trimmedQuery);
      console.log('Search API response:', JSON.stringify(response, null, 2));
      setSearchResult(Array.isArray(response) ? response : response?.data || []);
      setSearchError(null);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      setSearchError(error.response?.status === 404 ? 'No vehicles found for this search' : 'Failed to search vehicles');
      setSearchResult([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery && token) {
        searchFunction();
      } else {
        setSearchResult([]);
        setSearchError(null);
      }
    }, 300); // Debounce search
    return () => clearTimeout(handler);
  }, [searchQuery, token]);

  useEffect(() => {
    if (token && id) {
      singleCustomerData();
    }
  }, [token, id]);

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>

          <div className="col-md-9 admin-right-side d-flex" style={{ position: 'relative' }}>
            <div className="d-sm-none d-md-block">
              <div className="pl-2 pt-5 d-flex flex-column k">
                <div className="text-center bg-info my-5" style={circleStyle}>
                  Info
                </div>
                <div className="text-center bg-info my-5" style={circleStyle}>
                  Cars
                </div>
                <div className="text-center bg-warning my-5" style={circleStyle}>
                  Orders
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="contact-section row">
                <div className="auto-container col-md-10">
                  {loading ? (
                    <p>Loading customer information...</p>
                  ) : error ? (
                    <div>
                      <p className="text-danger">{error}</p>
                      <button onClick={singleCustomerData} className="theme-btn btn-style-one">
                        Retry
                      </button>
                    </div>
                  ) : customerinfo ? (
                    <>
                      <div className="customer-vehicle">
                        <h2>
                          Customer: {customerinfo.customer_first_name || customerinfo.customer_email || 'Unknown Customer'}
                          {customerinfo.customer_last_name ? ` ${customerinfo.customer_last_name}` : ''}
                        </h2>
                      </div>
                      <div className="v_info">
                        <p>
                          <span className="v_title">Email</span>:{' '}
                          <span>{customerinfo.customer_email || 'N/A'}</span>
                        </p>
                        <p>
                          <span className="v_title">Phone No</span>:{' '}
                          <span>{customerinfo.customer_phone_number || 'N/A'}</span>
                        </p>
                        {customerinfo.active_customer_status !== undefined && (
                          <p>
                            <span className="v_title">Active Customer</span>:{' '}
                            <span>{customerinfo.active_customer_status ? 'Yes' : 'No'}</span>
                          </p>
                        )}
                        <p>
                          <span className="v_title">Edit Customer Info</span>:{' '}
                          <Link to={`/admin/edit-customer/${id}`}>
                            <FaEdit size={20} />
                          </Link>
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>No customer information available.</p>
                  )}
                </div>
              </div>

              <div className="contact-section row pad">
                <div className="auto-container col-md-10">
                  <div className="contact-title mrg">
                    <h2>Vehicles of {customerinfo?.customer_first_name || customerinfo?.customer_email || 'Customer'}</h2>
                    <div className="contact-form">
                      <div className="row clearfix">
                        <div className="form-group col-md-12 search">
                          <input
                            type="text"
                            name="vehicle-model"
                            placeholder="Search for vehicle"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            required
                          />
                        </div>
                        {searchLoading ? (
                          <p>Searching vehicles...</p>
                        ) : searchError ? (
                          <p className="text-danger">{searchError}</p>
                        ) : searchQuery && searchResult.length > 0 ? (
                          <div className="table-responsive rounded-3 fs">
                            <table className="table table-striped table-bordered table-hover border">
                              <thead className="table-info text-white">
                                <tr>
                                  <th>Vehicle Make</th>
                                  <th>Vehicle Model</th>
                                  <th>Vehicle Tag</th>
                                  <th>Vehicle Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                {searchResult.map((search) => (
                                  <tr key={search.vehicle_id}>
                                    <td>{search.vehicle_make}</td>
                                    <td>{search.vehicle_model}</td>
                                    <td>{search.vehicle_tag}</td>
                                    <td>{search.vehicle_type}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : searchQuery ? (
                          <p>No vehicles found.</p>
                        ) : null}
                      </div>
                    </div>

                    {!addvehicle && (
                      <div className="form-group col-md-10" style={{ paddingLeft: '0' }}>
                        <button
                          className="theme-btn btn-style-one"
                          type="submit"
                          data-loading-text="Please wait..."
                          onClick={() => setVehicle(!addvehicle)}
                        >
                          <span>ADD NEW VEHICLE</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {addvehicle && <Vehicleform id={id} v={{ addvehicle, setVehicle }} />}

              <div className="table-responsive rounded-3 fs">
                {ordersError && <p className="text-danger">{ordersError}</p>}
                <table className="table table-striped table-bordered table-hover border">
                  <thead className="table-info text-white">
                    <tr>
                      <th>Order Date</th>
                      <th>Rec By</th>
                      <th>Vehicle</th>
                      <th>ECD</th>
                      <th>Order Status / Link</th>
                      <th>Price</th>
                      <th>Service</th>
                    </tr>
                  </thead>
                  <tbody>
                   {table.length > 0 ? (
  table.map((order, index) => (
    <tr key={order.order_id ?? order.customer_id ?? `order-${index}`}>
      <td>{customerService.formatDate(order?.order_date) || 'N/A'}</td>
      <td>
        {`${order?.employee_first_name || ''} ${order?.employee_last_name || ''}`}
      </td>
      <td>{order?.vehicle_serial || order?.vehicle_make || 'N/A'}</td>
      <td>{customerService.formatDate(order?.estimated_completion_date) || 'N/A'}</td>
      <td>{order?.order_hash || 'N/A'}</td>
      <td>{order?.order_total_price || 'N/A'}</td>
      <td>{order?.service_name || 'N/A'}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7" className="text-center">
      {ordersError || 'No orders found.'}
    </td>
  </tr>
)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicle;