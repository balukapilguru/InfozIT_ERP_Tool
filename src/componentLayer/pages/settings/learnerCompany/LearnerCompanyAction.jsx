import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const learnerCompanyAction = async ({ request, params }) => {
    const url = new URL(request.url);
    const branchId = url.searchParams.get("branchId");

    switch (request.method) {
        case "POST":
            try {
                const jsonData = await request.json(); // ✅ Parse JSON

                const responsePromise = ERPApi.post(`/settings/learner/create`, jsonData);

                const response = await toast.promise(responsePromise, {
                    pending: "Creating the Learner Company, Please wait...",
                    success: {
                        render({ data }) {
                            return data?.response?.data?.message || "Created the Learner Company successfully!";
                        },
                    },
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || "Something went wrong. Please try again.";
                        },
                    },
                });

                if (response?.status === 201) {
                    return {
                        data: response?.data,
                        status: response?.status,
                        type: "COMPANY_CREATION",
                    };
                }

                throw new Error("Failed to create company");

            } catch (error) {
                const message = error.response?.data?.message || "Learner Company Creation Failed!";
                const statusCode = error.response?.status || 500;
                console.error("POST error:", error);
                return { message, statusCode };
            }

        case "PUT":
            try {
                const jsonData = await request.json(); // ✅ Parse JSON

                const responsePromise = ERPApi.put(
                    `/settings/learner/${params?.id}`,
                    jsonData
                );

                const response = await toast.promise(responsePromise, {
                    pending: "Updating the Learner Company, Please wait...",
                    success: {
                        render({ data }) {
                            return data?.response?.data?.message || "Updated the Learner Company successfully!";
                        },
                    },
                    error: {
                        render({ data }) {
                            return data?.response?.data?.message || "Something went wrong. Please try again.";
                        },
                    },
                });

                if (response?.status === 200) {
                    return {
                        data: response?.data,
                        status: response?.status,
                        type: "COMPANY_UPDATE",
                    };
                }

                throw new Error("Failed to update company");

            } catch (error) {
                const message = error.response?.data?.message || "Learner Company Update Failed!";
                const statusCode = error.response?.status || 500;
                console.error("PUT error:", error);
                return { message, statusCode };
            }

        default:
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: {
                    "Content-Type": "application/json",
                },
            });
    }
};


export const LearnerCompanyListAction = async ({ request, params }) => {
    switch (request.method) {
        case "DELETE":
            {
                const data = (await request.json()) || null;
                const learnerId = data?.id
                // const
                try {
                    const responsePromise = ERPApi.delete(`/settings/learner/${learnerId}`);
                    const response = await toast.promise(responsePromise, {
                        pending: "Learner Company Deleting.., Please wait...",
                        success: {
                            render({ data }) {
                                const successMessage = data?.response?.data?.message || "Learner Company Deleted successfully!";
                                return successMessage;
                            },
                        },
                        error: {
                            render({ data }) {
                                const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again!.";
                                return errorMessage;
                            },
                        },
                    });
                    if (response?.status === 200) {
                        return { data: response?.data, status: response?.status };
                    }

                }
                catch (error) {
                    const message = error?.response?.data?.message || "Learner Company Deleted Failed";
                    const statusCode = error?.response?.status || 500;
                    return { message, statusCode };
                }
            }
    }

}



