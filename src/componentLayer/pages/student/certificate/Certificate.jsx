import { useCallback, useEffect, useRef, useState } from "react";
import "../../../../assets/css/Table.css";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import BackButton from "../../../components/backbutton/BackButton";

import { MdFilterList } from "react-icons/md";
import GateKeeper from "../../../../rbac/GateKeeper";
import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";
import { HiMiniPlus } from "react-icons/hi2";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { debounce } from "../../../../utils/Utils";
import CustomFilters from "../../../../utils/CustomFilters";

export const certificateLoader = async ({ request, params }) => {
  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;

  try {
    const [
      certificateStudentsData,
      BranchesData,
      coursesData,
      counsellorsData,
    ] = await Promise.all([
      ERPApi.get(
        `/sc/listStudentCertificate${queryParams ? queryParams : `?page=1&pageSize=10&search=`
        }`
      ),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`),
      ERPApi.get(`/user/userData`),
    ]);

    const BranchsList = BranchesData?.data.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    }));

    const counsellorsList = counsellorsData?.data?.map(
      (item) => ({
        label: item?.fullname,
        value: item.id,
      })
    );

    const certificateStudentsList = certificateStudentsData.data;

    return {
      coursesList,
      BranchsList,
      counsellorsList,
      certificateStudentsList,
    };
  } catch (error) {
    console.error(error);
    return null
  }
};

const Certificate = () => {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const navigation = useNavigation();

  const { coursesList, BranchsList, counsellorsList, certificateStudentsList } =
    data;

  const initialState = [
    {
      label: "From Date",
      type: "date",
      inputname: "admissionFromDate",
      value: "",
    },
    { label: "TO Date", type: "date", inputname: "admissionToDate", value: "" },
    {
      label: "Course",
      type: "select",
      inputname: "course",
      value: "",
      options: coursesList,
    },
    {
      label: "Counsellor",
      type: "select",
      inputname: "enquiryTakenby",
      value: "",
      options: counsellorsList,
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "branch",
      options: BranchsList,
    },
    // {
    //   label: "Certificate Status",
    //   type: "select",
    //   inputname: "certificateStatus",
    //   value: "",
    //   options: [
    //     { label: "Issued", value: "issued" },
    //     // { label: "not Issued", value: " " },
    //     { label: "Pending", value: "request Submitted" },
    //   ],
    // },

    // {
    //   label: "Student's Type",
    //   type: "select",
    //   inputname: "oldornew",
    //   value: "",
    //   options: [
    //     { label: "Existing Students", value: "newStudents" },
    //     { label: "Old Students", value: "oldStudents" },
    //   ],
    // },
    // {
    //   label: "InternShip Status", type: "select", inputname: "internShipStatus", value: "", options: [
    //     { label: "Issued", value: "InternShip Certificate Issued" },
    //     { label: "Not Issued", value: "InternShip Not Issued" },
    //     { label: "Pending", value: "InternShip Request Submitted" },
    //     // { label: "Not At Issued", value: " " },
    //   ],

    // },
    // {
    //   label: "IEP Status", type: "select", inputname: "iepStatus", value: "", options: [
    //     { label: "Issued", value: "IEP Certificate Issued" },
    //     { label: "Not Issued", value: "IEP Not Issued" },
    //     { label: "Pending", value: "IEP Request Submitted" },
    //     // { label: "Not At Issued", value: " " },
    //   ],
    // },
  ];
  const [searchParams] = useSearchParams();
  const initialPageSize = searchParams.get('pageSize') || 10;
  const initialPage = searchParams.get('page') || 1;
  const [filterData, setFilterData] = useState(initialState);

  const [Qparams, setQParams] = useState({
    search: "",
    page: parseInt(initialPage),
    pageSize: parseInt(initialPageSize),
    admissionFromDate: "",
    admissionToDate: "",
    branch: "",
    course: "",
    certificateStatus: "",
    enquiryTakenby: "",
    oldornew: "",
  });

  const handleSearch = (event) => {
    setQParams({
      ...Qparams,
      search: event.target.value,
    });
  };

  const handlePage = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };

  const handlePerPageChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setQParams({
      ...Qparams,
      page: 1,
      pageSize: selectedValue,
    });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(Qparams);
  }, [Qparams]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        page: param.page,
        pageSize: param.pageSize,
        search: param.search,
        "filter[admissionFromDate]": param.admissionFromDate || "",
        "filter[admissionToDate]": param.admissionToDate || "",
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[certificateStatus]": param.certificateStatus || "",
        "filter[enquiryTakenby]": param.enquiryTakenby || "",
        "filter[oldornew]": param.oldornew || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  return (
    <div>
      <BackButton heading="Certificate" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search input_bg_color text_color "
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      {/* <GateKeeper
                        requiredModule="Student Management"
                        submenumodule="Certificate"
                        submenuReqiredPermission="canCreate"
                      >
                        <Link to="/student/certificateissueform">
                          <button
                            className="btn btn-sm btn_primary fs-13 me-1 margin_top_12"
                            type="button"
                            required
                          >
                            {<HiMiniPlus />}Certificate For Old Students
                          </button>
                        </Link>
                      </GateKeeper> */}

                      <button
                        className="btn btn-sm btn_primary fs-13 me-1 margin_top_12"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5
                      className="offcanvas-title text_color"
                      id="offcanvasRightLabel"
                    >
                      Filters
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="offcanvas-body p-2">
                    <CustomFilters
                      filterData={filterData}
                      Qparams={Qparams}
                      setQParams={setQParams}
                      setFilterData={setFilterData}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card  border-0">
                  <div className="table-container table-scroll">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Course
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Registration ID
                          </th>

                          <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600 text-truncate"
                            title="Course Certificate Status"
                            style={{ maxWidth: "120px" }}
                          >
                            Course Certificate Status
                          </th>
                          {/* <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600 text-truncate"
                            title="Internship Certificate Status"
                            style={{ maxWidth: "120px" }}
                          >
                            Internship Certificate Status
                          </th> */}
                          {/* <th
                            scope="col"
                            className="fs-13 lh-xs  fw-600 text-truncate"
                            title="IEP Certificate Status"
                            style={{ maxWidth: "120px" }}
                          >
                            IEP Certificate Status
                          </th> */}

                          <GateKeeper
                            requiredModule="Student Management"
                            submenumodule="Certificate"
                            submenuReqiredPermission="canUpdate"
                          >
                            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                              Request Certificate
                            </th>
                          </GateKeeper>

                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            PDF&apos;s
                          </th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {certificateStudentsList?.students &&
                          certificateStudentsList?.students.length > 0 ? (
                          certificateStudentsList?.students.map(
                            (item, index) => {
                              const currentDate = new Date()
                                .toISOString()
                                .split("T")[0];
                              let certificateStatusObj =
                                item?.certificate_status;

                              if (typeof certificateStatusObj === "string") {
                                certificateStatusObj =
                                  JSON.parse(certificateStatusObj);
                              }

                              // certificate Status
                              const certificateStatus = certificateStatusObj
                                ?.map((item) => item?.certificateStatus)
                                .join(", ");

                              return (
                                <tr key={index + 1}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {(certificateStudentsList?.currentPage -
                                      1) *
                                      certificateStudentsList.pageSize +
                                      index +
                                      1}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item.name}
                                  >
                                    {item?.name}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item.courses}
                                  >
                                    {item?.courses}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.registrationnumber}
                                  </td>

                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {certificateStatus === ""
                                      ? "Not At Issued"
                                      : certificateStatus ===
                                        "request Submitted"
                                        ? "Pending"
                                        : certificateStatus === "issued"
                                          ? "Issued"
                                          : ""}
                                  </td>

                                  {/* <td
                                    className="fs-13 black_300 lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                  >
                                    {item?.certificate_status[0]?.internShip
                                      ?.internShipCertificateStatus
                                      ? item?.certificate_status[0]?.internShip
                                          ?.internShipCertificateStatus ===
                                        "InternShip Not Issued"
                                        ? "Not Issued"
                                        : item?.certificate_status[0]
                                            ?.internShip
                                            ?.internShipCertificateStatus ===
                                          "InternShip Request Submitted"
                                        ? "pending"
                                        : "Issued"
                                      : "Not At Issued"}
                                  </td> */}

                                  {/* <td
                                    className="fs-13 black_300 lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                  >
                                    {item?.certificate_status[0]?.iep
                                      ?.iepCertificateStatus
                                      ? item?.certificate_status[0]?.iep
                                          ?.iepCertificateStatus ===
                                        "IEP Not Issued"
                                        ? "Not Issued"
                                        : item?.certificate_status[0]?.iep
                                            ?.iepCertificateStatus ===
                                          "IEP Request Submitted"
                                        ? "pending"
                                        : "Issued"
                                      : "Not At Issued"}
                                  </td> */}

                                  <GateKeeper
                                    requiredModule="Student Management"
                                    submenumodule="Certificate"
                                    submenuReqiredPermission="canUpdate"
                                  >
                                    <td className="fs-13 black_300  lh-xs bg_light">
                                      {certificateStatus === "" && (
                                        <Link
                                          to={`/student/certificateissueform/request/${item?.registrationnumber}`}
                                        >
                                          <div
                                            className={
                                              certificateStatus === ""
                                                ? "rounded btn_primary font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text-white"
                                                : " rounded  btn_pending font-size-xxs fw-100 btn-block text-center  pt-1 pb-1 text-white"
                                            }
                                            type="button"
                                            required
                                          >

                                            Request Certificate
                                          </div>
                                        </Link>
                                      )}

                                      {certificateStatus ===
                                        "request Submitted" && (
                                          <div
                                            className=" rounded  btn_pending font-size-xxs fw-100 btn-block text-center  pt-1 pb-1 text-white"
                                            type="button"
                                            required
                                            style={{ cursor: "not-allowed" }}
                                            aria-disabled
                                          >
                                            Pending Request
                                          </div>
                                        )}

                                      {certificateStatus === "issued" && (
                                        <div
                                          className="  rounded font-size-xxs  btn_certificate_submit fw-100 text-center pt-1 pb-1 ps-1 text-white"
                                          type="button"
                                          aria-disabled
                                          style={{ cursor: "not-allowed" }}
                                        >
                                          Certificate Submitted
                                        </div>
                                      )}
                                    </td>
                                  </GateKeeper>

                                  <GateKeeper
                                    requiredModule="Student Management"
                                    submenumodule="Certificate"
                                    submenuReqiredPermission="canRead"
                                  >
                                    <td className="fs-13 black_300  lh-xs bg_light">
                                      {certificateStatus === "issued" ? (
                                        <Link
                                          className="m-2"
                                          title="Course Cerificate"
                                          // to={`/student/certificateprint/${item?.registrationnumber}`}
                                          to={`/student/internshipcertificate/${item?.registrationnumber}`}
                                        >
                                          <FaFilePdf className="text_color fs-12" />
                                        </Link>
                                      ) : (
                                        <span className="text_color fs-12 m-2">
                                          NA
                                        </span>
                                      )}

                                      {/* {item?.certificate_status[0]?.internShip
                                        ?.internShipCertificateStatus ===
                                      "InternShip Certificate Issued" ? (
                                        <Link
                                          className="m-2"
                                          title="InternShip"
                                          to={`/student/internshipcertificate/${item?.registrationnumber}`}
                                        >
                                          <FaFilePdf className="text_color fs-12" />
                                        </Link>
                                      ) : (
                                        <span className="text_color fs-12 m-2">
                                          {" "}
                                          NA
                                        </span>
                                      )} */}

                                      {/* {item?.certificate_status[0]?.iep
                                        ?.iepCertificateStatus ===
                                      "IEP Certificate Issued" ? (
                                        <Link
                                          className="m-2"
                                          title="IEP"
                                          to={`/student/iepcertificate/${item?.registrationnumber}`}
                                        >
                                          <FaFilePdf className="text_color fs-12" />
                                        </Link>
                                      ) : (
                                        <span className="text_color fs-12 m-2">
                                          {" "}
                                          NA
                                        </span>
                                      )} */}
                                    </td>
                                  </GateKeeper>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              No data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: certificateStudentsList?.students?.length,
                        start: certificateStudentsList?.startStudent,
                        end: certificateStudentsList?.endStudent,
                        total: certificateStudentsList?.searchResultStudents,
                      }}
                      loading={navigation?.state === "loading"}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color text_color pagination-select"
                        aria-label="Default select example"
                        placeholder="pageSize*"
                        name="pageSize"
                        id="pageSize"
                        required
                        onChange={(e) => handlePerPageChange(e)}
                        value={Qparams?.pageSize}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <div className="">
                      <Pagination
                        currentPage={certificateStudentsList?.currentPage}
                        totalPages={certificateStudentsList?.totalPages}
                        loading={navigation?.state === "loading"}
                        onPageChange={handlePage}
                      />
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
export default Certificate;
