import React, { useState } from "react";
// import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
// import Button from "../../../../components/button/Button";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Button from "../../../components/button/Button.jsx";
import { FaDownload } from "react-icons/fa";

const ImportStudents = ({ showModals, setShowModals, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
 const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  if (selectedFile) {
    const fileName = selectedFile.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");

    if (isCSV) {
      if (selectedFile.size <= maxFileSize) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("File size should not exceed 5MB.");
        setFile(null);
      }
    } else {
      setError("Please upload a valid CSV file.");
      setFile(null);
    }
  }
};


  const csvData = `Name,Email,Contact Number,Gender,Course Package,Course,Branch,Mode Of Training,Date Of Joining,
Bala,balakrishna.n@teksacademy.com,9618280456,Male,Basic,React Js,Hyderabad,Offline,9/27/2000,
Swayam,prakash.g@teksacademy.com,9876545678,Male,Basic,React Js,Hyderabad,Online,9/27/2000`;

  const downloadCsv = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Studenttemplate.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const { data, status } = await toast.promise(
        ERPApi.post(`student/bulkimport`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Processing Student Uploading...",
        }
      );

      if (status === 201) {
        setShowModals(false);
        setFile(null);
        Swal.fire({
          title: "Uploaded!",
          text: "Student Uploaded successfully!",
          icon: "success",
        });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      setShowModals(false);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message || // handle more cases
        "File Updating Failed. Please Try Again.";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(true);
    }
  };

  return (
    <Modal
      show={showModals === true}
      onHide={() => {
        setShowModals(false);
        setFile(null);
        setError(null);
      }}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton={true}>
        <Modal.Title>Import Students Here...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <div className="input-group mt-2 mb-3 row w-100">
           <div className="d-flex">
             <div className="col-9">
              <label
                htmlFor="hiddenFileInput"
                className="btn border fs-s text-start w-100"
              >
                {file ? file?.name : "Choose File (CSV only)"}
              </label>
              <input
                type="file"
                id="hiddenFileInput"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="form-check form-switch col-3 ps-1">
              <Button
                className="btn btn_primary fs-13 "
                title="Download Template"
                onClick={downloadCsv}
              >
                <FaDownload /> Sample
              </Button>
            </div>
           </div>
          </div>

          {error && <p className="text-danger fs-13 mt-0 mb-0">{error}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={`btn btn_primary fs-13 `}
          onClick={() => handleUpload()}
          disabled={loading || !file}
          style={{ cursor: loading || !file ? "not-allowed" : "pointer" }}
        >
          {loading ? "Importing..." : "Import"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportStudents;
