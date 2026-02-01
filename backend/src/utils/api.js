import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// postData

export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            const isHtml = /^\s*<\s*!?doctype|^\s*<\s*html/i.test(text);
            return {
                success: false,
                message: isHtml
                    ? `Server returned an HTML page instead of JSON (status ${response.status}). This usually means: (1) the request hit the wrong URL, or (2) the API rejected the request (e.g. payload too large). Ensure the API is running at ${String(apiUrl || 'VITE_API_URL')}, restart it after changing server code, and that VITE_API_URL in .env points to it (e.g. http://localhost:8000).`
                    : `Invalid JSON in response (status ${response.status}).`,
                error: true
            };
        }
        if (response.ok) return data;
        return data;
    } catch (error) {
        console.error('Error:', error);
        let msg = error?.message || 'Network or server error';
        if (/Unexpected token.*<!|is not valid JSON/i.test(msg)) {
            msg = `Server returned HTML instead of JSON. Ensure the API is running (VITE_API_URL in .env, e.g. http://localhost:8000) and restart the API server after code changes.`;
        }
        return { success: false, message: msg, error: true };
    }
}

// fetchDataFromApi

export const fetchDataFromApi = async (url) => {
    try {
        const params={
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
                'Content-Type': 'application/json', // Adjust the content type as needed
              },
        
        } 

        const { data } = await axios.get(apiUrl + url,params)
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// uploadImage

export const uploadImage = async (url, updatedData ) => {
    const params={
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
            'Content-Type': 'multipart/form-data', // Adjust the content type as needed
          },
    
    } 

    var response;
    await axios.put(apiUrl + url,updatedData, params).then((res)=>{
        response=res;
        
    })
    return response;
   
}

// uploadImages

export const uploadImages = async (url, formData ) => {
    const params={
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
            'Content-Type': 'multipart/form-data', // Adjust the content type as needed
          },
    
    } 

    var response;
    await axios.post(apiUrl + url,formData, params).then((res)=>{
        response=res;
        
    })
    return response;
   
}

// editData

export const editData = async (url, updatedData ) => {
    const params={
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
            'Content-Type': 'application/json', // Adjust the content type as needed
          },
    
    } 

    var response;
    await axios.put(apiUrl + url,updatedData, params).then((res)=>{
        response=res;
        
    })
    return response;
   
}

// deleteImages

export const deleteImages = async (url,image ) => {
    const params={
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
            'Content-Type': 'application/json', // Adjust the content type as needed
          },
    
    } 
    const { res } = await axios.delete(apiUrl + url, params);
    return res;
}

// deleteData

export const deleteData = async (url ) => {
    const params={
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include your API key in the Authorization header
            'Content-Type': 'application/json', // Adjust the content type as needed
          },
    
    } 
    const { res } = await axios.delete(apiUrl + url,params)
    return res;
}

// deleteMultipleData

export const deleteMultipleData = async (url, payload) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
        },
        ...(payload && { data: payload.data || payload }),
    };
    const { data } = await axios.delete(apiUrl + url, config);
    return data;
}




