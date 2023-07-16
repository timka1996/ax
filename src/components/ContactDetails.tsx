import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ContactDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setContact(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  if (isLoading) {
    return <div>Loading contact...</div>;
  }

  return (
    <div>
      <h1>Contact Details</h1>
      <div>
        <h3>{contact.name}</h3>
        <p>Phone: {contact.phone}</p>
        <p>Email: {contact.email}</p>
        <Link to="/" className="btn btn-primary">
          Back to Contact List
        </Link>
      </div>
    </div>
  );
};

export default ContactDetails;
