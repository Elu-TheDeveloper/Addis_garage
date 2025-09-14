import React, { useState, useEffect } from 'react';
import './ServiceList.css';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import serviceService from '../../../../Services/service.service'; // Import service module

const ServiceList = () => {
  const [newService, setNewService] = useState({ service_name: '', service_description: '' });
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

 const loadServices = async () => {
  setIsLoading(true);
  try {
    const servicesArray = await serviceService.getServiceList(); // already returns array
    console.log("services response:", servicesArray);

    setServices(Array.isArray(servicesArray) ? servicesArray : []);
    if (servicesArray.length === 0) {
      console.warn("No services returned from API");
    }
  } catch (err) {
    console.error("Error loading services:", err);
    setServices([]);
    setErrorMessage(`Failed to load services: ${err.message}`);
    setShowErrorModal(true);
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleDelete = async () => {
    try {
      await serviceService.deleteService(serviceToDelete.service_id);
      setServices(services.filter(service => service.service_id !== serviceToDelete.service_id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
      setSuccessMessage("Service deleted successfully");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting service:", error);
      setErrorMessage(`Error deleting service: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  const handleEdit = (id) => {
    const serviceToEdit = services.find(service => service.service_id === id);
    setNewService({ 
      service_name: serviceToEdit.service_name, 
      service_description: serviceToEdit.service_description 
    });
    setCurrentServiceId(id);
    setIsEditing(true);
    navigate('/admin/services#update');
  };

 const handleSaveEdit = async (e) => {
  e.preventDefault();
  if (!newService.service_name.trim() || !newService.service_description.trim()) {
    setErrorMessage("Service name and description are required");
    setShowErrorModal(true);
    return;
  }
  try {
    // pass arguments correctly
    const updated = await serviceService.updateService(
      currentServiceId,
      newService.service_name,
      newService.service_description
    );

    const updatedServiceData = updated.data || updated;

   setServices(
  services.map((service) =>
    service.service_id === currentServiceId
      ? { ...service, ...newService } // merge only changed fields
      : service
  )
);


    setNewService({ service_name: "", service_description: "" });
    setIsEditing(false);
    setCurrentServiceId(null);
    setSuccessMessage("Service updated successfully");
    setShowSuccessModal(true);
  } catch (error) {
    console.error("Error updating service:", error);
    setErrorMessage(`Error updating service: ${error.message}`);
    setShowErrorModal(true);
  }
};
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.service_name.trim() || !newService.service_description.trim()) {
      setErrorMessage("Service name and description are required");
      setShowErrorModal(true);
      return;
    }
    try {
      const created = await serviceService.createService(newService);
      const newServiceData = created.data || created;
      setServices([...services, newServiceData]);
      setNewService({ service_name: "", service_description: "" });
      setSuccessMessage("Service added successfully");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding service:", error);
      setErrorMessage(`Error adding service: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  const handleShowDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setServiceToDelete(null);
    setShowDeleteModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="service-management">
        <div className="contact-section pad_1">
          <div className="contact-title mb-1">
            <h2 style={{ color: "#08194A" }}>Services we provide</h2>
          </div>
        </div>

        <p className="description">
          At Abe Garage, we are committed to delivering top-notch automotive care that keeps your vehicle performing at its best. Our comprehensive range of services is designed to address every aspect of your car’s maintenance and repair needs. Explore our services below to see how we can help you keep your car in peak condition.
        </p>

        <div className="services-list">
          {isLoading ? (
            <p>Loading services...</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div key={service.service_id} className="service-item py-4">
                <div className="service-details">
                  <h3 className="v_font" style={{ color: "#08194A" }}>{service.service_name}</h3>
                  <p>{service.service_description}</p>
                </div>
                <div className="service-actions">
                  <button onClick={() => handleEdit(service.service_id)}>
                    <a href="#update" style={{ color: "#ff6666" }}>
                      <FaEdit size={20} />
                    </a>
                  </button>
                  <button onClick={() => handleShowDeleteModal(service)}>
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>

        <div className="additional-requests" style={{ paddingBottom: "40px", marginTop: "20px" }} id="update">
          <div className="contact-section pad_1" style={{ background: "#fff" }}>
            <div className="contact-title mb-1">
              <h2 style={{ fontSize: "32px" }}>
                {!isEditing ? "Add a new Service" : "Update a Service"}
              </h2>
            </div>
          </div>

          <form onSubmit={isEditing ? handleSaveEdit : handleAddService}>
            <div className="price">
              <input
                type="text"
                style={{ padding: "10px 15px" }}
                placeholder="Service name"
                className="w-100"
                name="service_name"
                value={newService.service_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="serviceRequest">
              <input
                type="text"
                style={{ paddingLeft: "15px" }}
                className="w-100"
                name="service_description"
                value={newService.service_description}
                onChange={handleInputChange}
                placeholder="Service Description"
                required
              />
            </div>

            {isEditing ? (
              <div className="form-group col-md-12 d-flex gap-5 mt-3">
                <button type="submit" className="theme-btn btn-style-one">Update Service</button>
                <button
                  type="button"
                  style={{ background: "#08194A" }}
                  className="theme-btn btn-style-one"
                  onClick={() => {
                    setIsEditing(false);
                    setNewService({ service_name: "", service_description: "" });
                    setCurrentServiceId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="form-group col-md-12">
                <button className="theme-btn btn-style-one" type="submit">ADD SERVICE</button>
              </div>
            )}
          </form>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseErrorModal}>OK</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{serviceToDelete?.service_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ServiceList;