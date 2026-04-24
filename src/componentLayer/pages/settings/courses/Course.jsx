import "../../../../assets/css/Table.css";
import { Link, NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import Button from "../../../components/button/Button";
import Swal from "sweetalert2";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";
import FormattedDate from "../../../../utils/FormattedDate";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Course = () => {
  const {
    DispatchCourse,

    courseState: { coursesList },
    getPaginatedCourses,
  } = useCourseContext();

  const { permission } = usePermissionsProvider();
  const { debouncesetSearch, debouncesetPage } = Usedebounce(DispatchCourse);

  const handleSearch = (e) => {
    debouncesetSearch({ data: e.target.value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    DispatchCourse({
      type: "SET_PER_PAGE",
      payload: {
        data: selectedvalue,
      },
    });
  };

  const handlePageChange = (page) => {
    debouncesetPage({ data: page });
  };

  const handleDeleteCourse = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Course",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data, status } = await toast.promise(
            ERPApi.delete(`/batch/course/${id}`),
            {
              pending: "Deleting The Course...",
            }
          );

          if (status === 200) {
            getPaginatedCourses();
            Swal.fire({
              title: "Deleted!",
              text: "Course Deleted Successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            "Course Deleted Failed!. Please Try Again!";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };


  useEffect(()=>{
    getPaginatedCourses();
  },[])



  return (
    <div>
      <BackButton heading="Course" content="Back" />
      <div className="container-fluid">
        <div className="row">
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
                        onChange={(e) => handleSearch(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <GateKeeper
                      requiredModule="Settings"
                      requiredPermission="all"
                      submenumodule="Courses"
                      submenuReqiredPermission="canCreate"
                    >
                      <Button
                        type="button"
                        className="btn btn-sm btn_primary fs-13"
                      >
                        <Link
                          to="/settings/courses/new"
                          className="button_color"
                        >
                          {<HiMiniPlus />} Create Course
                        </Link>
                      </Button>
                    </GateKeeper>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card border-0">
                  <div className="table-container table-scroll">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Course Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Course Package
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Fee
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Max Discount
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Created At
                          </th>
                          {permission?.permissions.map((item) => {
                            if (item.module === "Settings") {
                              return item?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Courses" &&
                                  (submenu?.canUpdate === true ||
                                    submenu?.canDelete === true)
                                ) {
                                  return (
                                    <th
                                      scope="col"
                                      className="fs-13 lh_xs 0 fw-600"
                                    >
                                      Actions
                                    </th>
                                  );
                                }
                                return null;
                              });
                            }
                            return null;
                          })}
                        </tr>
                      </thead>
                      <tbody className="scrollable-body">
                        {coursesList.paginatedCoursesList &&
                          coursesList.paginatedCoursesList.length > 0 ? (
                          coursesList.paginatedCoursesList.map(
                            (item, index) => {
                              const courseid = item?.id;
                              return (
                                <tr>
                                  <td className="fs-13 black_300 fw_500 lh-xs bg_light ">
                                    {(coursesList?.currentPage - 1) *
                                      coursesList.perPage +
                                      index +
                                      1}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light  text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item.course_name}
                                  >
                                    {item?.course_name}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item.course_package}
                                  >
                                    {item?.course_package}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.fee?.toLocaleString("en-IN")}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.max_discount}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {FormattedDate(item?.date)}
                                  </td>

                                  {permission?.permissions.map((item) => {
                                    if (item.module === "Settings") {
                                      return item?.submenus?.map((submenu) => {
                                        if (
                                          submenu?.module === "Courses" &&
                                          (submenu?.canUpdate === true ||
                                            submenu?.canDelete === true)
                                        ) {
                                          return (
                                            <td className="fs-13 black_300  lh-xs bg_light ">
                                              <GateKeeper
                                                requiredModule="Settings"
                                                requiredPermission="all"
                                                submenumodule="Courses"
                                                submenuReqiredPermission="canUpdate"
                                              >
                                                <NavLink
                                                  to={`/settings/courses/edit/${courseid}`}
                                                >
                                                  <RiEdit2Line className="edit_icon table_icons me-3" />
                                                </NavLink>
                                              </GateKeeper>

                                              <GateKeeper
                                                requiredModule="Settings"
                                                requiredPermission="all"
                                                submenumodule="Courses"
                                                submenuReqiredPermission="canDelete"
                                              >
                                                <MdDelete
                                                  className="delete_icon table_icons me-3"
                                                  onClick={(e) =>
                                                    handleDeleteCourse(courseid)
                                                  }
                                                />
                                              </GateKeeper>

                                              {/* <GateKeeper requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canUpdate">
                                              <Link
                                                to={`/settings/courses/addcurriculum/${courseid}`}
                                                className="button_color">
                                                <VscFileSubmodule className="rupee_icon table_icons me-3" data-bs-toggle="tooltip" data-bs-placement="top" title="Curriculum" />
                                              </Link>
                                            </GateKeeper> */}
                                            </td>
                                          );
                                        }
                                        return null;
                                      });
                                    }
                                    return null;
                                  })}
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td className="fs-13 black_300">No Data </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: coursesList?.paginatedCoursesList?.length,
                        start: coursesList?.startCourse,
                        end: coursesList?.endCourse,
                        total: coursesList?.searchResultCourses,
                      }}
                      loading={coursesList?.loading}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={(e) => handlePerPage(e)}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div>
                      <Pagination
                        currentPage={coursesList?.currentPage}
                        totalPages={coursesList?.totalPages}
                        loading={coursesList?.loading}
                        onPageChange={handlePageChange}
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
export default Course;
