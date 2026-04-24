import React from "react";

const MobileNumberInput = ({
    label = "Mobile Number",
    name = "phone",
    value,
    onChange,
    error,
    required = true,
    placeholder = "Enter mobile number",
    className = "form-control",
}) => {
    const handleChange = (e) => {
        let inputValue = e.target.value;

        // ✅ Allow only digits
        inputValue = inputValue.replace(/[^0-9]/g, "");

        // ✅ Restrict to 10 digits
        if (inputValue.length > 10) inputValue = inputValue.slice(0, 10);

        // ✅ Trigger parent handler
        onChange(name, inputValue);
    };

    return (
        <div className="mb-3">
            {/* {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )} */}

            <input
                type="tel"
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={
                    error ? "form-control input_bg_color error-input"
                        : "form-control input_bg_color text-capitalize"
                }
                required={required}
            />
            {/* 
      {error && <div className="text-danger small mt-1">{error}</div>} */}
        </div>
    );
};

export default MobileNumberInput;
