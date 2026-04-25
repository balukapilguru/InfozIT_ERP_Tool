import React, { useEffect, useRef, useState } from "react";
import { Modal, Offcanvas } from "react-bootstrap";
import "../../../../assets/css/Courses.css";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useFetcher, useLoaderData, useParams } from "react-router-dom";
import BackButton from "../../../components/backbutton/BackButton";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaUpload } from "react-icons/fa6";
import { BiSave } from "react-icons/bi";
import {
    SortableContainer,
    SortableElement,
    SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { CiMenuBurger } from "react-icons/ci";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Button from "../../../components/button/Button";
import axios from "axios";
import DocumentRow from "./DocumentRow.jsx";
import { capitalizeFirstLetter } from "../../../../utils/Utils.jsx";
import { IoInformationCircleOutline } from "react-icons/io5";
import Select from "react-select";

export const AddMeadiContentLoader = async ({ request, params }) => {
    const { id } = params;
    const curriculum = [];
    if (id) {
        try {
            const response = await ERPApi.get(`/batch/curriculum/${id}/media`);
            curriculum.push(...response?.data);
            return curriculum;

        } catch (error) {
            console.error("Error fetching module:", error);
        }
    }
    return curriculum;
}


export const AddMeadiContentAction = async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const mediaId = formData.get("mediaId");
    const moduleId = formData.get("moduleId");
    const topicId = formData.get("topicId");
    const files = JSON.parse(formData.get("files"));
    formData.append("actionType", "updateMedia");
    switch (actionType) {
        case "addMedia":
            try {
                const response = await toast.promise(
                    ERPApi.post(`/batch/curriculum/${id}/media`, {
                        moduleId,
                        topicId,
                        files,
                    }),
                    {
                        pending: "Uploading topic media...",
                        success: "Topic media uploaded successfully",
                        error: "Failed to upload topic media ❌",
                    }
                );
                return { success: true, data: response?.data };
            } catch (err) {
                toast.error(err.message || "Something went wrong while uploading.");
                return { success: false, error: err.message };
            }
            break;

        case "updateMedia":
            {
                const title = formData.get("title");
                const description = formData.get("description");
                const editMediaId = formData.get("editMediaId");
                const thumbnail = formData.get("thumbnail");
                const payload = {
                    title,
                    description,
                    thumbnail
                };

                try {
                    const response = await toast.promise(
                        ERPApi.patch(
                            `/batch/curriculum/${id}/media/${editMediaId}`,
                            payload,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        ),
                        {
                            pending: "Updating topic media...",
                        }
                    );
                    return { success: true, data: response?.data };
                } catch (err) {
                    toast.error(err.message || "Something went wrong while updating.");
                    return { success: false, error: err.message };
                }
            }
            break;

        case "deleteMedia":
            try {
                const response = await toast.promise(
                    ERPApi.delete(`/batch/curriculum/${id}/media/${mediaId}`),
                    { pending: "Deleting topic media..." }
                );
                return { success: true, data: response?.data };
            } catch (err) {
                console.error("💥 deleteMedia error:", err);
                return { success: false, error: err.message };
            }
            break;

        default:
            return { success: false, error: "Invalid action type" };
    }
};

const BASE_S3_URL = "-east-1.amazonaws.com/erp/studentManagement/regStudentImgs/";

