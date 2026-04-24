import React, { useCallback, useEffect, useRef, useState } from 'react'
import GateKeeper from '../../../../../rbac/GateKeeper';
import { MdFilterList } from 'react-icons/md';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { debounce } from '../../../../../utils/Utils';
import { Link, useFetcher, useLoaderData, useNavigation, useSubmit } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import PaginationInfo from '../../../../../utils/PaginationInfo';
import Pagination from '../../../../../utils/Pagination';
import CustomFilters from '../../../../../utils/CustomFilters';



export const NoDueRecordsListLoader = async ({ request, params }) => {
    const url = new URL(request.url); // Extract the URL
    const queryParams = url.search;
    try {
        const [
            NoDueRecordersData,
            BranchesData,
            coursesData,
            counsellorsData,
            leadSourceData,
        ] = await Promise.all([
            ERPApi.get(
                `/fee/noduefeerecords${queryParams ? queryParams : `?page=1&pageSize=10&search=`
                }`
            ),
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

        const NoDueRecordsList = NoDueRecordersData.data || [];

        return {
            leadSourceList,
            coursesList,
            BranchsList,
            counsellorsList,
            NoDueRecordsList,

        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

const NoDueFeeRecordsList = () => {
    const data = useLoaderData();
    const submit = useSubmit();
    const fetcher = useFetcher();

    const { leadSourceList, coursesList, BranchsList, counsellorsList, NoDueRecordsList, } = data;

    

    const navigation = useNavigation();

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
            label: "Created By",
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
        //     label: "Mode Of Training",
        //     type: "select",
        //     inputname: "modeOfTraining",
        //     value: "",
        //     options: [
        //         { label: "Online", value: "online" },
        //         // { label: "not Issued", value: " " },
        //         { label: "Offline", value: "offline" },
        //     ],
        // },

        // {
        //     label: "Lead Source",
        //     type: "select",
        //     inputname: "leadsource",
        //     value: "",
        //     options: leadSourceList,
        // },

    ];

    const [filterData, setFilterData] = useState(initialState);

    const [Qparams, setQParams] = useState({
        search: "",
        page: 1,
        pageSize: 10,
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
                                            type="text"
                                            className="form-control search text_color input_bg_color"
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
                                            {/* 10/40 */}
                                        </div>

                                        <button
                                            className="btn btn-sm btn_primary fs-13 me-2"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRightSide"
                                            aria-controls="offcanvasRightSide"
                                        >
                                            <MdFilterList className="me-1 mb-1" />
                                            Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="offcanvas offcanvas-end  bg_white text_color"
                                id="offcanvasRightSide"
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
                                        className="btn-close "
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
                                    <thead className="">
                                        <tr className="">
                                            <th scope="col" className="fs-13 lh-xs fw-600  ">
                                                S.No
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Name
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Branch
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                CreatedBy
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Contact
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Course
                                            </th>
                                            {/* <th scope="col" className="fs-13 lh-xs fw-600  ">
                                                Lead Source
                                            </th> */}
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Date&nbsp;of&nbsp;Joining
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                                Total&nbsp;Fee
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                Fee&nbsp;Paid
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                Due&nbsp;Date
                                            </th>
                                            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                Due&nbsp;Amount
                                            </th>

                                            <th scope="col" className="fs-13 lh-xs  fw-600 ">
                                                Installments
                                            </th>
                                            <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                                                <th scope="col" className="fs-13 lh-xs fw-600 ">
                                                    Action
                                                </th>
                                            </GateKeeper>
                                        </tr>
                                    </thead>
                                    <tbody className="">


                                        {
                                            NoDueRecordsList?.students && NoDueRecordsList?.students?.length > 0 ?

                                                NoDueRecordsList?.students?.map((item, index) => {

                                                    return (
                                                        <tr key={index + 1}>
                                                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                                {(NoDueRecordsList?.currentPage - 1) *
                                                                    NoDueRecordsList?.pageSize +
                                                                    index +
                                                                    1}

                                                            </td>
                                                            <td
                                                                className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                                style={{ maxWidth: "150px" }}
                                                                title={item?.name}
                                                            >
                                                                {item?.name}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                            {item?.branches?.branch_name}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.userId?.fullname}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.mobilenumber}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light  text-truncate" style={{ maxWidth: "120px" }} title={item.courses} >
                                                                {item?.courses}
                                                            </td>

                                                            {/* <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}
                                                                title={item?.leadsource[0]?.source}
                                                            >
                                                                {item?.leadsource[0]?.source}
                                                            </td> */}

                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.admissiondate}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.finaltotal?.toLocaleString("en-IN")}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.totalpaidamount?.toLocaleString("en-IN")}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.nextduedate}
                                                            </td>
                                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                                {item?.dueamount?.toLocaleString("en-IN")}
                                                            </td>

                                                            <td className="fs-13 black_300  lh-xs bg_light ">
                                                                {
                                                                    item?.totalinstallments[0]
                                                                        ?.totalinstallmentspaid
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    item?.totalinstallments[0]
                                                                        ?.totalinstallments
                                                                }
                                                            </td>


                                                            <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                                                                <td className="fs-14 text_mute bg_light   lh-xs">
                                                                    <Link
                                                                        to={`/student/feeUpdate?studentId=${item?.id}`}



                                                                    // to={`/student/feeview/${item?.id}`}
                                                                    >
                                                                        <AiFillEye className=" eye_icon me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="view" />
                                                                    </Link>
                                                                </td>
                                                            </GateKeeper>
                                                        </tr>
                                                    );
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
                            <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                <div className="col-sm">

                                    <PaginationInfo
                                        data={{
                                            length: NoDueRecordsList?.students?.length,
                                            start: NoDueRecordsList?.startStudent,
                                            end: NoDueRecordsList?.endStudent,
                                            total: NoDueRecordsList?.searchResultStudents,
                                        }}
                                        loading={navigation?.state === "loading"}
                                    />

                                </div>
                                <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                                    <div className="mt-2">
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
                                            currentPage={NoDueRecordsList?.currentPage}
                                            totalPages={NoDueRecordsList?.totalPages}
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

export default NoDueFeeRecordsList;
