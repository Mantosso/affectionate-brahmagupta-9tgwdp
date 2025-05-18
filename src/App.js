// App.js
import React, { useState, useEffect } from 'react';
import LabelStudioWrapper from './LabelStudioWrapper';
import { getArchives, uploadArchive, getArchiveTask } from './api';
import './style.css';

const App = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [task, setTask] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const data = await getArchives();
      setArchives(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadArchive(file, metadata);
      await fetchArchives(); // Refresh the list after upload
      setMetadata({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleArchiveClick = async (archive) => {
    if (archive.status !== 'выполнено') return;
    
    try {
      setSelectedArchive(archive);
      const taskData = await getArchiveTask(archive.id);
      setTask(taskData);
    } catch (err) {
      setError(err.message);
      setSelectedArchive(null);
    }
  };

  const handleExitLabelStudio = () => {
    setSelectedArchive(null);
    setTask(null);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  if (selectedArchive && task) {
    return <LabelStudioWrapper task={task} onExit={handleExitLabelStudio} />;
  }

  return (
    <div className="app">
      <h1 className="main-title">Система разметки изображений</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="content-wrapper">
        <div className="archives-section">
          <h2 className="section-title">Архивы для разметки</h2>
          <div className="section-content">
            {loading ? (
              <div className="no-archives">Загрузка...</div>
            ) : archives.length === 0 ? (
              <div className="no-archives">Нет доступных архивов</div>
            ) : (
              <div className="archives-container">
                <ul className="archives-list">
                  {archives.map((archive, index) => (
                    <li 
                      key={archive.id}
                      className={`archive-item clickable ${archive.status === 'выполнено' ? '' : 'disabled'}`}
                      onClick={() => handleArchiveClick(archive)}
                    >
                      <span className="archive-number">{index + 1}</span>
                      <span className="archive-name">{archive.name}</span>
                      <span className="archive-time">
                        {new Date(archive.createdAt).toLocaleString()}
                      </span>
                      <span className={`archive-status status-${archive.status.toLowerCase()}`}>
                        {archive.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="upload-section">
          <h2 className="section-title">Загрузка нового архива</h2>
          <div className="section-content">
            <label htmlFor="archive-upload" className="upload-button shine-effect">
              {uploading ? 'Загрузка...' : 'Выбрать архив'}
            </label>
            <input
              id="archive-upload"
              type="file"
              accept=".zip,.rar,.7z"
              onChange={handleFileUpload}
              disabled={uploading}
            />

            <div className="form-section">
              <h3 className="form-title">Метаданные архива</h3>
              <div className="form-group">
                <label htmlFor="name">Название архива</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={metadata.name}
                  onChange={handleMetadataChange}
                  className="input-effect"
                  placeholder="Введите название"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Описание</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={metadata.description}
                  onChange={handleMetadataChange}
                  className="input-effect"
                  placeholder="Введите описание"
                />
              </div>
              <button 
                className="submit-button pulse-effect" 
                onClick={() => document.getElementById('archive-upload').click()}
                disabled={uploading}
              >
                {uploading ? 'Загрузка...' : 'Загрузить архив'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
