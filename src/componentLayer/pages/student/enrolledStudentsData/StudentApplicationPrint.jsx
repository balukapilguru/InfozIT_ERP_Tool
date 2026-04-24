import React from "react";
import "../../../../assets/css/StudentApplicationPrint.css";
import { useReactToPrint } from "react-to-print";
import { IoMdMail } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import useFormattedDate from "../../../../dataLayer/hooks/useFormattedDate";
import { PiAtBold } from "react-icons/pi";
import { useFetcher, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultBG from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { useLoaderData } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext.jsx";
import mainLogo from "../../../../assets/images/mainlogo/mainlogoteks.png"
import TeksversityLogo from "../../../../assets/images/TeksversityLogo.webp"


export const studentApplicationPrintLoader = async ({ params }) => {
  try {
    const { data, status } = await ERPApi.get(
      `/student/viewstudentdata/${params?.id}`
    );
    if (status === 200) {
      const studentData = data?.student[0];
      return { studentData };
    }
  } catch (error) {
    console.error(error);
    return null
  }
};

export const studentApplicationPrintAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    return toast.promise(
      ERPApi.post(`/student/sendstudentpdf`, formData),
      {
        pending: "Sending PDF...",
        success: "PDF sent successfully!",
        error: "Failed to send PDF ",
      }
    );
  } catch (error) {
    console.error("Error sending PDF:", error);
    toast.error("An error occurred while sending the PDF.");
    return { success: false, message: "An error occurred while sending the PDF." };
  }
};

