import React, { useState, useRef } from "react";
import axios from "axios";
import "./CarouselUploader.css";
import { FiUploadCloud, FiX } from "react-icons/fi";

const CarouselUploader = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please select up to 3 images");

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("http://localhost:4000/api/carousel/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Images uploaded successfully!");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      alert("Failed to upload images: " + err.message);
    }
  };

  return (
    <form className="carou" onSubmit={handleUpload}>
      <div
        className="custom-file-upload"
        onClick={() => fileInputRef.current.click()}
      >
        <FiUploadCloud className="upload-icon" />
        <p className="upload-text">Click to upload images</p>
        <p className="upload-hint">Supports JPG, PNG up to 3 images</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      {previews.length > 0 && (
        <div className="preview-container">
          {previews.map((item, index) => (
            <div key={index} className="preview-item">
              <img src={item.preview} alt={`Preview ${index}`} className="preview-image" />
              <button
                type="button"
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="caru3" type="submit" disabled={images.length === 0}>
        Upload Images
      </button>
    </form>
  );
};

export default CarouselUploader;
