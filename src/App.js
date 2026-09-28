import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setSelectedPhoto(null);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    const newPhotos = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    setPhotos([...newPhotos, ...photos]);
    e.target.value = '';
  }

  function deletePhoto(id) {
    const photo = photos.find((p) => p.id === id);
    URL.revokeObjectURL(photo.url);
    setPhotos(photos.filter((p) => p.id !== id));
  }

  return (
    <div className="app">
      <h1>Photo Gallery</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFiles}
        style={{ display: 'none' }}
      />
      <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
        + Add Photos
      </button>

      {photos.length === 0 ? (
        <p className="empty-state">No photos yet. Add some!</p>
      ) : (
        <div className="grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img
                src={photo.url}
                alt={photo.name}
                onClick={() => setSelectedPhoto(photo)}
              />
              <button className="delete-btn" onClick={() => deletePhoto(photo.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.name}
            onClick={(e) => e.stopPropagation()}
          />
          <p>{selectedPhoto.name}</p>
        </div>
      )}
    </div>
  );
}

export default App;