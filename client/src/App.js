import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchName, setSearchName] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  // ================================
  // Search Image
  // ================================
  const fetchImage = () => {
    if (!searchName.trim()) {
      setSearchMessage("Please enter a name");
      return;
    }

    setSearchMessage("");

    fetch(`http://localhost:5000/api/getImage?name=${searchName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          // Add cache-busting query to force browser reload
          setImageUrl(`http://localhost:5000${data.url}?t=${Date.now()}`);
          setSearchMessage("");
        } else {
          setImageUrl(null);
          setSearchMessage("Image not found");
        }
      })
      .catch(() => {
        setImageUrl(null);
        setSearchMessage("Error fetching image");
      });
  };

  // ================================
  // Upload Image
  // ================================
  const uploadImage = () => {
    if (!uploadName.trim()) {
      setUploadMessage("Please enter a name before uploading");
      return;
    }
    if (!selectedFile) {
      setUploadMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:5000/api/upload?name=${uploadName}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUploadMessage("Uploaded successfully!");
          setSelectedFile(null);
          setUploadName("");
          // Show uploaded image immediately if it matches current search
          if (searchName === uploadName) {
            setImageUrl(`http://localhost:5000${data.url}?t=${Date.now()}`);
            setSearchMessage("");
          }
        } else {
          setUploadMessage("Upload failed");
        }
      })
      .catch(() => setUploadMessage("Upload error"));
  };

  return (
    <div className="container">
      <h2>Search Image</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={fetchImage}>Search</button>
      <p style={{ color: "red" }}>{searchMessage}</p>
      {imageUrl && (
        <div className="image-box">
          <img src={imageUrl} alt="Image" style={{ width: "200px" }} />
        </div>
      )}

      <hr />

      <h2>Upload Image</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={uploadName}
        onChange={(e) => setUploadName(e.target.value)}
      />
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>
      <p style={{ color: uploadMessage.includes("success") ? "green" : "red" }}>
        {uploadMessage}
      </p>
    </div>
  );
}

export default App;
