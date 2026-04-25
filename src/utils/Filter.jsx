import React from "react";
import Button from "../componentLayer/components/button/Button";

const Filter = ({ filterData, HandleFilters, filterReset, filterSubmit, fieldErrors }) => {


    return (
        <div>
            <div>
                {filterData && filterData.map((filter, index) => (
                    <div key={index}>
                        {filter.type === "date" && (
                            <div className="form-group text-start">
                                <label
                                    className="form-label fs-s text_color"
                                    for="example-text-input "
                                >
                                    {filter.label}
                                </label>
                                <input
                                    className="form-control fs-s input_bg_color bg-form date_input_color"
                                    type="date"
                                    id="exampleInputdate"
                                    name={filter.inputname}
                                    value={filter?.value}
                                    max={filter.inputname === "fromDate" ? new Date().toISOString().split("T")[0] : undefined}
                                    onChange={(e) => HandleFilters
                                        (index, filter.inputname, e.target.value)
                                    }
                                    required
                                />
                                {fieldErrors?.[filter.inputname] && (
                                    <div className="text-danger fs-12 mt-1">{fieldErrors[filter.inputname]}</div>
                                )}
                            </div>
                        )}

                        {filter.type === "select" && (
                            <div className="">
                                <label className="form-label fs-s fw-medium text_color">
                                    {filter.label}
                                </label>
                                <select
                                    className="form-select form-control input_bg_color text_color select"
                                    aria-label="Default select example"
                                    placeholder="course*"
                                    name={filter.inputname}
                                    id={filter.inputname}
                                    value={filter?.value}
                                    onChange={(e) => HandleFilters
                                        (index, filter.inputname, e.target.value)
                                    }
                                    required
                                >
                                    <option value="" disabled selected>
                                        {" "}
                                        Select the {filter.label}
                                    </option>
                                    {filter.options && filter.options.length > 0
                                        ? filter.options.map((item, index) => (
                                            <option key={index} value={item?.value}>
                                                {item.label}
                                            </option>
                                        ))
                                        : null}
                                </select>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                    <button
                        className="btn btn-sm btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={filterReset}
                    >
                        Clear
                    </button>
                </div>
                <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                    <button
                        className="btn btn-sm btn_primary"
                        onClick={filterSubmit}

                    >
                        Save
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Filter;