import React, { useEffect, useState } from "react";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

const BASE_S3_URL = "https://teksversity.s3.us-east-1.amazonaws.com/";

const Media = ({ curriculumId }) => {
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!curriculumId) {
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ERPApi.get(`/batch/curriculum/${curriculumId}/media`);
        setMediaData(response.data);
      } catch (err) {
        console.error("Error fetching media content:", err);
        setError("Failed to load course content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [curriculumId]);


  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };
  const toTitleCase = (str) => {
      if (!str) return str;
      return str.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
  const MediaContent = () => {
    if (!selectedFile) return null;

    const fileKey = selectedFile.url || selectedFile.path || selectedFile.assetInternalName;
    const mediaUrl = `${BASE_S3_URL}${fileKey.startsWith('/') ? fileKey.substring(1) : fileKey}`;
    console.log(mediaUrl,"sdfsdfslfksdlfk")
    let mediaElement = null;
    const styleHeight = selectedFile.assetType === 'video' ? '75vh' : '70vh';

    const [mediaLoading, setMediaLoading] = useState(true);
    switch (selectedFile.assetType) {
      case 'video':
        return (
          <video
            controls
            autoPlay
            className="w-100"
            style={{ maxHeight: '75vh' }}
            src={mediaUrl}
            onContextMenu={(e) => e.preventDefault()}
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
      case 'ppt':
      case 'doc':
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`;
        mediaElement = (
          <iframe
            src={googleViewerUrl}
            title={selectedFile.title}
            className="w-100"
            style={{ height: '100%', border: 'none', visibility: mediaLoading ? 'hidden' : 'visible' }}
            onLoad={() => setMediaLoading(false)}
          >
            This document cannot be displayed. <a href={mediaUrl} target="_blank" rel="noreferrer">Download the file.</a>
          </iframe>
        );
        break;
      default:
        return <p>Unsupported file type: {selectedFile.assetType}</p>;
    }

    return (
      <div style={{ position: 'relative', height: styleHeight, minHeight: '300px' }}>
        {mediaLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading content...</span>
            </div>
          </div>
        )}
        {mediaElement}
      </div>
    );
  };

  // Loading and Error States
  if (loading) return <div className="p-3">Loading Course Content...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (mediaData.length === 0) return <div className="p-3">No content available for this curriculum.</div>;

  return (
    <div className="container-fluid py-3">
      {/* Main Accordion Display Logic */}
      {mediaData.map((module, moduleIndex) => (
        <div key={moduleIndex} className="card mb-4 shadow-sm">
          <div className="card-header bg_primary text-white p-2">
            <h6>{module.moduleName.toUpperCase()}</h6>
          </div>

          <div className="accordion" id={`accordionModule${moduleIndex}`}>
            {module.topics?.map((topic, topicIndex) => {
              const collapseId = `collapseTopic${moduleIndex}-${topicIndex}`;
              const headingId = `headingTopic${moduleIndex}-${topicIndex}`;

              return (
                <div className="accordion-item" key={topicIndex}>
                  <h2 className="accordion-header" id={headingId}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded="false"
                      aria-controls={collapseId}
                    >
                      📚 {topic.topicName.toUpperCase()}
                    </button>
                  </h2>
                  <div
                    id={collapseId}
                    className="accordion-collapse collapse"
                    aria-labelledby={headingId}
                    data-bs-parent={`#accordionModule${moduleIndex}`}
                  >
                    <div className="accordion-body bg-light">
                      {topic.topicMediaCollection?.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {topic.topicMediaCollection.map((file, fileIndex) => (
                            <li key={fileIndex} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>
                                {file.assetType?.toLowerCase() === 'pdf' ? '📄' :
                                  file.assetType?.toLowerCase() === 'doc' || file.assetType?.toLowerCase() === 'docx' ? '📝' :
                                    file.assetType?.toLowerCase() === 'ppt' || file.assetType?.toLowerCase() === 'pptx' ? '📊' :
                                      file.assetType?.toLowerCase() === 'video' ? '▶️' :
                                        '📁'}{' '}

                                <button
                                  className="btn btn-link p-0 text-start"
                                  onClick={() => handleFileClick(file)}
                                >
                                 {toTitleCase(file.title || '')}
                                </button>
                              </span>
                              <span className="badge bg-secondary">{file.assetType.toUpperCase()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No media files uploaded for this topic.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* The Modal Component */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', paddingRight: '17px', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered justify-content-center">
            <div className="modal-content w-50">
              <div className="modal-header">
                <h5 className="modal-title">{toTitleCase(selectedFile?.title || '')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body p-0">
                {/* Renders the appropriate media player/viewer */}
                <MediaContent />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;