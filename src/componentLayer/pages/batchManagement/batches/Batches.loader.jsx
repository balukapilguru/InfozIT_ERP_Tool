
import { ERPApi } from "../../../../serviceLayer/interceptor";
import * as Api from "./batchesUtils/utils/BatchesAPI";

export async function batchesLoader({
    request,
    params,
}) {
    switch (params.list) {
        case "activelist":
            {
                try {
                    const url = new URL(request.url);
                    const baseUrl = `/batch/getbatches?filter[batchStatus]=active&${url?.search?.slice(1)}&page=${1}&pageSize=${10}`;
                    const [batchesData, trainerData, curriculumData] = await Promise.all([
                        ERPApi.get(baseUrl),
                        ERPApi.get(`batch/trainer?search=`),
                        ERPApi.get(`/batch/curriculum/filter?search=`)
                    ]);
                    console.log("Batch Loader search search 1", batchesData, trainerData)
                    const Response = {
                        batches: batchesData?.data,
                        trainerData: trainerData?.data,
                        curriculumData: curriculumData?.data,
                    };
                    return Response;
                } catch (error) {
                    // return handleError(error)
                }
            }
            break;
        case "upcominglist":
            {
                try {
                    const url = new URL(request.url);
                    const baseUrl = `/batch/getbatches?filter[batchStatus]=upcoming&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
                    const [batchesData, trainerData, curriculumData] = await Promise.all([
                        ERPApi.get(baseUrl),
                        ERPApi.get(`batch/trainer?search=`),
                        ERPApi.get(`/batch/curriculum/filter?search=`)
                    ]);
                    console.log("Batch Loader search search 1", batchesData, trainerData)
                    const Response = {
                        batches: batchesData?.data,
                        trainerData: trainerData?.data,
                        curriculumData: curriculumData?.data,
                    };
                    return Response;
                } catch (error) {
                    // return handleError(error)
                }
            }
            break;
        case "completedlist":
            {
                try {
                    const url = new URL(request.url);
                    const baseUrl = `/batch/getbatches?filter[batchStatus]=closed&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
                    const [batchesData, trainerData, curriculumData] = await Promise.all([
                        ERPApi.get(baseUrl),
                        ERPApi.get(`batch/trainer?search=`),
                        ERPApi.get(`/batch/curriculum/filter?search=`)
                    ]);
                    console.log("Batch Loader search search 1", batchesData, trainerData)
                    const Response = {
                        batches: batchesData?.data,
                        trainerData: trainerData?.data,
                        curriculumData: curriculumData?.data,
                    };
                    return Response;
                } catch (error) {
                    // return handleError(error)
                }
            }
            break;
        case "pendingList":
            {
                try {
                    const url = new URL(request.url);
                    const baseUrl = `/batch/getbatches?filter[batchStatus]=ending&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
                    const [batchesData, trainerData, curriculumData] = await Promise.all([
                        ERPApi.get(baseUrl),
                        ERPApi.get(`batch/trainer?search=`),
                        ERPApi.get(`/batch/curriculum/filter?search=`)
                    ]);
                    console.log("Batch Loader search search 1", batchesData, trainerData)
                    const Response = {
                        batches: batchesData?.data,
                        trainerData: trainerData?.data,
                        curriculumData: curriculumData?.data,
                    };
                    return Response;
                } catch (error) {
                    // return handleError(error)
                }
            }
            break;
          case "selflearninglist":
            {
                try {
                    const url = new URL(request.url);
                    const baseUrl = `/batch/getbatches?filter[trainingMode]=self-learning&${url.search.slice(1)}&page=${1}&pageSize=${10}`;
                    const [batchesData, trainerData, curriculumData] = await Promise.all([
                        ERPApi.get(baseUrl),
                        ERPApi.get(`batch/trainer?search=`),
                        ERPApi.get(`/batch/curriculum/filter?search=`)
                    ]);
                    console.log("Batch Loader search search 1", batchesData, trainerData)
                    const Response = {
                        batches: batchesData?.data,
                        trainerData: trainerData?.data,
                        curriculumData: curriculumData?.data,
                    };
                    return Response;
                } catch (error) {
                    // return handleError(error)
                }
            }
            break;
        
            default: {
            throw new Response("", { status: 405 });
        }
    }
}
