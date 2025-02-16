export const handleResponse = (data) => {
    const status = data?.status ? data?.status : data?.response?.status;
    const message = data?.data ? data?.data : data?.response?.data?.message;
    const respObj = {status, message}

    if (status?.toString().charAt(0) === "4") {
        console.log({...respObj});
        return {...respObj, isError: true};
    } else if (status?.toString().charAt(0) === "2") {
        console.log({...respObj});
        return {...respObj, isError: false};
    } else {
        console.log(data);
    }
}