import React, { useState, useEffect } from "react";
import "./style.css";
import LabelStudioWrapper from "./LabelStudioWrapper";

function App() {
  const [archives, setArchives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [archiveName, setArchiveName] = useState("");
  const [formData, setFormData] = useState({
    journalNumber: "",
    diameter: "",
    thickness: "",
    brigadeCode: "",
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [showLabelStudio, setShowLabelStudio] = useState(false);

  const createMockImages = (archiveId) => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `${archiveId}-${i}`,
      url: `https://picsum.photos/seed/${archiveId}-${i}/800/600`,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();

    const newArchive = {
      id: Date.now(),
      fileName: archiveName || `Архив ${archives.length + 1}`,
      uploadTime: `${dateString} ${timeString}`,
      status: "Загрузка",
      images: createMockImages(Date.now()),
      ...formData,
    };

    setArchives([...archives, newArchive]);
    setShowForm(false);
    setArchiveName("");
    setFormData({
      journalNumber: "",
      diameter: "",
      thickness: "",
      brigadeCode: "",
    });

    setTimeout(() => {
      setArchives((prev) =>
        prev.map((a) =>
          a.id === newArchive.id ? { ...a, status: "Обработка" } : a
        )
      );
    }, 2000);

    setTimeout(() => {
      setArchives((prev) =>
        prev.map((a) =>
          a.id === newArchive.id ? { ...a, status: "Готово" } : a
        )
      );
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArchiveClick = (archive) => {
    if (archive.status !== "Готово") return;

    if (archive.images && archive.images.length > 0) {
      setCurrentTask({
        id: archive.id,
        data: {
          image: archive.images[0].url,
        },
        annotations: [],
        predictions: [],
      });
      setShowLabelStudio(true);
    }
  };

  if (showLabelStudio) {
    return (
      <LabelStudioWrapper
        task={currentTask}
        onExit={() => setShowLabelStudio(false)}
      />
    );
  }

  return (
    <div className="app">
      <h1 className="main-title">Система анализа сварных соединений</h1>

      <div className="content-wrapper">
        <div className="archives-section">
          <div className="section-content">
            <h2 className="section-title">Загруженные ранее архивы</h2>
            {archives.length === 0 ? (
              <p className="no-archives">Нет загруженных архивов</p>
            ) : (
              <div className="archives-container">
                <ul className="archives-list">
                  {archives.map((archive, index) => (
                    <li
                      key={archive.id}
                      className={`archive-item ${
                        archive.status === "Готово" ? "clickable" : ""
                      }`}
                      onClick={() =>
                        archive.status === "Готово" &&
                        handleArchiveClick(archive)
                      }
                    >
                      <span className="archive-number">{index + 1}.</span>
                      <span className="archive-name">{archive.fileName}</span>
                      <span className="archive-time">{archive.uploadTime}</span>
                      <span
                        className={`archive-status status-${archive.status.toLowerCase()}`}
                      >
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
          <div className="section-content">
            <h2 className="section-title">Выберите архив</h2>
            <input
              type="file"
              id="archive-upload"
              accept=".zip,.rar,.7z"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="archive-upload"
              className="upload-button pulse-effect"
            >
              Загрузить
            </label>

            {showForm && (
              <div className="form-section">
                <h3 className="form-title">Информация об архиве</h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label>Название архива:</label>
                    <input
                      type="text"
                      value={archiveName}
                      onChange={(e) => setArchiveName(e.target.value)}
                      required
                      className="input-effect"
                    />
                  </div>

                  <div className="form-group">
                    <label>Номер по журналу сварки:</label>
                    <input
                      type="text"
                      name="journalNumber"
                      value={formData.journalNumber}
                      onChange={handleInputChange}
                      required
                      className="input-effect"
                    />
                  </div>

                  <div className="form-group">
                    <label>Диаметр и толщина стенки трубы (мм):</label>
                    <input
                      type="text"
                      name="diameter"
                      value={formData.diameter}
                      onChange={handleInputChange}
                      required
                      className="input-effect"
                    />
                  </div>

                  <div className="form-group">
                    <label>Шифр бригады/клеймо сварщика:</label>
                    <input
                      type="text"
                      name="brigadeCode"
                      value={formData.brigadeCode}
                      onChange={handleInputChange}
                      required
                      className="input-effect"
                    />
                  </div>

                  <button type="submit" className="submit-button shine-effect">
                    Сохранить архив
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