const StudentApplicationPrint = () => {
  const { AuthState } = useAuthContext()
  const fetcher = useFetcher()
  const data = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState()
  const studentdata = data?.studentData;
  const componentRefff = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRefff.current,
  });

  let BirthDate = useFormattedDate(studentdata?.birthdate);
  let EnquiryDate = useFormattedDate(studentdata?.enquirydate);
  let AdmissionDate = useFormattedDate(studentdata?.admissiondate);
  let CourseStartDate = useFormattedDate(studentdata?.validitystartdate);
  let ExpectedEndDate = useFormattedDate(studentdata?.validityenddate);
  let IssueDate = useFormattedDate(studentdata?.admissiondate);

  // const branchLogoImage = AuthState?.user
  // const branchLogo = branchLogoImage?.branch_setting?.logoName
  //   ? `https://teksversity.s3.us-east-1.amazonaws.com/branches/logos/${branchLogoImage?.branch_setting?.logoName}`
  //   : null;
  const handleDownloadPDF = async () => {
    setIsSubmitting(true);
    const input = componentRefff.current;

    html2canvas(input, { scale: 1.5, useCORS: true }).then(async (canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      const pdf = new jsPDF({ compress: true });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");

      const pdfFile = new File([pdfBlob], "Student_Application.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("email", studentdata?.email || "");
      formData.append("mobilenumber", studentdata?.mobilenumber || "");
      formData.append("studentName", studentdata?.name)
      fetcher.submit(formData, {
        method: "POST",
        encType: "multipart/form-data",
      });
    });
  };

  return (
    <div>
      <BackButton heading="Student Application Print" content="Back" />
      <div className="container-fluid">
        <div className="card">
          <div className="text-end p-3">
            <Button className="btn btn_primary me-2 " onClick={handlePrint}>
              <MdLocalPrintshop /> Print
            </Button>
            <Button className="btn btn_primary me-2 " onClick={handleDownloadPDF} disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? "Sending..." : "Send PDF"}
            </Button>
          </div>
          <div className="container-fluid " ref={componentRefff}>
            <div className="page">
              <div className="application">
                <div className="row">
                  <div className="col-12 col-md-5 col-lg-5 col-xl-5">
                    <h5 className="black_300 fw-600 fs_18 p-0 ms-3">
                      Teksversity
                    </h5>
                    {/* <p className="p-0 fs-14 black_300 ms-3">
                      {" "}
                      CIN: U80100TG2018PTC123853
                    </p> */}
                    <p className="p-0 fs-14 black_300 ">
                      {" "}
                      <IoMdMail className="fs-16 ms-3" /> info@teksversity.com
                    </p>
                    <p className="p-0 fs-14 black_300">
                      <IoCall className="fs-16 ms-3" />
                      8096910263{" "}
                    </p>
                    <p className="p-0 fs-14 black_300">
                      {" "}
                      <PiAtBold className="fs-16 ms-3" />
                      https://teksversity.com
                    </p>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 col-xl-6 text-center ">
                    <img
                      src={TeksversityLogo}
                      alt="Branch Logo"
                      className=" w-50"

                    />
                    <p className="fs-15 mt-4 black_300">
                      <b className="">Branch:</b> {studentdata?.branch}
                    </p>
                  </div>
                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center caption p-2">
                        Students Details
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-md-7 col-lg-8 col-xl-8 ">
                        <div className="">
                          <div className="table table-responsive  table-bordered  d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody className="">
                                <tr className="">
                                  <td
                                    className="fs-13 black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Name
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td ">
                                    {studentdata?.name}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35 "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Email Address
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td college-wrap">
                                    {studentdata?.email}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Mobile&nbsp;Number
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.mobilenumber}
                                  </td>
                                </tr>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35 w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Date of Birth
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {BirthDate}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td bg-head w-35"
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Gender
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {studentdata?.gender}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className=" col-12 col-md-5 col-lg-4 col-xl-4  text-center mt-2">
                        {!studentdata?.studentImg && (
                          <img src={DefaultBG} alt="photo" />
                        )}

                        {studentdata?.studentImg && (
                          <img
                            // src={`https://teksacademyimages.s3.amazonaws.com/${studentdata?.studentImg}`}
                            src={`https://teksversity.s3.us-east-1.amazonaws.com/erp/studentManagement/regStudentImgs/${studentdata?.studentImg}`}
                            className="w-50 admform-sd  "
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center admission_detail caption p-2">
                        {" "}
                        Admission Details
                      </h5>
                    </div>

                    <div className="student-data row">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Enquiry&nbsp;Taken
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {EnquiryDate ? EnquiryDate : "No Date"}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Reg&nbsp;Number
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.registrationnumber}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-14  black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Enquiry&nbsp;Taken By
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.enquirytakenby}
                                  </td>


                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Admission&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {AdmissionDate ? AdmissionDate : "No Date"}
                                  </td>

                                  {/* <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Lead&nbsp;Source
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {Array.isArray(studentdata?.leadsource) ? (
                                      studentdata.leadsource.map((source) => (
                                        <td
                                          className="borderleft"
                                          key={source.id}
                                        >
                                          {source.source}
                                        </td>
                                      ))
                                    ) : (
                                      <td className="borderleft">
                                        {studentdata?.leadsource}
                                      </td>
                                    )}
                                  </td> */}
                                </tr>

                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course&nbsp;Package
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.coursepackage}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {studentdata?.courses}
                                  </td>
                                </tr>

                                <tr>


                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Course&nbsp;Start&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300  application-tbl-td">
                                    {CourseStartDate
                                      ? CourseStartDate
                                      : "No Date"}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600  application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Mode&nbsp;Of&nbsp;Training
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata?.modeoftraining}
                                  </td>
                                </tr>


                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-3 ">
                    <div className="">
                      <h5 className=" text-center fee_detail caption p-2">
                        Fee Details
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Fee&nbsp;Type
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Fee&nbsp;Amount
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Discount
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Tax
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Total&nbsp;Fee
                                  </td>
                                </tr>

                                {studentdata?.feedetails &&
                                  studentdata?.feedetails.map((item, index) => (
                                    <tr key={index}>
                                      <td className="fs-13 black_300 application-tbl-td">
                                        {item.feetype}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {Number(
                                          parseFloat(item.amount).toFixed(2)
                                        ).toLocaleString("en-IN")}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {item.discount &&
                                          Number(
                                            parseFloat(item.discount).toFixed(2)
                                          ).toLocaleString("en-IN")}

                                        {!item.discount && <>0</>}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {" "}
                                        {Number(
                                          parseFloat(item.taxamount).toFixed(2)
                                        ).toLocaleString("en-IN")}
                                      </td>

                                      <td className="fs-13 black_300 application-tbl-td">
                                        {Number(
                                          parseFloat(item.totalamount).toFixed(
                                            2
                                          )
                                        ).toLocaleString("en-IN")}{" "}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="  mt-3 ">
                    <div className="">
                      <h5 className=" text-center caption  asset p-2">
                        {" "}
                        Assets
                      </h5>
                    </div>

                    <div className="row student-data">
                      <div className="col-12 col-lg-12 col-sm-6 col-md-12">
                        <div className="">
                          <div className="table table-responsive   d-flex">
                            <table className="table align-middle table-nowrap  mb-0">
                              <tbody>
                                <tr className="application-tbl-td">
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Provided
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td">
                                    {studentdata &&
                                      Array.isArray(studentdata.assets) &&
                                      studentdata.assets.map((item, index) => {
                                        const displayItem =
                                          item === "bag"
                                            ? "Note Book"
                                            : item === "laptop"
                                              ? "Pen"
                                              : item;

                                        return (
                                          <React.Fragment key={index}>
                                            {displayItem}
                                            {index !== studentdata.assets.length - 1 && <span>, </span>}
                                          </React.Fragment>
                                        );
                                      })}
                                  </td>

                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgroundColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Issue&nbsp;Date
                                  </td>

                                  <td className="fs-13 black_300 application-tbl-td ">
                                    {IssueDate}
                                  </td>
                                </tr>

                                <tr className="application-tbl-td">
                                  {" "}
                                  <td
                                    className="fs-14 lh-xs black_300 fw-600 application-tbl-td "
                                    style={{
                                      backgrounColor:
                                        "var(--erp-applicationprint-header-color)",
                                    }}
                                  >
                                    Comments
                                  </td>
                                  <td
                                    className="fs-13 black_300 application-tbl-td "
                                    colSpan={4}
                                  >
                                    {studentdata?.admissionremarks}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    className="fs-13 black_300 fw-600 text-start application-tbl-td "
                                    colSpan={5}
                                    rowSpan={3}
                                  >
                                    For&nbsp;Office&nbsp;Purpose
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="row justify-content-center mt-4 "> */}

                  <div className="col-lg-12   terms-and-condition mt-4">
                    <div className="application-tbl-td ">
                      <h5 className=" text-center caption p-2 m-0 me-0 ms-0">
                        Terms and condition
                      </h5>
                    </div>

                    <div className="application-tbl-td p-3">
                      <div className=" ps-4">
                        <p className="fs-14 fw-600 black_300">
                          {" "}
                          Teksversity is the Learning Management System managed by the Talent Strategy Team which oversees the Learning & Development needs for Kapil Group and its associated companies. Kapil Group may be referred to as ‘the Group’, Talent Strategy team may be referred to as ‘the Team’ and Teksversity may be referred to as ‘the LMS’ below. Users of Teksversity could be the Students of the Group as well as the Channel Partners (aka, Agents or Wealth Advisors). They may jointly be referred to as ‘students’ or ‘Students’.
                        </p>
                      </div>
                      <div className=" ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          1.Admission:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The eligibility criteria for each course will be clearly communicated to the students before admission, and students must provide all required documents and information during the course enrolment process.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2. Enrolment will be confirmed only after the completion of all formalities and payment of full fees.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300"> 2. Fees:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Teksversity offers courses which are free of
                          charge to Kapil Group’s Students, and channel partners.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The respective business units or companies may
                          have to pick up the cost associated with the course development,
                          delivery and any logistics involved.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          3. Course Material:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The course material and digital goods provided by the
                          Talent Strategy within Teksversity is copyrighted and cannot be
                          reproduced or used for commercial purposes without permission.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.None of the digital sources are to be downloaded,
                          printed or circulated without the permission of the Director of Talent Strategy.
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          3.Any damage or loss of course material will be the
                          responsibility of the student and may attract additional
                          charges for extra material.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          {" "}
                          4. Attendence:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Regular attendance is essential for successfully
                          completing the course and obtaining a certificate.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Students must inform the Talent Strategy Team in
                          advance if they are unable to attend a class due to valid
                          reasons such as illness or emergencies.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3. Make-up classes may be arranged at the discretion of the
                          Talent Strategy Management and subject to availability of resources.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 ">5. Conduct</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Students must conduct themselves respectfully towards the staff,
                          fellow students, and the company property.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Any form of harassment, discrimination, or bullying will not be
                          tolerated and may lead to immediate expulsion from the company.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.The use of drugs or alcohol within the
                          company premises is strictly prohibited and may
                          lead to immediate expulsion.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 next-page  student-data">
                          6. Certification :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The use of drugs or alcohol within the company premises
                          is strictly prohibited and may lead to immediate expulsion.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The certificate does not guarantee employment or acceptance
                          into any institution.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">7. Liablity:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The company may revise its policies, rules and regulations, course structure, fees, timings,
                          or any other aspect of the coaching center from time to time without prior notice to the students.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The revised policies will be applicable to all existing and new students.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          8. Dispute Resolutions:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.Any dispute arising out of or related to these terms and
                          conditions shall be resolved amicably through mutual
                          discussion and agreement between the Talent Strategy team and the student.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          9. Termination of Admission:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.The Team reserves the right to terminate the enrolment
                          of any student at any time, without assigning any reason.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          10. Copying Teksversity Content:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.· Copying or distributing any of the course material,
                          including lectures, notes, presentations, or any other content,
                          is strictly prohibited Any violation of this rule may lead to
                          immediate termination from the Group and legal action may be taken
                          against the student.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600  black_300">
                          11.Absconding:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Absconding, or leaving the course without informing
                          the Team management, is not permitted. In case a student
                          wishes to discontinue the course,
                          they must inform their manager and send an email to
                          teksversity@kapilgroup.com with their approval.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 ">
                          12. Attendance and Absence:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Regular attendance is important for the successful completion of the course.
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          2. Students must inform the Team in advance
                          if they are unable to attend a class due to valid
                          reasons such as illness or emergencies.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300 next-page  student-data">
                          13. Teaching Staff:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. While the Team will endeavor
                          to provide training with a specific teaching staff,
                          there is no commitment to do so.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2. The center reserves the right to
                          assign trainers on the basis of availability,
                          and students cannot demand a specific trainer.
                        </p>
                      </div>
                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          14. Course Fees:
                        </h5>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. Although the current courses on Teksversity
                          are offered free of charge,
                          the Team reserves the right to change
                          the Course Fees at any time without prior notice.
                        </p>
                      </div>
                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          15. Course Curriculum:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The Team reserves the right to update the
                          course curriculum as per its requirements,
                          without any prior notice to the students.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.Students are expected to keep themselves
                          updated with any changes in the course curriculum.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          16. Course Duration:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The course duration may vary from batch to batch,
                          depending on factors such as student’s attendance,
                          training methodology, and other relevant factors as determined by the Team
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2. The Team reserves the right to change the course
                          duration at any time without prior notice.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          17. PProject Assignment:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1. The Talent Strategy will provide practice projects
                          to the students for their learning and skill development.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The projects assigned may be either
                          live or previous completed projects,
                          depending on availability and suitability.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3.Students must complete the project within the given
                          time frame and submit it for evaluation.
                        </p>

                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          18. Intellectual Property:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          1.All intellectual property created by students during the
                          live project or internship will belong to the student.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          2.The Team and the Group may use
                          such intellectual property for promotional
                          or educational purposes with the student’s consent.
                        </p>

                        <p className="black_300 fs-14 ms-3">
                          3. The Team will not claim any
                          ownership rights over the student’s intellectual property.
                        </p>
                      </div>

                      <div className="ps-4 student-data">
                        {" "}
                        <h5 className="fs-14 fw-600 next-page student-data  pb-2 black_300">
                          Privacy Policy:
                        </h5>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300  student-data">
                          1. Information Collection :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We collect personal information such as name, email
                          We collect personal details such as name, email address,
                          phone number, and other contact information when users enrol
                          in our courses or submit forms on our website, social media pages,
                          or advertising platforms like Meta (Facebook/Instagram).
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          2. Use Of Information:
                        </h5>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          The collected information is used to:
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          a. Share course-related updates and schedules
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          b. Provide learning materials and certification
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          c. Respond to inquiries and support requests
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          d. It is necessary to deliver services via authorized platforms (e.g., CRM, LMS tools)
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          3. Consent for Advertising Platforms:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          By submitting your information through forms (including Meta Lead Ads),
                          you consent to the use of that data to contact you regarding our services.
                          Your data will only be used for the purpose specified in the form.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">4. Information Sharing:</h5>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We do not share your personal data with third parties unless:
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          a. You have given explicit permission
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          b. Required by law or legal obligations
                        </p>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          c. Respond to inquiries and support requests
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">5. Cookies:</h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          Our website uses cookies to enhance user experience and collect analytical data.
                          You may disable cookies in your browser settings if you prefer not to be tracked.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          6. Data Retention :
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          We retain personal data only as long as necessary
                          to fulfil the purpose for which it was collected,
                          or until a deletion request is submitted by the user.
                        </p>
                      </div>

                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          7. Policy Updates:
                        </h5>

                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          Kapil Group reserves the right to modify this privacy policy at any time.
                          Any changes will be posted on our official platforms without prior notice
                        </p>
                      </div>
                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          8. Contact Us:
                        </h5>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          For any questions or concerns about our privacy practices,
                          please contact us at: Email: info@teksversity.com
                        </p>
                      </div>
                      <div className="ps-4">
                        <h5 className="fs-14 fw-600 black_300">
                          NOTE:
                        </h5>
                        <p className="black_300 fs-14 ms-3">
                          {" "}
                          By signing into Teksversity, you acknowledge that you have read,
                          understood, and agree to abide by our terms and conditions and privacy policy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplicationPrint;
