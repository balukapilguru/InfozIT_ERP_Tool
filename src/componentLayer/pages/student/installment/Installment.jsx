import React, { useCallback, useEffect, useRef, useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import Filter from "../../../../utils/Filter";
import { MdFilterList } from "react-icons/md";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { useFetcher, useLoaderData, useNavigation, useSubmit, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { debounce } from "../../../../utils/Utils";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import CustomFilters from "../../../../utils/CustomFilters";
import { TbArrowBackUp } from "react-icons/tb";
import GateKeeper from "../../../../rbac/GateKeeper";
import AddBankAccountToInstallment from "./AddBankAccountToInstallment";
export const studentInstallmentLoader = async ({ request }) => {
  const url = new URL(request.url);
  const queryParams = url.search;

  try {
    const [installmentsResponse, admissionsResponse, BranchesData] = await Promise.all([
      ERPApi.get(`/fee/list_of_installments${queryParams ? queryParams : `?page=1&pageSize=10&search=`}`),
      ERPApi.get(`/fee/list_of_Admissions${queryParams ? queryParams : `?page=1&pageSize=10&search=`}`),
      ERPApi.get(`/settings/getbranch`),
    ]);

    const BranchsList = BranchesData.data.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));
    return {
      installmentData: installmentsResponse?.data,
      admissionData: admissionsResponse?.data,
      BranchsList
    };
  } catch (error) {
    console.error(error);
    return { installmentData: null, admissionData: null, BranchsList: null };
  }
};

export const studentApproveAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const installmentId = formData.get("installmentId");
    const admissionFeeId = formData.get("admissionFeeId");

    const payload = installmentId ? { installmentId } : { admissionFeeId };

    const response = await toast.promise(
      ERPApi.post(`/fee/sendingdatatokapil`, payload),
      {
        pending: `Approving..., Please Wait! `,
        // success: "Approve successfully!",
        // error: "Failed to send PDF ",
      }
    );
    if (response?.status === 200) {
      return { success: true, message: "Approved." };
    } else {
      return { success: false, message: "Approval failed." };
    }
  } catch (error) {
    return { success: false, message: error };
  }
};