const AddMeadiContent = () => {
    const { id } = useParams();
    const curriculumDataFromLoader = useLoaderData();
    const saveTopicMediaFetcher = useFetcher();
    const deleteTopicMediaFetcher = useFetcher();
    const updateMediaFetcher = useFetcher();
    const [curriculum, setCurriculum] = useState(curriculumDataFromLoader);
    const [Module, setModule] = useState({
        moduleId: "",
        topicId: "",
        mediaType: "",
        mediaTitle: "",
        mediaDescription: "",
        mediaFile: null,
        thumbnail: null,
        topics: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTumbnali, setIsTumbnailUploaded] = useState(false);
    const [uploadTumnbailLoading, setUploadTumnbailLoading] = useState(false);

    useEffect(() => {
        setCurriculum(curriculumDataFromLoader);
    }, [id]);

    const getPreSignedUrl = async (mediaType, mediaFileName) => {
        try {
            const response = await ERPApi.post('/media/upload/pre-sign', {
                assetType: mediaType,
                assetName: mediaFileName,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching pre-signed URL:', error);
            throw error;
        }
    };
    const uploadFileToS3 = async (uploadURL, fileInput, onProgress) => {
        const file = fileInput?.fileObject || fileInput;
        const res = await axios.put(uploadURL, file, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            }
        });

        return res.status === 200;
    };

    const uploadTopicMedia = async () => {
        const file = editTopicData.mediaFile;
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        setEditTopicData((prev) => ({
            ...prev,
            status: 'uploading',
            uploadProgress: 0,
        }));

        try {
            const { uploadURL, assetInfo } = await getPreSignedUrl(editTopicData.mediaType, file.name);

            await uploadFileToS3(uploadURL, file, (progress) => {
                setEditTopicData((prev) => ({
                    ...prev,
                    uploadProgress: progress,
                }));
            });

            setEditTopicData((prev) => ({
                ...prev,
                mediaFile: {
                    name: file.name,
                    sizeKB: (file.size / 1024).toFixed(2),
                    assetPath: assetInfo.path,
                    url: uploadURL.split("?")[0],
                },
                status: 'uploaded',
            }));
        } catch (err) {
            toast.error("Upload failed");
            setEditTopicData((prev) => ({
                ...prev,
                status: 'error',
            }));
        }
    };


    const uploaThumbnail = async () => {
        setUploadTumnbailLoading(true);
        const file = editTopicData.thumbnail;
        if (!file) {
            toast.warning("Please select a file first.");
            return;
        }
        try {
            const { uploadURL, assetInfo } = await getPreSignedUrl(editTopicData.mediaType, file.name);

            await uploadFileToS3(uploadURL, file, (progress) => {
                setEditTopicData((prev) => ({
                    ...prev,
                    uploadProgress: progress,
                }));
            });

            setEditTopicData((prev) => ({
                ...prev,
                thumbnail: {
                    name: file.name,
                    sizeKB: (file.size / 1024).toFixed(2),
                    assetPath: assetInfo.path,
                    url: uploadURL.split("?")[0],
                },
                // status: 'uploaded',
            }));
            setIsTumbnailUploaded(true);
            setUploadTumnbailLoading(false);
        } catch (err) {
            toast.error("Upload failed");
            setEditTopicData((prev) => ({
                ...prev,
                status: 'error',
            }));
            setUploadTumnbailLoading(false);
        }
    };

    const [isThumbnailMedia, setIsThumbnailMediaUploaded] = useState(false);
    const uploaThumbnailMedia = async () => {
        const file = editMediaData.thumbnail;
        if (!file) {
            toast.warning("Please select a file first.");
            return;
        }
        // ✅ Add validation: only JPG or PNG under 1MB
        const validTypes = ["image/jpeg", "image/png"];
        const maxSizeMB = 1;
        if (!validTypes.includes(file.type)) {
            toast.warning("Only JPG and PNG files are allowed.");
            return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.warning("File size must be less than 1MB.");
            return;
        }
        setIsUpdatingEditMediaTumbnail((prev) => ({ ...prev, loading: true }));

        try {
            const { uploadURL, assetInfo } = await getPreSignedUrl(editMediaData.thumbnail, file.name);

            await uploadFileToS3(uploadURL, file, (progress) => {
                setEditTopicData((prev) => ({
                    ...prev,
                    uploadProgress: progress,
                }));
            });

            setEditMediaData((prev) => ({
                ...prev,
                thumbnail: {
                    name: file.name,
                    sizeKB: (file.size / 1024).toFixed(2),
                    assetPath: assetInfo.path,
                    url: uploadURL.split("?")[0],
                },
                // status: 'uploaded',
            }));
            setIsTumbnailUploaded(true);
            setIsThumbnailMediaUploaded(false);
            setIsUpdatingEditMediaTumbnail(prev => ({ ...prev, loading: false, isUploaded: true, isFailed: false }));
        } catch (err) {
            toast.error("Upload failed");

            setIsUpdatingEditMediaTumbnail(prev => ({ ...prev, loading: false, isFailed: true }));
            setEditTopicData((prev) => ({
                ...prev,
                status: 'error',
            }));
        }
    };

    const SortableSection = SortableElement(({ section, sectionIndex }) => (
        <div className="pt-1 p-3 mb-3" key={section.id}>

            {/* 🟧 Static Module Header */}
            <div className="d-flex align-items-center mb-2">
                <span className="orange_box rounded p-1 fs-13 fw-300 text-white">
                    {sectionIndex + 1}
                </span>
                <span className="fw-500 ms-2">
                    {capitalizeFirstLetter(section.moduleName) || "Untitled Module"}
                </span>
            </div>

            {/* 🩵 Topics Accordion */}
            <div className="accordion" id={`topicAccordion-${sectionIndex}`}>
                {section.topics.map((topic, topicIndex) => (
                    <div
                        key={topic.id || topicIndex}
                        className="accordion-item mb-2 border rounded bg-light"
                    >

                        {/* 🟣 Accordion Header (Topic Name) */}
                        <h2
                            className="accordion-header"
                            id={`topic-heading-${sectionIndex}-${topicIndex}`}
                        >
                            <button
                                className="accordion-button collapsed fw-600 fs-13"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#topic-collapse-${sectionIndex}-${topicIndex}`}
                                aria-expanded="false"
                                aria-controls={`topic-collapse-${sectionIndex}-${topicIndex}`}
                            >
                                📘 {capitalizeFirstLetter(topic?.topicName || "Untitled Topic")}
                            </button>
                        </h2>

                        {/* 🟢 Accordion Body (Media + Edit/Delete) */}
                        <div
                            id={`topic-collapse-${sectionIndex}-${topicIndex}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`topic-heading-${sectionIndex}-${topicIndex}`}
                            data-bs-parent={`#topicAccordion-${sectionIndex}`}
                        >
                            <div className="accordion-body">
                                {/* ✏️ Edit Topic Button */}
                                {topic?.topicMediaCollection?.length < 3 && (
                                    <div className="d-flex justify-content-end mb-2">
                                        <button
                                            onClick={() => {
                                                setEditTopicData({
                                                    moduleId: section.id,
                                                    topicId: topic.id,
                                                    mediaType: "",
                                                    title: "",
                                                    description: "",
                                                    mediaFile: null,
                                                    thumbnail: null,
                                                });
                                                setShowEditTopicModal(true);
                                                setIsTumbnailUploaded(false);
                                            }}
                                            type="button"
                                            className="btn btn-sm btn_primary fs-13"
                                        >
                                            <FaPlus /> Add Media
                                        </button>
                                    </div>
                                )}


                                {/* 🧩 Media List */}
                                {topic?.topicMediaCollection?.length > 0 ? (
                                    <ul className="list-unstyled mb-0">
                                        {topic.topicMediaCollection.map((media, mediaIndex) => (
                                            <DocumentRow
                                                key={mediaIndex}
                                                title={media.title || "Media File"}
                                                description={media.description || "N/A"}
                                                type={media.assetType || "File Type"}
                                                thumbnail={media.thumbnail ? `-east-1.amazonaws.com/${media.thumbnail}` : ""}
                                                onEdit={() => handleEditMedia(section.curriculumId, media.id)}
                                                onDelete={() => handleDeleteMedia(section.curriculumId, media.id)}
                                                onView={() => handleViewMedia({ ...media, curriculumId: section.curriculumId })
                                                }
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted fs-13 mb-0">No media</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ));

    const handleDeleteMedia = async (curriculumId, mediaId) => {
        if (!curriculumId || !mediaId) return;

        const result = await Swal.fire({
            title: "Are you sure you want to delete this media?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (!result.isConfirmed) return;

        const actionType = "deleteMedia";
        const formData = new FormData();
        formData.append("mediaId", mediaId);
        formData.append("actionType", actionType);
        deleteTopicMediaFetcher.submit(formData, {
            method: 'delete',
        });
        return;
    };
    const handleViewMedia = (media) => {
        setSelectedFile(media);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setSelectedFile(null);
        setShowModal(false);
    };
    const [editMediaData, setEditMediaData] = useState(null);
    const [editMediaDataError, setEditMediaDataError] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [isUpdatingEditMediaTumbnail, setIsUpdatingEditMediaTumbnail] = useState({
        loading: false,
        isUploaded: false,
    });
    const handleEditMedia = async (curriculumId, mediaId) => {
        try {
            const response = await ERPApi.get(`/batch/curriculum/${id}/media/${mediaId}`);

            if (response.status === 200) {
                setEditMediaData(response.data);
                setShowMediaModal(true);
            } else {
                toast.error("Failed to fetch media details");
            }
        } catch (error) {
            toast.error
        }
    };

    const validateEditMediaData = () => {
        const errors = {};

        if (!editMediaData.title || editMediaData.title.trim() === "") {
            errors.title = "Title is required.";
        } else if (editMediaData.title.trim().replace(/\s+/g, '').length < 3) {
            errors.title = "Title must be at least 3 characters.";
        }

        if (!editMediaData.description || editMediaData.description.trim() === "") {
            errors.description = "Description is required.";
        } else if (editMediaData.description.trim().replace(/\s+/g, '').length < 10) {
            errors.description = "Description must be at least 10 characters.";
        }

        setEditMediaDataError(errors);

        return Object.keys(errors).length === 0; // returns true if no errors
    };

    const handleUpdateMedia = async () => {

        if (!validateEditMediaData()) {
            return;
        }
        const formData = new FormData();
        formData.append("title", editMediaData.title);
        formData.append("editMediaId", editMediaData.id);
        formData.append("description", editMediaData.description);
        formData.append("thumbnail", editMediaData?.thumbnail?.assetPath,);
        formData.append("actionType", "updateMedia");
        updateMediaFetcher.submit(formData, {
            method: 'patch',
        });
    };

    const [showEditTopicModal, setShowEditTopicModal] = useState(false);
    const [editTopicErrors, setEditTopicErrors] = useState({});
    const [editTopicData, setEditTopicData] = useState({
        mediaType: "",
        title: "",
        description: "",
        mediaFile: null,
        thumbnail: null,
    });

    const validateEditTopicData = (data) => {
        const errors = {};
        // Validate media type
        if (!data.mediaType || data.mediaType.trim() === "") {
            errors.mediaType = "Media type is required";
        }

        // Validate title
        if (!data.title || data.title.trim() === "") {
            errors.title = "Title is required";
        } else if (data.title.trim().length < 3) {
            errors.title = "Title must be at least 3 characters long";
        } else if (data.title.trim().length > 100) {
            errors.title = "Title cannot exceed 100 characters";
        }

        // Validate description
        if (!data.description || data.description.trim() === "") {
            errors.description = "Description is required";
        } else if (data.description.trim().length < 10) {
            errors.description = "Description must be at least 10 characters long";
        } else if (data.description.trim().length > 1000) {
            errors.description = "Description cannot exceed 1000 characters";
        }

        // Validate media file
        if (!data.mediaFile) {
            errors.mediaFile = "Media file is required";
        }

        setEditTopicErrors(errors);
        return errors;
    };

    const handleSaveTopicMedia = async () => {
        const errors = validateEditTopicData(editTopicData);
        if (Object.keys(errors).length > 0) {
            return;
        }
        const moduleId = Number(editTopicData.moduleId);
        const topicId = Number(editTopicData.topicId);
        const actionType = "addMedia";

        if (!moduleId || !topicId) {
            return toast.error("Module ID or Topic ID is missing.");
        }
        const files = [
            {
                title: editTopicData.title || '',
                description: editTopicData.description || '',
                assetType: editTopicData.mediaType || 'file',
                isDownloadable: true,
                hasWatermark: false,
                path: editTopicData.mediaFile.assetPath || '',
                thumbnail: editTopicData.thumbnail?.assetPath,
                fileSize: editTopicData.sizeKB || null,
            }
        ];
        const formData = new FormData();
        formData.append("moduleId", moduleId);
        formData.append("topicId", topicId);
        formData.append("actionType", actionType);
        formData.append("files", JSON.stringify(files));
        const payload = {
            moduleId,
            topicId,
            actionType,
            files,
        };
        saveTopicMediaFetcher.submit(formData, {
            method: 'post',
        }
        );
    };

    // Sortable Container for the whole curriculum
    const SortableCurriculum = SortableContainer(({ curriculum }) => {
        return (
            <div>
                {curriculum.length === 0 ? (
                    <p>No modules are present.</p>
                ) : (
                    curriculum.map((section, index) => (
                        <SortableSection
                            key={`section-${section.id}`}
                            index={index}
                            section={section}
                            sectionIndex={index}
                        />
                    ))
                )}
            </div>
        );
    });

    const getAcceptedFileType = (mediaType) => {
        switch (mediaType) {
            case 'video':
                return 'video/*'; // or more specific: 'video/mp4,video/x-m4v'
            case 'pdf':
                return 'application/pdf';
            case 'doc':
                return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'ppt':
                return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
            case 'zip':
                return '.zip,.rar,application/zip,application/x-zip-compressed';
            case 'other':
                return '*'; // allow any file
            default:
                return '*';
        }
    };

    const [moduleOptions, setModuleOptions] = useState([]);
    const [topicOptions, setTopicOptions] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            if (!id) return;

            try {
                const response = await ERPApi.get(`/batch/module?curriculumId=${id}`);
                const modules = response.data?.modules || [];

                setModuleOptions(modules);

                // Automatically set topicOptions if moduleId already selected
                const selectedModule = modules.find(
                    (mod) => mod.id === Number(Module.moduleId)
                );

                if (selectedModule && selectedModule.topics) {
                    const formattedTopics = selectedModule.topics.map((topic) => ({
                        id: topic.id,
                        name: topic.topicName || 'Untitled Topic',
                    }));
                    setTopicOptions(formattedTopics);
                } else {
                    setTopicOptions([]);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
                setModuleOptions([]);
                setTopicOptions([]);
            }
        };

        fetchModules();
    }, [id, Module.moduleId]);

    // 
    useEffect(() => {
        if (updateMediaFetcher?.data?.success) {
            setShowMediaModal(false)
            setIsUpdatingEditMediaTumbnail(prev => ({ ...prev, isUploaded: false }))
        };
    }, [updateMediaFetcher])


    useEffect(() => {
        if (saveTopicMediaFetcher?.data?.success) {
            setShowEditTopicModal(false);
        }
    }, [saveTopicMediaFetcher.data])

    const MediaContent = () => {
        const [mediaLoading, setMediaLoading] = useState(true);

        if (!selectedFile || !selectedFile.assetType || !selectedFile.path) {
            return <p className="text-danger text-center">Media not available.</p>;
        }
        const BASE_S3_URL = "-east-1.amazonaws.com/";
        const fileKey = selectedFile.path;
        const mediaUrl = `${BASE_S3_URL}${fileKey.startsWith("/") ? fileKey.substring(1) : fileKey}`;

        const type = selectedFile.assetType.toLowerCase();
        const styleHeight = ["pdf", "ppt", "doc"].includes(type) ? "70vh" : "75vh";

        if (type === "video" || type === "mp4") {
            return (
                <video
                    controls
                    autoPlay
                    className="w-100"
                    style={{ maxHeight: styleHeight }}
                    src={mediaUrl}
                    onContextMenu={(e) => e.preventDefault()}
                    controlsList="nodownload"
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (["pdf", "ppt", "doc"].includes(type)) {
            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`;
            return (
                <div style={{ position: "relative", height: styleHeight, minHeight: "300px" }}>
                    {mediaLoading && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                zIndex: 10,
                            }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <iframe
                        src={googleViewerUrl}
                        title={selectedFile.title}
                        className="w-100"
                        style={{
                            height: "100%",
                            border: "none",
                            visibility: mediaLoading ? "hidden" : "visible",
                        }}
                        onLoad={() => setMediaLoading(false)}
                    ></iframe>
                </div>
            );
        }

        return <p className="text-danger text-center">Unsupported file type: {selectedFile.assetType}</p>;
    };


    const toTitleCase = (str) => {
        if (!str) return str;
        return str.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div>
            <BackButton heading="Curriculum" content="Back" />
            <div className="container-fluid">
                <div className="card">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <SortableCurriculum
                                curriculum={curriculumDataFromLoader}
                                //onSortEnd={onSortEnd}
                                useDragHandle={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* editmedia */}
            {showMediaModal && editMediaData && (
                <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Media</h5>
                                <button type="button" className="btn-close" onClick={() => { setShowMediaModal(false), setIsUpdatingEditMediaTumbnail(prev => ({ ...prev, isUploaded: false })) }}></button>
                            </div>

                            <div className="modal-body">
                                {/* Media Title */}
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Media Title"
                                        value={editMediaData.title || ""}
                                        onChange={(e) =>
                                            setEditMediaData({ ...editMediaData, title: e.target.value })
                                        }
                                    />
                                    {(editMediaDataError?.title) && (
                                        <div className="text-danger fs-13">{editMediaDataError?.title}</div>
                                    )}
                                </div>

                                {/* Media Description */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter Media Description"
                                        rows="3"
                                        value={editMediaData.description || ""}
                                        onChange={(e) =>
                                            setEditMediaData({ ...editMediaData, description: e.target.value })
                                        }
                                    />
                                    {(editMediaDataError?.description) && (
                                        <div className="text-danger fs-13">{editMediaDataError?.description}</div>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div className="mb-3">
                                    <label className="form-label">Thumbnail</label>
                                    {editMediaData.thumbnail && !isThumbnailMedia && (
                                        <div className="mb-2">
                                            <img
                                                src={editMediaData?.thumbnail?.url ? editMediaData?.thumbnail?.url : `-east-1.amazonaws.com/${editMediaData.thumbnail}`}
                                                alt="thumbnail"
                                                style={{ height: "80px" }}
                                            />
                                        </div>
                                    )}
                                    <div className="d-flex gap-2">
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="form-control"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const validTypes = ["image/jpeg", "image/png"];
                                                const maxSizeMB = 1;

                                                if (!validTypes.includes(file.type)) {
                                                    toast.warning("Only JPG and PNG files are allowed.");
                                                    e.target.value = ""; // reset input
                                                    return;
                                                }
                                                if (file.size > maxSizeMB * 1024 * 1024) {
                                                    toast.warning("File size must be less than 1MB.");
                                                    e.target.value = ""; // reset input
                                                    return;
                                                }
                                                setIsThumbnailMediaUploaded(true);
                                                setEditMediaData({ ...editMediaData, thumbnail: file });
                                            }}
                                        />


                                        <button
                                            type="button"
                                            className="btn-sm btn btn_primary"
                                            onClick={uploaThumbnailMedia}
                                            disabled={editMediaData?.thumbnail == null || editMediaData?.thumbnail == ''}
                                        // disabled={!editTopicData.mediaFile || editTopicData.status === 'uploading'}
                                        >
                                            <FaUpload />
                                            {/* {editTopicData.status === 'uploading' ? 'Uploading...' : 'Upload'} */}
                                        </button>
                                    </div>
                                    {(isUpdatingEditMediaTumbnail.loading && !isUpdatingEditMediaTumbnail.isFailed) && (
                                        <div className="text-warning mt-1">Uploading thumbnail...</div>
                                    )}
                                    {(!isUpdatingEditMediaTumbnail.loading && isUpdatingEditMediaTumbnail.isUploaded) && (
                                        <div className="text-success mt-1">✅ Uploaded </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowMediaModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn_primary" disabled={isThumbnailMedia} onClick={handleUpdateMedia}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* edit topic */}
            {showEditTopicModal && (
                <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Media</h5>
                                <button className="btn-close" onClick={() => { setShowEditTopicModal(false), setIsTumbnailUploaded(false) }}></button>
                            </div>

                            <div className="modal-body">
                                {/* Media Type */}
                                <div className="mb-3">
                                    <label className="form-label fs-s fw-medium black_300">Media Type <span className="text-danger">*</span></label>

                                    <Select
                                        value={
                                            editTopicData.mediaType
                                                ? { value: editTopicData.mediaType, label: editTopicData.mediaType.toUpperCase() }
                                                : null
                                        }
                                        onChange={(selectedOption) => {
                                            const newValue = selectedOption ? selectedOption.value : "";
                                            setEditTopicData((prev) => ({ ...prev, mediaType: newValue }));
                                            setEditTopicErrors((errors) => ({
                                                ...errors,
                                                mediaType: newValue ? "" : "Media type is required",
                                            }));
                                        }}
                                        options={[
                                            { value: "video", label: "Video" },
                                            { value: "pdf", label: "PDF" },
                                            { value: "doc", label: "DOC" },
                                            { value: "ppt", label: "PPT" },
                                        ]}
                                        placeholder="Select Media Type"
                                    />

                                    {(editTopicErrors?.mediaType) && (
                                        <div className="text-danger fs-13">{editTopicErrors?.mediaType}</div>
                                    )}
                                </div>

                                {/* Media Title */}
                                <div className="mb-3">
                                    <label className="form-label fs-s fw-medium black_300">Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Media Title"
                                        value={editTopicData.title}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setEditTopicData((prev) => ({ ...prev, title: newValue }));
                                            setEditTopicErrors(errors => ({
                                                ...errors,
                                                title: newValue ? "" : "Title is required"
                                            }));
                                        }}
                                    />
                                    {(editTopicErrors?.title) && (
                                        <div className="text-danger fs-13">{editTopicErrors?.title}</div>
                                    )}
                                </div>

                                {/* Media Description */}
                                <div className="mb-3">
                                    <label className="form-label fs-s fw-medium black_300">Description <span className="text-danger">*</span></label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter Media Description"
                                        rows="3"
                                        value={editTopicData.description}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setEditTopicData((prev) => ({ ...prev, description: newValue }));
                                            setEditTopicErrors(errors => ({
                                                ...errors,
                                                description: newValue ? "" : "Description is required"
                                            }));
                                        }}
                                    />
                                    {(editTopicErrors?.description) && (
                                        <div className="text-danger fs-13">{editTopicErrors?.description}</div>
                                    )}
                                </div>
                                {/* Thumbnail */}
                                <div className="mb-3">
                                    <label className="form-label fs-s fw-medium black_300">Thumbnail <IoInformationCircleOutline size={18} title="Thumbnail must be a JPG or PNG file under 1 MB." /> </label>
                                    <div className="d-flex gap-2">
                                        <input
                                            className={"form-control input_bg_color text-capitalize"}
                                            id="filename"
                                            name="filename"
                                            type="file"
                                            accept=".jpg,.jpeg,.png" // restrict picker level
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const validTypes = ["image/jpeg", "image/png"];
                                                const maxSizeMB = 1; // ✅ 1 MB limit

                                                // Validate file type
                                                if (!validTypes.includes(file.type)) {
                                                    toast.warning("Only JPG and PNG files are allowed.");
                                                    e.target.value = ""; // clear invalid file
                                                    return;
                                                }

                                                // Validate file size
                                                if (file.size > maxSizeMB * 1024 * 1024) {
                                                    toast.warning("File size must be less than 1MB.");
                                                    e.target.value = ""; // clear invalid file
                                                    return;
                                                }

                                                setEditTopicData((prev) => ({ ...prev, thumbnail: file }));
                                            }}
                                        />


                                        <button
                                            type="button"
                                            className="btn-sm btn btn_primary"
                                            onClick={uploaThumbnail}
                                            disabled={editTopicData?.thumbnail == null || editTopicData?.thumbnail == '' || isTumbnali}
                                        // disabled={!editTopicData.mediaFile || editTopicData.status === 'uploading'}
                                        >
                                            <FaUpload />
                                            {/* {editTopicData.status === 'uploading' ? 'Uploading...' : 'Upload'} */}
                                        </button>
                                    </div>
                                    {isTumbnali && !uploadTumnbailLoading && (
                                        <div className="text-success mt-1">✅ Uploaded </div>
                                    )}
                                    {uploadTumnbailLoading && !isTumbnali && (
                                        <div className="text-success mt-1">Uploading... </div>
                                    )}
                                </div>

                                {/* Media File */}
                                <div className="mb-3">
                                    <label className="form-label fs-s fw-medium black_300">
                                        Upload File {" "}
                                        <span className="text-danger">*</span> {" "}
                                        <IoInformationCircleOutline size={18} title="Video Files must be under 500 MB and other Files must be under 5 MB and in one of the following formats: MP4, PDF, DOC, DOCX, or PPT." />{" "}
                                        {editTopicData.mediaType && (<span className="fs-xs text-muted">{editTopicData.mediaType === "video" ? " (Video files must be under 500 MB only MP4 formate acceptable) " : `(${editTopicData.mediaType} File must be under 5 MB)`}</span>)}
                                    </label>

                                    <div className="d-flex gap-2">
                                        <input
                                            type="file"
                                            className="form-control"
                                            disabled={editTopicData.mediaType === ""}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setEditTopicErrors(errors => ({
                                                    ...errors,
                                                    mediaFile: ""
                                                }));
                                                if (!file) return;

                                                const mediaType = editTopicData.mediaType?.toLowerCase();

                                                // ✅ For Video: Only MP4 and ≤ 500 MB
                                                if (mediaType === "video") {
                                                    const validType = "video/mp4";
                                                    const maxSizeMB = 500;

                                                    if (file.type !== validType) {
                                                        setEditTopicErrors(errors => ({
                                                            ...errors,
                                                            mediaFile: "Only MP4 video files are allowed."
                                                        }));
                                                        // toast.warning("Only MP4 video files are allowed.");
                                                        e.target.value = ""; // reset input
                                                        return;
                                                    }

                                                    if (file.size > maxSizeMB * 1024 * 1024) {
                                                        setEditTopicErrors(errors => ({
                                                            ...errors,
                                                            mediaFile: "Video file size must be less than 500MB."
                                                        }));
                                                        // toast.warning("Video file size must be less than 500MB.");
                                                        e.target.value = ""; // reset input
                                                        return;
                                                    }
                                                } else {
                                                    const validType = "video/mp4";
                                                    const maxSizeMB = 5;

                                                    if (file.size > maxSizeMB * 1024 * 1024) {
                                                        setEditTopicErrors(errors => ({
                                                            ...errors,
                                                            mediaFile: "file size must be less than 5MB."
                                                        }));
                                                        // toast.warning("file size must be less than 5MB.");
                                                        e.target.value = ""; // reset input
                                                        return;
                                                    }
                                                }
                                                setEditTopicData((prev) => ({
                                                    ...prev,
                                                    mediaFile: file, // Just set file, do NOT upload yet
                                                    status: '',       // Reset status
                                                    uploadProgress: 0,
                                                }));
                                            }}
                                            accept={getAcceptedFileType(editTopicData.mediaType)}
                                        />
                                        <button
                                            type="button"
                                            className="btn-sm btn btn_primary"
                                            onClick={uploadTopicMedia}
                                            disabled={!editTopicData.mediaFile || editTopicData.status === 'uploading' || editTopicData.status === 'uploaded'}
                                        >
                                            <FaUpload />
                                            {/* {editTopicData.status === 'uploading' ? 'Uploading...' : 'Upload'} */}
                                        </button>
                                    </div>
                                    {(editTopicErrors?.mediaFile) && (
                                        <div className="text-danger fs-13">{editTopicErrors?.mediaFile}</div>
                                    )}
                                    {editTopicData.status === 'uploading' && (
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                                                style={{ width: `${editTopicData.uploadProgress || 0}%` }}
                                            />
                                        </div>
                                    )}


                                    {editTopicData.status === 'uploaded' && (
                                        <div className="text-success mt-1">✅ Uploaded </div>
                                    )}

                                    {editTopicData.status === 'error' && (
                                        <div className="text-danger mt-1">❌ Failed To Upload</div>
                                    )}

                                </div>



                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditTopicModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn_primary" disabled={editTopicData.status !== 'uploaded'} onClick={() => handleSaveTopicMedia()}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

export default AddMeadiContent;
