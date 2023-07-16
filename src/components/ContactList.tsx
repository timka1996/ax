import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactModal from "./ContactModal";

const ContactList = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setContacts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setContacts((prevContacts) =>
        prevContacts.filter((contact: any) => contact.id !== id)
      );
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const handleUpdateContact = (contact: any) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleModalSave = async (updatedContact: any) => {
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${updatedContact.id}`,
        updatedContact
      );
      setContacts((prevContacts: any[]) =>
        prevContacts.map((contact: any) =>
          contact.id === updatedContact.id
            ? { ...contact, ...updatedContact }
            : contact
        )
      );
      toast.success("Contact updated successfully");
      handleModalClose();
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const filteredContacts = contacts.filter((contact: any) => {
    return (
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  return (
    <div className="p-4">
      <h1>Contact List</h1>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      </div>
      {isLoading ? (
        <div>Loading contacts...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact: any) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateContact(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              {Array.from(
                {
                  length: Math.ceil(filteredContacts.length / contactsPerPage),
                },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pageNumber === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {selectedContact && (
        <ContactModal
          isOpen={isModalOpen}
          contact={selectedContact}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
};

export default ContactList;
