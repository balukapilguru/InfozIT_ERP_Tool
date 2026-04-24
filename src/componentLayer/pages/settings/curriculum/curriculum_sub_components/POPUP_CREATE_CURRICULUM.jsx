import React, { useEffect, useState } from "react";
import axios from "axios";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import Button from "../../../../components/button/Button";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";

const   POPUP_CREATE_CURRICULUM = ({
  show,
  mode,
  selectedCurriculum,
  onSave,
  handleClose,
  handleSubmitClose,
}) => {
  console.log("Selected Curriculum in POPUP:", selectedCurriculum);
  const [curriculumForm, setCurriculumForm] = useState({
    curriculumName: "",
    curriculumDescription: "",
    exam_collection: [],
    trainingMode: "",
  });
  const [examOptions, setExamOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    curriculumName: "",
    curriculumDescription: "",
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await ERPApi.get("/exam/allexams?filter[isTeksExam]=1");
        setExamOptions(response.data?.exams || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        // toast.error("Failed to fetch exams.");
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    if (mode === "edit" && selectedCurriculum) {
      const initialExamCollection = Array.isArray(selectedCurriculum.exams)
        ? selectedCurriculum.exams.map((exam) => ({
          value: exam.id,
          label: exam.examName,
        }))
        : [];

      setCurriculumForm({
        curriculumName: selectedCurriculum.curriculumName || "",
        curriculumDescription: selectedCurriculum.curriculumDescription || "",
        exam_collection: initialExamCollection,
        trainingMode: selectedCurriculum?.trainingMode || "",
      });
    } else {
      setCurriculumForm({
        curriculumName: "",
        curriculumDescription: "",
        exam_collection: [],
        trainingMode: "",
      });
    }
  }, [mode, selectedCurriculum]); // Removed examOptions from dependency array as we are now using selectedCurriculum.exams

  const handleInputChange = (e) => {
    const { name, value, type, multiple, options } = e.target;

    let updatedValue;
    if (multiple) {
      updatedValue = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
    } else {
      updatedValue = value;
    }

    setCurriculumForm((prevForm) => ({
      ...prevForm,
      [name]: updatedValue,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: "", // Clear error
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newError = {};

    if (!curriculumForm.curriculumName?.trim()) {
      newError.curriculumName = "Curriculum Name is Required.";
      formIsValid = false;
    } else if (curriculumForm.curriculumName?.replace(/\s+/g, '').length < 3) {
      newError.curriculumName = "Minimum 3 characters required (excluding spaces)";
      formIsValid = false;
    } else if (!curriculumForm?.curriculumDescription) {
      newError.curriculumDescription = "Curriculum Description is Required.";
      formIsValid = false;
    } else if (curriculumForm?.curriculumDescription?.replace(/\s+/g, '').length < 3) {
      newError.curriculumDescription = "Curriculum Description Minimum 3 Characters Required.";
      formIsValid = false;
    } else if (curriculumForm?.curriculumDescription?.length <= 2) {
      newError.curriculumDescription = "Minimum 3 Characters Required";
      formIsValid = false;
    } else if (!curriculumForm.trainingMode) {
      newError.trainingMode = "Training Mode is required.";
      formIsValid = false;
    }

    setError(newError);
    return formIsValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const postCurriculum = {
        curriculumName: curriculumForm.curriculumName,
        curriculumDescription: curriculumForm.curriculumDescription,
        exam_collection: curriculumForm.exam_collection.map((exam) => exam.value),
        trainingMode: curriculumForm.trainingMode,
      };

      setLoading((prev) => !prev);
      try {
        if (mode === "create") {
          const { data, status } = await toast.promise(
            ERPApi.post("/batch/curriculum", postCurriculum),
            {
              pending: "Creating The Curriculum...",
            }
          );
          if (status === 200) {
            handleSubmitClose();
            Swal.fire({
              title: "Created!",
              text: "Curriculum Created successfully.",
              icon: "success",
            });
            setCurriculumForm({
              curriculumName: "",
              curriculumDescription: "",
              exam_collection: [],
            });
            onSave();
          }
        } else if (mode === "edit" && selectedCurriculum) {
          const { data, status } = await toast.promise(
            ERPApi.patch(
              `/batch/curriculum/${selectedCurriculum?.id}`,
              postCurriculum
            ),
            {
              pending: "Updating The Curriculum...",
            }
          );
          if (status === 200) {
            handleSubmitClose();
            setCurriculumForm({
              curriculumName: "",
              curriculumDescription: "",
              exam_collection: [],
            });

            Swal.fire({
              title: "Updated!",
              text: "Curriculum Updated successfully.",
              icon: "success",
            });
            onSave();
          }
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || mode === "create"
            ? "Create Curriculum Failed!. Please try again."
            : "Update Curriculum Failed!. Please try again.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>
          {mode === "create" ? "Create Curriculum" : "Update Curriculum"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Curriculum Name */}
        <div className="mb-3">
          <label
            className="form-label fs-s fw-medium black_300"
            htmlFor="curriculumName"
          >
            Curriculum Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control input_bg_color ${error?.curriculumName ? "error-input" : ""
              }`}
            placeholder="Enter curriculum name"
            name="curriculumName"
            id="curriculumName"
            value={curriculumForm.curriculumName}
            onChange={handleInputChange}
          />
          {error?.curriculumName && (
            <div className="text-danger m-0 fs-xs">{error?.curriculumName}</div>
          )}
        </div>

        {/* Curriculum Description */}
        <div className="mb-3">
          <label
            className="form-label fs-s fw-medium black_300"
            htmlFor="curriculumDescription"
          >
            Description<span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control input_bg_color ${error?.curriculumDescription ? "error-input" : ""
              }`}
            placeholder="Enter description"
            rows="3"
            name="curriculumDescription"
            id="curriculumDescription"
            value={curriculumForm?.curriculumDescription}
            onChange={handleInputChange}
          ></textarea>
          {error?.curriculumDescription && (
            <div className="text-danger m-0 fs-xs">
              {error?.curriculumDescription}
            </div>
          )}
        </div>

        {/* Select Exam */}
        <div className="mb-3">
          <label className="form-label fs-s fw-medium black_300" htmlFor="exam_collection">
            Select Exam
          </label>
          <Select
            id="exam_collection"
            name="exam_collection"
            isMulti
            options={examOptions.map((exam) => ({
              value: exam.id,
              label: `${exam.examType} (${exam.examName})`,
            }))}
            value={curriculumForm.exam_collection}
            onChange={(selectedOptions) => {
              setCurriculumForm((prev) => ({
                ...prev,
                exam_collection: selectedOptions,
              }));
              setError((prev) => ({
                ...prev,
                exam_collection: "",
              }));
            }}
            className={error?.exam_collection ? "error-select" : ""}
          />
          {error?.exam_collection && (
            <div className="text-danger m-0 fs-xs">{error.exam_collection}</div>
          )}
        </div>

        {/* Training Mode */}
        <div className="mb-3">
          <label className="form-label fs-s fw-medium black_300" htmlFor="trainingMode">
            Training Mode <span className="text-danger">*</span>
          </label>
          <Select
            id="trainingMode"
            name="trainingMode"
            options={[
              { value: "Online", label: "Online" },
              { value: "Offline", label: "Offline" },
              { value: "Hybrid", label: "Hybrid" },
              { value: "self-learning", label: "Self Learning" },
            ]}
            value={
              curriculumForm.trainingMode
                ? { value: curriculumForm.trainingMode, label: curriculumForm.trainingMode }
                : null
            }
            onChange={(selectedOption) => {
              setCurriculumForm((prev) => ({
                ...prev,
                trainingMode: selectedOption?.value || "",
              }));
              setError((prev) => ({
                ...prev,
                trainingMode: "",
              }));
            }}
            className={error?.trainingMode ? "error-select" : ""}
            isDisabled={mode === "edit"}
            styles={{ cursor: mode === "edit" ? "not-allowed" : "pointer" }}
          />
          {error?.trainingMode && (
            <div className="text-danger m-0 fs-xs">{error.trainingMode}</div>
          )}
        </div>


      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn_primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default POPUP_CREATE_CURRICULUM;