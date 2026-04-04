import React, { useState } from "react";

import API from "../api"; 
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cuisine, setCuisine] = useState("");

  const cuisineOptions = [
    "Japanese", "Italian", "Thai", "Chinese", "American", 
    "Mexican", "Indian", "Korean", "Vietnamese", "Other"
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", image);
      formData.append("cuisine", cuisine);

      
      await API.post("/restaurants", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/restaurants");
    } catch (err) {
      console.error("Create restaurant error:", err.response?.data || err.message);
      alert("Failed to create restaurant. Check console for details.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "500px", background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 6px 14px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px" }}>➕ Add New Restaurant</h2>

        <form onSubmit={handleSubmit}>
          <label>Restaurant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "8px 0 16px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <label>Cuisine Type</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "8px 0 16px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select Cuisine</option>
            {cuisineOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: "10px", margin: "8px 0 16px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <label>Restaurant Image</label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: "2px dashed",
              borderColor: isDragging ? "#4CAF50" : "#ccc",
              background: isDragging ? "#f3fff3" : "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              marginBottom: "15px"
            }}
          >
            <p style={{ marginBottom: "10px", color: "#555" }}>Drag & drop an image here</p>
            <label style={{ display: "inline-block", padding: "8px 14px", background: "#2196F3", color: "white", borderRadius: "6px", cursor: "pointer" }}>
              Choose File
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>
          </div>

          {preview && (
            <img src={preview} alt="preview" style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }} />
          )}

          <button
            type="submit"
            style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", background: "#4CAF50", color: "white", fontSize: "16px", cursor: "pointer" }}
          >
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;