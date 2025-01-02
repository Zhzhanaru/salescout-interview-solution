// Write a function that accepts an array of URLs,
// makes parallel queries for each of them, and returns an
// an array of results in the order in which the queries are completed.

// Example input data:
// const urls = ['https://jsonplaceholder.typicode.com/posts/1', 
// 'https://jsonplaceholder.typicode.com/posts/2'];

// Expected result:
// [
// { data: { ... }, status: 200 },
// { data: { ... }, status: 200 }
// ] 
import axios from "axios";

type RequestsResult = {
    data: any,
    status: number
}

async function fetchAll(urls: string[]): Promise<RequestsResult[]> {
    //Your code goes here
    const requests = urls.map(url => 
        axios.get(url)
            .then(response => ({
                data: response.data,
                status: response.status
            }))
            .catch(error => ({
                data: error.response ? error.response.data : null,
                status: error.response ? error.response.status : 500
            }))
    );
    const results = await Promise.allSettled(requests);

    // Filter out fulfilled results and return them
    return results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value; // Return the fulfilled value
        } else {
            return {
                data: null,
                status: 500 // You can customize this based on your error handling
            };
        }
    });
}

module.exports = { fetchAll };