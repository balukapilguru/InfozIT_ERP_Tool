import { ERPApi } from "../../../../serviceLayer/interceptor";

export const LearnerCompanyLoader = async ({ request, params }) => {
  try {
    const  response = await ERPApi.get(`/settings/learner/list`)
    
    const learnerCompany = response.data;
    return learnerCompany;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null
  }
};

export const LearnerCompanyByIdLoader = async ({ request, params }) => {
    const id = params.id
  try {
    const  response = await ERPApi.get(`/settings/learner/${id}`)
    
    const learnerCompany = response.data;
    return learnerCompany;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null
  }
};

