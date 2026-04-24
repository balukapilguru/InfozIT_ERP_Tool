import React, { useCallback, useEffect, useRef, useState } from 'react'

import PaginationInfo from '../../../../../utils/PaginationInfo';
import CustomFilters from '../../../../../utils/CustomFilters';
import GateKeeper from '../../../../../rbac/GateKeeper';
import { MdFilterList } from 'react-icons/md';
import { Link, useFetcher, useLoaderData, useNavigation, useSubmit } from 'react-router-dom';
import { debounce } from '../../../../../utils/Utils';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { AiFillEye } from 'react-icons/ai';
import Pagination from '../../../../../utils/Pagination';


export const OverDueFeeRecordsListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const queryParams = url.search || "?page=1&pageSize=10&search=";
  try {
    const [
      OverDueFeeRecordsData,
      BranchesData,
      coursesData,
      counsellorsData,
      leadSourceData,
    ] = await Promise.all([
      ERPApi.get(`/fee/overduefeerecords${queryParams}`),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`),
      ERPApi.get(`/user/userdata`),
      ERPApi.get(`/settings/getleadsource`),
    ]);

    const BranchsList = BranchesData?.data.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    })) || [];

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    })) || [];

    const counsellorsList = counsellorsData?.data?.map(
      (item) => ({
        label: item?.fullname,
        value: item.id,
      })
    ) || [];

    const leadSourceList = leadSourceData?.data?.map((item) => ({
      label: item?.leadsource,
      value: item?.id,
    }))

    const OverDueFeeRecordsList = OverDueFeeRecordsData.data || [];

    return {
      leadSourceList,
      coursesList,
      BranchsList,
      counsellorsList,
      OverDueFeeRecordsList,

    };
  } catch (error) {
    console.error(error);
    return null;
  }
}



const OverDueFeeRecordsList = () => {
  const data = useLoaderData();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const { leadSourceList, coursesList, BranchsList, counsellorsList, OverDueFeeRecordsList, } = data;


  const navigation = useNavigation();

  const initialState = [
    {
      label: "Admission FromDate",
      type: "date",
      inputname: "admissionFromDate",
      value: "",
    },
    { label: " Admission ToDate", type: "date", inputname: "admissionToDate", value: "" },
    {
      label: "From Date",
      type: "date",
      inputname: "fromDate",
      value: "",
      max: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    },
    { label: "TO Date", type: "date", inputname: "toDate", value: "", max: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] },
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
    //   label: "Mode Of Training",
    //   type: "select",
    //   inputname: "modeOfTraining",
    //   value: "",
    //   options: [
    //     { label: "Online", value: "online" },
    //     // { label: "not Issued", value: " " },
    //     { label: "Offline", value: "offline" },
    //   ],
    // },

    // {
    //   label: "Lead Source",
    //   type: "select",
    //   inputname: "leadsource",
    //   value: "",
    //   options: leadSourceList,
    // },

  ];

  const [filterData, setFilterData] = useState(initialState);

  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    fromDate:"",
    toDate:"",
    admissionFromDate: "",
    admissionToDate: "",
    branch: "",
    course: "",
    modeOfTraining: "",
    enquiryTakenby: "",
    leadsource: "",
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
        "filter[fromDate]": param.fromDate || "",
        "filter[toDate]": param.toDate || "",
        "filter[admissionFromDate]": param.admissionFromDate || "",
        "filter[admissionToDate]": param.admissionToDate || "",
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[modeOfTraining]": param.modeOfTraining || "",
        "filter[enquiryTakenby]": param.enquiryTakenby || "",
        "filter[leadsource]": param.leadsource || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-0">
            <div className="card-header">
              <div className="row justify-content-between">
                <div className="col-sm-4">
                  <div className="search-box">
                    <input
                      type="search"
                      className="form-control search text_color input_bg_color select"
                      placeholder="Search for..."
                      name="search"
                      required
                    onChange={(e) => handleSearch(e)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="buttons_alignment">
                    <div className="fs-13 me-3 mt-2 text_color">
                    </div>
                    <button
                      className="btn btn-sm btn_primary fs-13 me-1"
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
                className="offcanvas offcanvas-end bg_white text_color"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5
                    className="offcanvas-title"
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
              <div className="table-responsive table-container table-scroll table-card  border-0">

                <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                  <thead>
                    <tr className="">
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 "
                      >
                        S.No
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600  "
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600  "
                      >
                        Branch
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600  "
                      >
                        CreatedBy
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600  "
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600 "
                      >
                        Course
                      </th>

                      {/* <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600 "
                      >
                        Lead Source
                      </th> */}
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600 "
                      >
                        Due&nbsp;Date
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600 "
                      >
                        Due&nbsp;Amount
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs  fw-600 "
                      >
                        Paid&nbsp;Status
                      </th>
                      <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 "
                        >
                          Action
                        </th>
                      </GateKeeper>
                    </tr>
                  </thead>
                  <tbody>

                    
                    {
                      OverDueFeeRecordsList?.overDueFeeRecords && OverDueFeeRecordsList?.overDueFeeRecords?.length > 0 ?
                      OverDueFeeRecordsList?.overDueFeeRecords?.map((item, index) => {
                        return (
                          <tr key={index + 1}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {(OverDueFeeRecordsList?.currentPage - 1) * OverDueFeeRecordsList.pageSize + index + 1}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}>
                              {item?.name}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                            {item?.branches?.branch_name}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.enquirytakenby}>
                              {item?.userId?.fullname}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.mobilenumber}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.courses} >
                              {item?.courses}
                            </td>

                            {/* <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.leadsource[0]?.source}>
                              {item?.leadsource[0]?.source}
                            </td> */}
                            <td className="fs-13 black_300  lh-xs bg_light ">
                              {item?.nextduedate}
                            </td>
                            <td className="fs-13 black_300  lh-xs  bg_light">
                              {Number(
                                parseFloat(item.dueamount).toFixed(2)
                              ).toLocaleString("en-IN")}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light ">
                              {item?.totalinstallments && item?.totalinstallments.length > 0 ?
                                `${item?.totalinstallments[0].totalinstallmentspaid}/${item?.totalinstallments[0]?.totalinstallments}` :
                                '-'
                              }
                            </td>
                            <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                              <td className="fs_14 text_mute bg_light lh-xs ">
                                <Link
                                  // to={`/student/feeview/${item.id}`}
                                 to={`/student/feeUpdate?studentId=${item?.id}`}
                                >
                                  <AiFillEye className=" me-3" />
                                </Link>
                              </td>
                            </GateKeeper>
                          </tr>

                        )
                      })
                        :
                        (<tr>
                          <td className="fs-13 black_300  lh-xs bg_light ">
                            No Data
                          </td>
                        </tr>)
                    }



                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                <div className="col-sm">
                  <PaginationInfo
                    data={{
                      length: OverDueFeeRecordsList?.overDueFeeRecords?.length,
                      start: OverDueFeeRecordsList?.startStudent,
                      end: OverDueFeeRecordsList?.endStudent,
                      total: OverDueFeeRecordsList?.searchResultStudents,
                    }}
                    loading={navigation?.state === "loading"}
                  />
                </div>
                <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                  <div className="mt-3">
                    <select
                      className="form-select form-control me-3 text_color input_bg_color pagination-select"
                      aria-label="Default select example"
                      placeholder="Branch*"
                      name="branch"
                      id="branch"
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
                      currentPage={OverDueFeeRecordsList?.currentPage}
                      totalPages={OverDueFeeRecordsList?.totalPages}
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
  )
}

export default OverDueFeeRecordsList;
