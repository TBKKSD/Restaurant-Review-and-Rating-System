import { useState } from "react";

export default function ImageUploader({ image, setImage }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "10px",
        padding: "30px",
        textAlign: "center",
        cursor: "pointer",
        background: "#fafafa",
        marginBottom: "15px"
      }}
    >
      {!preview ? (
        <>
          <p>📷 Drag & drop restaurant image here</p>
          <p>or</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ marginTop: "10px" }}
          />
        </>
      ) : (
        <>
            <div
                style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px"
                }}
            >
                <img
                src={preview}
                alt="preview"
                style={{
                    width: "200px",
                    borderRadius: "10px"
                }}
                />

                <button
                onClick={removeImage}
                style={{
                    background: "#ff4d4d",
                    border: "none",
                    padding: "8px 14px",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
                >
                Remove Image
                </button>
            </div>
            </>
      )}
    </div>
  );
}