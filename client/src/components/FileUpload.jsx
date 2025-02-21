import React, { useState, useRef } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError('');
      setUploadedUrl('');
      setProgress(0);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setUploadedUrl('');
    setProgress(0);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const completed = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(completed);
        },
      });
      setUploadedUrl(response.data.url);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while uploading the file.");
      }
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '20px' }}>Upload</h1>

      <div
        style={{
          border: '2px dashed #ccc',
          padding: '40px',
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
        }}
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div style={{ marginBottom: '10px', fontSize: '40px' }}>☁</div>
        <p style={{ margin: '0' }}>
          Drag & drop files or <span style={{ color: '#007bff', textDecoration: 'underline' }}>Browse</span>
        </p>
        <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
          Supported formats: JPEG, PNG, GIF
        </p>
      </div>

      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />

      {file && !uploadedUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0 }}>File to upload: {file.name}</p>
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0 }}>Uploading - {progress}%</p>
          <div style={{ background: '#eee', height: '10px', width: '100%', borderRadius: '5px' }}>
            <div
              style={{
                background: '#007bff',
                height: '10px',
                width: `${progress}%`,
                borderRadius: '5px',
              }}
            ></div>
          </div>
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0 }}>Uploaded - 1/1 files</p>
          <div
            style={{
              border: '1px solid #28a745',
              padding: '8px',
              borderRadius: '4px',
              display: 'inline-block',
              marginTop: '10px',
            }}
          >
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#28a745' }}
            >
              {file ? file.name : 'File'}
            </a>
            <button
              style={{
                marginLeft: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#dc3545',
              }}
              onClick={() => {
                setUploadedUrl('');
                setFile(null);
                setProgress(0);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
      )}

      <button
        onClick={handleUpload}
        style={{
          background: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        UPLOAD FILES
      </button>
    </div>
  );
}

export default FileUpload;