const Installment = () => {
  const fetcher = useFetcher();
  let submit = useSubmit();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { installmentData, admissionData, BranchsList } = useLoaderData();
  const [showInstallment, setshowInstallment] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const intialState = [
    {
      label: "fromDate",
      type: "date",
      inputname: "fromDate",
      value: "",
    },
    {
      label: "toDate",
      type: "date",
      inputname: "toDate",
      value: "",
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "branchId",
      options: BranchsList,
    },
    {
      label: "Status",
      type: "select",
      value: "",
      inputname: "sendToKapilApi",
      options: [{ label: "Approved", value: 1 }, { label: "Not-Approved", value: 0 }],
    },
  ];
  const [filterData, setFilterData] = useState(intialState)
  const currentUrl = useRef(new URL(window.location.href));

  const [Qparams, setQParams] = useState(() => {
    const urlSearchParams = currentUrl.current.searchParams;
    return {
      search: urlSearchParams.get('search') || '',
      page: parseInt(urlSearchParams.get('page') || '1', 10),
      pageSize: parseInt(urlSearchParams.get('pageSize') || '10', 10),
      branchId: urlSearchParams.get('filters[branchId]') || '',
      fromDate: urlSearchParams.get('filters[fromDate]') || '',
      sendToKapilApi: urlSearchParams.get('filters[sendToKapilApi]') || '',
      toDate: urlSearchParams.get('filters[toDate]') || '',
    };
  });

  useEffect(() => {
    setSearchInput(Qparams.search);
  }, [Qparams.search]);

  const isFirstRender = useRef(true);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    setQParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1,
    }));
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

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        page: param.page,
        pageSize: param.pageSize,
        search: param.search,
        'filters[branchId]': param.branchId || '',
        'filters[fromDate]': param.fromDate || '',
        'filters[toDate]': param.toDate || '',
        'filters[sendToKapilApi]': param.sendToKapilApi || '',
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    [submit]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (currentUrl.current.search) {
        navigate(currentUrl.current.pathname, { replace: true });
        setQParams({
          search: '',
          page: 1,
          pageSize: 10,
          branchId: '',
          fromDate: '',
          toDate: '',
          sendToKapilApi: '',
        });
        setSearchInput('');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!isFirstRender.current) {
      debouncedParams(Qparams);
    }
  }, [Qparams, debouncedParams]);

  const handleApprove = async (id, type) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      text: `Once Approved, the ${type === "admission" ? "Admission" : "Installment"} cannot be Retrieved or Reversed.`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ok!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = type === "admission" ? { admissionFeeId: id } : { installmentId: id };
        fetcher.submit(payload, {
          method: "POST",
        });
      }
    });
  };

  useEffect(() => {
    if (fetcher.data) {
      const errorMessage = fetcher.data.message?.response?.data?.error;

      if (fetcher.data.success) {
        Swal.fire({
          title: "Approved Successfully !",
          text: `The ${fetcher.data.type === "admission" ? "admission fee" : "installment"} has been successfully approved.`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Approving Failed!",
          text: errorMessage ? errorMessage : "Something went wrong while Approving! Please try again.",
          icon: "error",
        });
      }
    }
  }, [fetcher.data]);


  const resetFilters = () => {
    const newQParams = {
      search: '',
      page: 1,
      pageSize: 10,
      branchId: '',
      fromDate: '',
      toDate: '',
      sendToKapilApi: '',
    };
    setQParams(newQParams);
    setSearchInput('');
    setFilterData([...intialState]);
    navigate(window.location.pathname, { replace: true });
  };

  const toggleAdmissions = () => {
    setshowInstallment((prev) => {
      resetFilters();
      return !prev;
    });
  };

  const [showModal2, setShowModal2] = useState(false);
  const [studentInstallment, setStudentInstallment] = useState({});
  const [feeType, setFeeType] = useState(null);

  const handleCloseModal2 = () => {
    setShowModal2(false);
  }

  // New function to handle bank account addition success
  const handleBankAddedSuccess = () => {
    setShowModal2(false); // Close the modal
    fetcher.revalidate(); // Revalidate loader data to refresh the table
    Swal.fire({
      title: "Bank Account Added!",
      text: "Bank account has been successfully linked.",
      icon: "success",
    });
  };


  const handleBank = async (item, type) => {
    if (item) {
      setStudentInstallment(item);
      setShowModal2(true);
      setFeeType(type)
    }
  }



  return (
    <div>
      <BackButton heading={showInstallment ? "Student Installments" : "Student Admission"} content="Back" />
      <div className="container-fluid">
        <div className="row response">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row d-flex justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search input_bg_color text_color"
                        placeholder="Search for..."
                        name="search"
                        required
                        value={searchInput}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 response-btn">
                    <div className="buttons_alignment">
                      <button onClick={toggleAdmissions} className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res">
                        {showInstallment ? "Admissions Fee  " : "Installments"} <TbArrowBackUp />
                      </button>
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
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
                  <div className="offcanvas-header ">
                    <h5
                      className="offcanvas-title  text_color"
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
                  <div className="offcanvas-body p-2 bg_white">
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
      <div className="table-responsive table-card table-container table-scroll border-0">
        <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
          <thead>
            <tr>
              <th scope="col" className="fs-13 lh-xs fw-600">S.No</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Student Name</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Registration Number">Registration Number</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Branch</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Counsellor</th>
              <th scope="col" className="fs-13 lh-xs fw-600">Course</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Course Fee">Course Fee</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Admission Date">Admission Date</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title={showInstallment ? "Installment PA " : "Admission PA"}>{showInstallment ? "Installment PA " : "Admission PA"}</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Total Due Amount">Total Due Amount</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Invoice Number">Invoice Number</th>
              <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "60px" }} title="Transaction ID">Transaction ID</th>
              <th scope="col" className="fs-13 lh-xs fw-600">BankName</th>
              <GateKeeper
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Installment"
                submenuReqiredPermission="canUpdate"
              >
                <th scope="col" className="fs-13 lh-xs fw-600">Action</th>
              </GateKeeper>
            </tr>
          </thead>
          <tbody>
            {showInstallment ? (
              installmentData?.latestInstallments?.length > 0 ? (
                installmentData?.latestInstallments?.map((installment, index) => (
                  <tr key={installment.id}>
                    <td className="fs-13 black_300 fw-500 lh-xs bg_light">{(installmentData?.currentPage - 1) * installmentData?.pageSize + index + 1}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.studentDetails?.name || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.studentDetails?.registrationnumber || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate"
                      style={{ maxWidth: "100px" }}
                      title={installment?.studentDetails?.branches?.branch_name}
                    >
                      {installment.studentDetails?.branches?.branch_name || "N/A"}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate"
                      style={{ maxWidth: "80px" }}
                      title={installment.studentDetails?.enquirytakenby}
                    >
                      {installment.studentDetails?.enquirytakenby || "N/A"}
                    </td>
                    <td
                      className="fs-13 black_300 lh-xs bg_light text-truncate"
                      style={{ maxWidth: "120px" }}
                      title={installment?.studentDetails?.courses}
                    >
                      {installment.studentDetails?.courses || "N/A"}
                    </td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.studentDetails?.finalTotal || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.studentDetails?.admissiondate}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.paidamount}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment?.studentDetails?.dueamount}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment?.invoice?.adminInvoiceNo || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment.transactionID}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{installment?.bankdetail?.bankName || "N/A"}</td>
                    <GateKeeper
                      requiredModule="Student Management"
                      requiredPermission="all"
                      submenumodule="Installment"
                      submenuReqiredPermission="canUpdate"
                    >
                      <>
                        <td>
                          <div className="d-flex gap-2">

                            {installment.sendToKapilApi === false && !installment?.bankId ? ( // Only show "Add bank" if not sent to Kapil API AND bankId is not present
                              <div
                                className="rounded btn_primary font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text-white"
                                onClick={() => handleBank(installment, "installment")}
                                style={{ cursor: "pointer" }}
                              >
                                Add bank
                              </div>
                            ) : (
                              <div
                                style={{ cursor: "not-allowed" }}
                                className="rounded btn_sucess font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                              >
                                Added Bank
                              </div>
                            )}

                            {installment?.sendToKapilApi === false && (installment?.modeofpayment === "Cash" || installment?.bankId) ? ( // Enable if not sent to Kapil API AND (cash OR bankId is present)
                              <div
                                className="rounded btn_primary font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 p-2"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleApprove(installment?.id, "installment")}
                              >
                                Approve
                              </div>
                            ) : installment?.sendToKapilApi === true ? (
                              <div
                                style={{ cursor: "not-allowed" }}
                                className="rounded btn_sucess font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                              >
                                Approved
                              </div>
                            ) : ( // Default disabled state
                              <div
                                className="rounded font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text-white"
                                style={{ cursor: "not-allowed", backgroundColor: "#6c757d" }}
                              >
                                Approve
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    </GateKeeper>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="fs-13 black_300 fw-500 lh-xs bg_light text-center">No Data Available</td>
                </tr>
              )
            ) :
              admissionData?.latestInstallments?.length > 0 ? (
                admissionData?.latestInstallments?.map((admission, index) => (
                  <tr key={admission.id}>
                    <td className="fs-13 black_300 fw-500 lh-xs bg_light">{(admissionData?.currentPage - 1) * admissionData?.pageSize + index + 1}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }} title={admission.student?.name}>{admission.student?.name || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission.student?.registrationnumber || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission.student?.branches?.branch_name || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission.student?.enquirytakenby || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }} title={admission.student?.courses}>{admission.student?.courses || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }} title={admission.student?.finaltotal || "N/A"}>{admission.student?.finaltotal || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission?.student?.admissiondate}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission.admissionAmount}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission?.student?.dueamount}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission?.invoice?.adminInvoiceNo || "N/A"}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission.transactionID}</td>
                    <td className="fs-13 black_300 lh-xs bg_light text-truncate">{admission?.bankdetail?.bankName || "N/A"}</td>
                    <GateKeeper
                      requiredModule="Student Management"
                      requiredPermission="all"
                      submenumodule="Installment"
                      submenuReqiredPermission="canUpdate"
                    >
                      <td>
                        <div className="d-flex gap-2">

                          {admission.sendToKapilApi === false && !admission?.bankId ? ( // Only show "Add bank" if not sent to Kapil API AND bankId is not present
                            <div
                              onClick={() => handleBank(admission, "admission")}
                              style={{ cursor: "pointer" }}
                              className="rounded btn_primary font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                            >
                              Add bank
                            </div>
                          ) : (
                            <div
                              className="rounded btn_sucess font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                              style={{ cursor: "not-allowed" }}
                            >
                              Added Bank
                            </div>
                          )}

                          {admission.sendToKapilApi === false && (admission?.modeofpayment === "Cash" || admission?.bankId) ? ( // Enable if not sent to Kapil API AND (cash OR bankId is present)
                            <div
                              className="rounded btn_primary font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleApprove(admission?.id, "admission")}
                            >
                              Approve
                            </div>
                          ) : admission.sendToKapilApi === true ? (
                            <div
                              style={{ cursor: "not-allowed" }}
                              className="rounded btn_sucess font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text- p-2"
                            >
                              Approved
                            </div>
                          ) : ( // Default disabled state
                            <div
                              className="rounded font-size-xxs fw-100 btn-block pt-1 text-center pb-1 ps-1 text-white"
                              style={{ cursor: "not-allowed", backgroundColor: "#6c757d" }}
                            >
                              Approve
                            </div>
                          )}
                        </div>
                      </td>

                    </GateKeeper>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="fs-13 black_300 fw-500 lh-xs bg_light text-center">No Data Available</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      {
        showInstallment ?
          <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
            <div className="col-sm">
              <PaginationInfo
                data={{
                  length: installmentData?.length,
                  start: installmentData?.startRecord,
                  end: installmentData?.endRecord,
                  total: installmentData?.totalRecords,
                }}
                loading={navigation?.state === "loading"}
              />
            </div>
            <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
              <div className="mt-2">
                <select
                  className="form-select form-control me-3 input_bg_color pagination-select "
                  aria-label="Default select example"
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
                  currentPage={installmentData?.currentPage}
                  totalPages={installmentData?.totalPages}
                  loading={navigation?.state === "loading"}
                  onPageChange={handlePage}
                />
              </div>
            </div>
          </div>
          : (
            <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <PaginationInfo
                  data={{
                    length: admissionData?.length,
                    start: admissionData?.startRecord,
                    end: admissionData?.endRecord,
                    total: admissionData?.totalRecords,
                  }}
                  loading={navigation?.state === "loading"}
                />
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                <div className="mt-2">
                  <select
                    className="form-select form-control me-3 input_bg_color pagination-select "
                    aria-label="Default select example"
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
                    currentPage={admissionData?.currentPage}
                    totalPages={admissionData?.totalPages}
                    loading={navigation?.state === "loading"}
                    onPageChange={handlePage}
                  />
                </div>
              </div>
            </div>
          )
      }

      {showModal2 === true && studentInstallment && feeType && (
        <AddBankAccountToInstallment
          show={showModal2}
          handleClose={handleCloseModal2}
          installment={studentInstallment}
          type={feeType}
          onBankAdded={handleBankAddedSuccess} // Pass the new callback here
        />
      )}
    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Installment;
