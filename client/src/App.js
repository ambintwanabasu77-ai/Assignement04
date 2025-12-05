import React, { useState } from "react";

function App() {
  const [characterName, setCharacterName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");


  const fetchImage = () => {
    if (!characterName) {
      setMessage("Please enter a character name");
      return;
    }

    fetch(`http://localhost:5000/api/getImage?name=${characterName.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setImageUrl(`http://localhost:5000${data.url}`);
          setMessage("");
        } else {
          setImageUrl(null);
          setMessage(data.error || "Image not found");
        }
      })
      .catch((err) => {
        setImageUrl(null);
        setMessage("Error fetching image");
        console.error(err);
      });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload new image
  const handleUpload = () => {
    if (!characterName) {
      setMessage("Please enter a character name");
      return;
    }
    if (!selectedFile) {
      setMessage("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:5000/api/upload?name=${characterName.toLowerCase()}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setSelectedFile(null);
          fetchImage(); // refresh image automatically
        } else {
          setMessage(data.error || "Upload failed");
        }
      })
      .catch((err) => {
        setMessage("Upload error");
        console.error(err);
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Character Image Search</h2>
      <input
        type="text"
        placeholder="Enter character name"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        style={{ padding: "8px", width: "60%" }}
      />
      <button onClick={fetchImage} style={{ padding: "8px 12px", marginLeft: "10px" }}>
        Search
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <img src={imageUrl} alt={characterName} style={{ maxWidth: "100%" }} />
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>Upload New Image</h2>
      <input
        type="text"
        placeholder="Enter character name"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        style={{ padding: "8px", width: "60%" }}
      />
      <br />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginTop: "10px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleUpload} style={{ padding: "8px 12px" }}>
        Upload
      </button>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default App;
