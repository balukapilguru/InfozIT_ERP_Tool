import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { toast } from "react-toastify";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { useNavigate, useParams } from "react-router-dom";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import Swal from "sweetalert2";

const CertificateIssueForm = () => {
  const { Dispatchstudents } = useStudentsContext();
  const { courseState } = useCourseContext();
  const { BranchState } = useBranchContext();
  const navigate = useNavigate();

  const { id } = useParams();
  const { status } = useParams();

  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const { data, status } = await ERPApi.get(
            `${import.meta.env.VITE_API_URL}/sc/getstudentcertificate/${id}`
          );
          if (status === 200) {
            const student = data?.student;
            setCertificateData((prev) => ({
              ...prev,
              studentReg: student?.registrationnumber,
              name: student?.name,
              email: student?.email,
              mobilenumber: student?.mobilenumber,
              registrationnumber: student?.registrationnumber,
              branch: student?.branch,
              courses: student?.courses,
              courseStartDate: student?.certificate_status[0]?.courseStartDate,
              courseEndDate: student?.certificate_status[0]?.courseEndDate,
              studentid: student?.id,
              internShipStartDate:
                student?.certificate_status[0]?.internShip?.internShipStartDate,
              internShipEndDate:
                student?.certificate_status[0]?.internShip?.internShipEndDate,
              iepStartDate: student?.certificate_status[0]?.iep?.iepStartDate,
              iepEndDate: student?.certificate_status[0]?.iep?.iepEndDate,
              internShipStatus: false,
              iepStatus: false,
              RequestedDate: student?.certificate_status[0]?.RequestedDate,
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [id]);

  const [disable, setDisable] = useState(false);

  const initialCertificateData = {
    studentReg: null,
    studentid: "",
    name: "",
    email: "",
    mobilenumber: "",
    registrationnumber: "",
    branch: "",
    courses: "",
    courseStartDate: "",
    courseEndDate: "",
    internShipStatus: false,
    internShipStartDate: "",
    internShipEndDate: "",
    iepStatus: false,
    iepStartDate: "",
    iepEndDate: "",
    RequestedDate: "",
  };

  // const [certificateData, setCertificateData] = useState(
  //   {...initialCertificateData}
  // );

  const [certificateData, setCertificateData] = useState({
    studentReg: null,
    studentid: "",
    name: "",
    email: "",
    mobilenumber: "",
    registrationnumber: "",
    branch: "",
    courses: "",
    courseStartDate: "",
    courseEndDate: "",
    internShipStatus: false,
    internShipStartDate: "",
    internShipEndDate: "",
    iepStatus: false,
    iepStartDate: "",
    iepEndDate: "",
    RequestedDate: "",
  });

  const currentDate = new Date().toISOString().split("T")[0];

  // const currentDateWithTime = new Date().toISOString().split('.')[0].replace('T', ' ');

  const currentDateWithTime = new Date()
    .toLocaleString("sv-SE", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    })
    .replace("T", " ");

  const disableCoursestartDate = new Date().toISOString().split("T")[0];
  // const disableCourseEndDate = certificateData?.courseStartDate;

  // const disableIepStartDate =
  //   certificateData?.iepStatus === true ? certificateData?.courseEndDate : null;
  // const disableIepEndDate =
  //   certificateData?.iepStatus === true ? certificateData?.iepStartDate : null;

  // const disableInternShipStartDate =
  //   certificateData?.iepStatus === true
  //     ? certificateData?.iepEndDate
  //     : certificateData?.courseEndDate;
  // const disableInternShipEndDate =
  //   certificateData?.iepStatus === true
  //     ? certificateData?.internShipStartDate
  //     : certificateData?.internShipStartDate;

  const handleCertificateIssueFrom = (e) => {
    const { name, value } = e.target;
    if (name === "mobilenumber" && value.length > 10) {
      return;
    }

    if (name === "courseStartDate") {
      setCertificateData((prev) => ({
        ...prev,
        iepStatus: false,
        internShipStatus: false,
        courseEndDate: "",
        iepStartDate: "",
        iepEndDate: "",
        internShipStartDate: "",
        internShipEndDate: "",
      }));
    }

    if (name === "courseEndDate") {
      setCertificateData((prev) => ({
        ...prev,
        iepStartDate: "",
        iepStatus: false,
        internShipStatus: false,
        iepEndDate: "",
        internShipStartDate: "",
        internShipEndDate: "",
      }));
    }

    if (
      name === "iepStartDate" ||
      name === "iepEndDate" ||
      name === "iepStatus"
    ) {
      setCertificateData((prev) => ({
        ...prev,
        internShipStartDate: "",
        internShipEndDate: "",
      }));
    }
    setCertificateData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      [name]: "",
    }));
  };

  const [errors, setErrors] = useState({});

  const handleSubmitCertificate = async (e) => {
    e.preventDefault();

    if (!certificateData.name || certificateData.name.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        name: "Please Enter the Name",
      }));
      return;
    } else if (certificateData.name.length <= 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Enter minimum 3 characters",
      }));
      return;
    } else if (certificateData?.studentid) {
      if (
        !certificateData.registrationnumber ||
        certificateData.registrationnumber.trim() === ""
      ) {
        setErrors((prev) => ({
          ...prev,
          registrationnumber: "Please Enter the Registration ID",
        }));
        return;
      } else if (certificateData.registrationnumber.length <= 12) {
        setErrors((prev) => ({
          ...prev,
          name: "Enter minimum 12 characters",
        }));
        return;
      }
    }

    if (!certificateData.email || certificateData.email.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        email: "Email required",
      }));
      return;
    } else if (certificateData.email) {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(certificateData.email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Enter valid email",
        }));
        return;
      }
    }

    if (
      !certificateData?.mobilenumber ||
      certificateData?.mobilenumber.trim() === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        mobilenumber: "Phone number required",
      }));
      return;
    } else if (certificateData?.mobilenumber.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        mobilenumber: "Incorrect mobile number",
      }));
      return;
    }

    if (!certificateData?.courses || certificateData?.courses.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        courses: "Course is required",
      }));
      return;
    }

    if (!certificateData?.branch || certificateData?.branch.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        branch: "Branch is required",
      }));
      return;
    }

    if (
      !certificateData?.courseStartDate ||
      certificateData.courseStartDate.trim() === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        courseStartDate: "Course StartDate is required",
      }));
      return;
    } else if (
      !certificateData.courseEndDate ||
      certificateData.courseEndDate.trim() === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        courseEndDate: "Course EndDate is required",
      }));
      return;
    }
    if (
      certificateData.courseStartDate &&
      certificateData.courseEndDate &&
      new Date(certificateData.courseEndDate) < new Date(certificateData.courseStartDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        courseEndDate: "Course End Date cannot be earlier than Start Date",
      }));
      return;
    }
    if (certificateData?.iepStatus == null) {
      setErrors((prev) => ({
        ...prev,
        iepStatus: "Please Select the IEP 'Yes' or 'No' ",
      }));
      return;
    }

    if (certificateData?.iepStatus === true) {
      if (
        !certificateData?.iepStartDate ||
        certificateData.iepStartDate.trim() === ""
      ) {
        setErrors((prev) => ({
          ...prev,
          iepStartDate: "IEP StartDate is required",
        }));
        return;
      } else if (
        !certificateData.iepEndDate ||
        certificateData.iepEndDate.trim() === ""
      ) {
        setErrors((prev) => ({
          ...prev,
          iepEndDate: "IEP EndDate is required",
        }));
        return;
      }
    }

    if (certificateData?.internShipStatus == null) {
      setErrors((prev) => ({
        ...prev,
        internShipStatus: "Please Select the InternShip 'Yes' or 'No' ",
      }));
      return;
    }

    if (certificateData?.internShipStatus === true) {
      if (
        !certificateData?.internShipStartDate ||
        certificateData.internShipStartDate.trim() === ""
      ) {
        setErrors((prev) => ({
          ...prev,
          internShipStartDate: "InternShip StartDate is required",
        }));
        return;
      } else if (
        !certificateData.internShipEndDate ||
        certificateData.internShipEndDate.trim() === ""
      ) {
        setErrors((prev) => ({
          ...prev,
          internShipEndDate: "InternShip EndDate is required",
        }));
        return;
      }

    }

    // const studentid = certificateData.studentid;
    const studentid = certificateData?.studentReg;
    const certificate_status = [
      {
        courseStartDate: certificateData?.courseStartDate,
        courseEndDate: certificateData?.courseEndDate,
        certificateStatus:
          status === "request" || status === undefined
            ? "request Submitted"
            : status === "issue"
              ? "issued"
              : "",
        RequestedDate:
          status === "request" || status === undefined
            ? currentDateWithTime
            : certificateData?.RequestedDate,
        issuedDate: status === "issue" ? currentDateWithTime : "",
        internShip: {
          internShipStatus: certificateData?.internShipStatus,
          internShipCertificateStatus: certificateData?.internShipStatus
            ? status === "request" || status === undefined
              ? "InternShip Request Submitted"
              : status === "issue"
                ? "InternShip Certificate Issued"
                : ""
            : "InternShip Not Issued",
          internShipStartDate: certificateData?.internShipStartDate,
          internShipEndDate: certificateData?.internShipEndDate,
        },
        iep: {
          iepStatus: certificateData?.iepStatus,
          iepCertificateStatus: certificateData?.iepStatus
            ? status === "request" || status === undefined
              ? "IEP Request Submitted"
              : status === "issue"
                ? "IEP Certificate Issued"
                : ""
            : "IEP Not Issued",
          iepStartDate: certificateData?.iepStartDate,
          iepEndDate: certificateData?.iepEndDate,
        },
      },
    ];
    const updatedData = {
      name: certificateData?.name,
      email: certificateData?.email,
      mobilenumber: certificateData?.mobilenumber,
      // registrationnumber: certificateData?.registrationnumber,
      branch: certificateData?.branch,
      courses: certificateData?.courses,
      certificate_status: certificate_status,
      user_id: userData?.user?.id,
    };

    // const uploadcontext = { certificate_status, studentid, courses: certificateData?.courses, };

    if (studentid && status === "request") {
      try {
        const { data, status } = await toast.promise(
          ERPApi.put(
            `${import.meta.env.VITE_API_URL}/sc/certificatestatus/${studentid}`,
            updatedData
          ),
          {
            pending: "verifying data",
            success: {
              render({
                data: {
                  data: { updatedData },
                },
              }) {
                return `Certificate Request Submitted Successfully`;
              },
            },
            error: "Something went wrong Please try again 🤯",
          }
        );

        if (status === 200) {
          navigate("/student/certificate");
        }
      } catch (e) {
        console.error(e);
      }
    } else if (studentid && status === "issue") {
      try {
        const { data, status } = await toast.promise(
          ERPApi.put(
            `${import.meta.env.VITE_API_URL}/sc/certificatestatus/${studentid}`,
            updatedData
          ),
          {
            pending: "verifying data",
            success: {
              render({
                data: {
                  data: { updatedData },
                },
              }) {
                return `Certificate Issued Successfully`;
              },
            },
            error: "Something went wrong Please try again 🤯",
          }
        );

        if (status === 200) {
          navigate("/student/certificate");
        }
      } catch (error) { }
    } else if (!studentid) {
      try {
        const { data, status } = await toast.promise(
          ERPApi.post(
            `${import.meta.env.VITE_API_URL}/sc/addcertificate`,
            updatedData
          ),
          {
            pending: "verifying data",
            success: {
              render({
                data: {
                  data: { updatedData },
                },
              }) {
                return `Certificate Request Submitted Successfully`;
              },
            },
            error: "Something went wrong Please try again 🤯",
          }
        );
        if (status === 201) {
          navigate("/student/certificate");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRevertCertificate = async (e, studentid) => {
    e.preventDefault();

    const updatedData = {
      certificate_status: [],
    };

    const certificateStatus = status;

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to revert this certificate. This action cannot be undone.",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Revert it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data, status } = await ERPApi.put(
            `${import.meta.env.VITE_API_URL}/sc/certificatestatus/${studentid}`,
            updatedData
          );

          if (status === 200) {
            // Display success Swal alert
            Swal.fire({
              title: "Reverted!",
              text: "Certificate Reverted Successfully.",
              icon: "success",
            });

            if (certificateStatus === "issue") {
              navigate("/student/requestedcertificate");
            }
          }
        } catch (error) { }
      }
    });
  };

  return (
    <div>
      <BackButton heading="Certificate Issue Form" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="">
                  <div className="row">
                    <div className="col-lg-6">
                      {/* name */}

                      <div>
                        <label
                          htmlFor="name"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Name<span className="text-danger">*</span>
                        </label>
                        <input
                          className={
                            errors && errors.name
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          type="text"
                          placeholder="Enter Name"
                          id="name"
                          name="name"
                          value={certificateData?.name}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          required
                          disabled={certificateData?.studentid}
                          style={{
                            cursor: certificateData?.studentid
                              ? "not-allowed"
                              : "",
                          }}
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.name && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* email */}
                      <div className="mt-2">
                        <label
                          htmlFor="email"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={
                            errors && errors.email
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter the Email"
                          id="email"
                          name="email"
                          value={certificateData?.email}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={certificateData?.studentid}
                          style={{
                            cursor: certificateData?.studentid
                              ? "not-allowed"
                              : "",
                          }}
                          required
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.email && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* course */}
                      <div className="mt-2">
                        <label
                          className="form-label fs-s fw-medium black_300"
                          htmlFor="courses"
                        >
                          Course<span className="text-danger">*</span>
                        </label>
                        <select
                          className={
                            errors && errors.courses
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          aria-label=""
                          placeholder="Select the Course"
                          name="courses"
                          id="courses"
                          value={certificateData?.courses}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          required
                        >
                          <option value="" disabled selected className="">
                            {" "}
                            Select the Course
                          </option>
                          {courseState?.courses?.map((item, index) => (
                            <option value={item.course_name}>
                              {" "}
                              {item.course_name}
                            </option>
                          ))}
                        </select>
                        <div style={{ height: "8px" }}>
                          {errors && errors.courses && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.courses}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* courseStartDate */}
                      <div className="mt-2">
                        <label
                          htmlFor="courseStartDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Course Start Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={
                            errors && errors.courseStartDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Select the Course Start Date"
                          id="courseStartDate"
                          name="courseStartDate"
                          max={disableCoursestartDate}
                          value={certificateData?.courseStartDate}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          required
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.courseStartDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.courseStartDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {/* registration */}

                      <div>
                        <label
                          htmlFor="registrationnumber"
                          className={
                            !certificateData?.studentid
                              ? "text-decoration-line-through form-label fs-s fw-medium black_300"
                              : "form-label fs-s fw-medium black_300"
                          }
                        >
                          Registration ID<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={
                            errors && errors.registrationnumber
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter Registration ID"
                          id="registrationnumber"
                          name="registrationnumber"
                          value={certificateData?.registrationnumber}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={
                            certificateData?.studentid ||
                            !certificateData?.studentid
                          }
                          style={{
                            cursor:
                              certificateData?.studentid ||
                                !certificateData?.studentid
                                ? "not-allowed"
                                : "",
                          }}
                          required
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.registrationnumber && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.registrationnumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* moblie */}

                      <div className="mt-2">
                        <label
                          htmlFor="mobilenumber"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Mobile<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={
                            errors && errors.mobilenumber
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter Mobile Number"
                          id="mobilenumber"
                          name="mobilenumber"
                          value={certificateData?.mobilenumber}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={certificateData?.studentid}
                          style={{
                            cursor: certificateData?.studentid
                              ? "not-allowed"
                              : "",
                          }}
                          required
                        />

                        <div style={{ height: "8px" }}>
                          {errors && errors.mobilenumber && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.mobilenumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* branch */}
                      <div className="mt-2">
                        <label className="form-label fs-s fw-medium black_300">
                          Branch<span className="text-danger">*</span>
                        </label>
                        <select
                          className={
                            errors && errors.branch
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          aria-label=""
                          placeholder="Select the Branch"
                          name="branch"
                          id="branch"
                          value={certificateData?.branch}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={certificateData?.studentid}
                          style={{
                            cursor: certificateData?.studentid
                              ? "not-allowed"
                              : "",
                          }}
                          required
                        >
                          <option
                            value=""
                            style={{ opacity: "0.5" }}
                            disabled
                            selected
                          >
                            {" "}
                            Select the Branch{" "}
                          </option>
                          {BranchState.branches &&
                            BranchState.branches.length > 0 &&
                            BranchState.branches.map((item) => (
                              <option>{item.branch_name}</option>
                            ))}
                        </select>
                        <div style={{ height: "8px" }}>
                          {errors && errors.branch && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.branch}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* courseEndDate */}
                      <div className="mt-2">
                        <label
                          htmlFor="courseEndDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Course End Date<span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={
                            errors && errors.courseEndDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Select the Course End Date"
                          id="courseEndDate"
                          name="courseEndDate"
                          // min={disableCourseEndDate}
                          max={currentDate}
                          value={certificateData?.courseEndDate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCertificateData((prev) => ({ ...prev, courseEndDate: value }));

                            // Check if end date is before start date
                            if (certificateData.courseStartDate && new Date(value) < new Date(certificateData.courseStartDate)) {
                              setErrors((prev) => ({
                                ...prev,
                                courseEndDate: "Course End Date cannot be earlier than Start Date",
                              }));
                            } else {
                              setErrors((prev) => ({
                                ...prev,
                                courseEndDate: "",
                              }));
                            }
                          }}

                          required
                          disabled={
                            certificateData?.courseStartDate ? false : true
                          }
                          style={{
                            cursor: certificateData?.courseStartDate
                              ? ""
                              : "not-allowed",
                          }}
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.courseEndDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.courseEndDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --IEP--   &&  Intern Ship */}
                  <div className="mt-4 d-flex">
                    <h5>IEP</h5>
                    <p></p>
                    <div className="form-check ms-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="iepStatus"
                        id="iepStatus"
                        onClick={() => {
                          setCertificateData((prev) => ({
                            ...prev,
                            iepStatus: true,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            iepStatus: "",
                          }));
                        }}
                        checked={certificateData?.iepStatus === true}
                      />
                      <label className="form-check-label" htmlFor="iepStatus1">
                        Yes
                      </label>
                    </div>
                    <div className="form-check ms-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="iepStatus1"
                        id="iepStatus1"
                        onClick={() => {
                          setCertificateData((prev) => ({
                            ...prev,
                            iepStatus: false,
                            iepStartDate: "",
                            iepEndDate: "",
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            iepStatus: "",
                          }));
                        }}
                        checked={certificateData?.iepStatus === false}
                      />
                      <label className="form-check-label" htmlFor="iepStatus1">
                        No
                      </label>
                    </div>
                  </div>
                  <div style={{ height: "8px" }}>
                    {errors && errors.iepStatus && (
                      <p className="text-danger m-0 fs-xs">
                        {errors.iepStatus}
                      </p>
                    )}
                  </div>
                  {certificateData?.iepStatus === true && (
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <label
                          htmlFor="iepStartDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          IEP Start Date
                        </label>

                        <input
                          type="date"
                          className={
                            errors && errors.iepStartDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Select the IEP Start Date"
                          id="iepStartDate"
                          name="iepStartDate"
                          // min={disableIepStartDate}
                          max={currentDate}
                          value={certificateData?.iepStartDate}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={
                            certificateData?.iepStatus === true &&
                            !certificateData?.courseEndDate
                          }
                          style={{
                            cursor:
                              certificateData?.iepStatus === true &&
                              !certificateData?.courseEndDate
                                ? "not-allowed"
                                : "default",
                          }}
                          required
                        />

                        <div style={{ height: "8px" }}>
                          {errors && errors.iepStartDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.iepStartDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="iepEndDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          IEP End Date
                        </label>
                        <input
                          type="date"
                          className={
                            errors && errors.iepEndDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Select the IEP End Date"
                          id="iepEndDate"
                          name="iepEndDate"
                          // min={disableIepEndDate}
                          max={currentDate}
                          value={certificateData?.iepEndDate}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={
                            certificateData?.iepStartDate ? false : true
                          }
                          style={{
                            cursor: certificateData?.iepStartDate
                              ? ""
                              : "not-allowed",
                          }}
                          required
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.iepEndDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.iepEndDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 d-flex">
                    <h5>Internship</h5>
                    <p></p>
                    <div className="form-check ms-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="internShipStatus"
                        id="internShipStatus"
                        onClick={() => {
                          setCertificateData((prev) => ({
                            ...prev,
                            internShipStatus: true,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            internShipStatus: "",
                          }));
                        }}
                        checked={certificateData?.internShipStatus === true}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="internShipStatus"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check ms-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="internShipStatus"
                        id="flexRadioDefault2"
                        onClick={() => {
                          setCertificateData((prev) => ({
                            ...prev,
                            internShipStatus: false,
                            internShipStartDate: "",
                            internShipEndDate: "",
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            internShipStatus: "",
                          }));
                        }}
                        value={certificateData?.internShipStatus}
                        checked={certificateData?.internShipStatus === false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="internShipStatus"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  <div style={{ height: "8px" }}>
                    {errors && errors.internShipStatus && (
                      <p className="text-danger m-0 fs-xs">
                        {errors.internShipStatus}
                      </p>
                    )}
                  </div>

                  {certificateData?.internShipStatus === true && (
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <label
                          htmlFor="internShipStartDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Internship Start Date
                        </label>
                        <input
                          type="date"
                          className={
                            errors && errors.internShipStartDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter Registration"
                          id="internShipStartDate"
                          name="internShipStartDate"
                          // min={disableInternShipStartDate}
                          max={currentDate}
                          value={certificateData?.internShipStartDate}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          required
                          disabled={
                            certificateData?.iepStatus === true
                              ? !certificateData?.iepEndDate
                              : certificateData?.internShipStatus === true
                              ? !certificateData?.courseEndDate
                              : ""
                          }
                          style={{
                            cursor:
                              certificateData?.iepStatus === true
                                ? !certificateData?.iepEndDate
                                  ? "not-allowed"
                                  : ""
                                : certificateData?.internShipStatus === true
                                ? !certificateData?.courseEndDate
                                  ? "not-allowed"
                                  : ""
                                : "",
                          }}
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.internShipStartDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.internShipStartDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="internShipEndDate"
                          className="form-label fs-s fw-medium black_300"
                        >
                          Internship End Date
                        </label>
                        <input
                          type="date"
                          className={
                            errors && errors.internShipEndDate
                              ? "form-control fs-s bg-form text_color input_bg_color error-input"
                              : "form-control fs-s bg-form text_color input_bg_color"
                          }
                          placeholder="Enter Mobile Number"
                          id="internShipEndDate"
                          name="internShipEndDate"
                          max={currentDate}
                          value={certificateData?.internShipEndDate}
                          onChange={(e) => handleCertificateIssueFrom(e)}
                          disabled={
                            certificateData?.internShipStartDate ? false : true
                          }
                          style={{
                            cursor: certificateData?.internShipStartDate
                              ? ""
                              : "not-allowed",
                          }}
                          required
                        />
                        <div style={{ height: "8px" }}>
                          {errors && errors.internShipEndDate && (
                            <p className="text-danger m-0 fs-xs">
                              {errors?.internShipEndDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-end mt-3">
                  {/* {id && status === "issue" && (
                    <Button
                      className={"btn btn-danger ms-3"}
                      onClick={(e) => handleRevertCertificate(e, id)}
                    >
                      Revert Certificate
                    </Button>
                  )} */}

                  <Button
                    className={"btn_primary ms-3"}
                    onClick={(e) => handleSubmitCertificate(e)}
                  >
                    {id && status === "issue"
                      ? "Issue Certificate"
                      : "Request Certificate"}


                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateIssueForm;
