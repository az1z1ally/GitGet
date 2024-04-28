# Intercepting JavaScript Fetch API requests and responses
https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/

- I wrote this document b'se angular's Http interceptor doesn't support fetch() API.

Interceptors are code blocks that you can use to preprocess or post-process HTTP calls, helping with global error handling, authentication, logging, and more. In this article, you’ll learn how to intercept JavaScript Fetch API calls.

There are two types of events for which you may want to intercept HTTP calls, request and response events. The request interceptor should be executed before the actual HTTP request is sent, whereas the response interceptor should be executed before it reaches the application code that made the call.

There are two types of events for which you may want to intercept HTTP calls, request and response events. The request interceptor should be executed before the actual HTTP request is sent, whereas the response interceptor should be executed before it reaches the application code that made the call.

Before diving into the code, we need to understand a few important factors. For one, the Fetch API doesn’t support interceptors natively. Additionally, extra packages are required to use the Fetch API in Node.js.

## The JavaScript Fetch API

First, let’s cover some fundamentals of the Fetch API, for example, the syntax:

const fetchResponsePromise = fetch(resource [, init])

resource defines the resource you want to fetch, which can be either a Request object or a URL. init is an optional object that will contain any custom configuration you want to apply to this particular request.

The Fetch API is promise-based. Therefore, when you call the Fetch method, you’ll get a response promise back. Here, it is referred to as fetchResponsePromise, as seen in the example above.

By default, Fetch uses the GET method for API calls, as shown below:

fetch('https://jsonplaceholder.typicode.com/todos/1')
.then((response) => response.json())
.then((json) => console.log(json));

Below is an example of a POST request with Fetch:

fetch('https://jsonplaceholder.typicode.com/todos', {
  method: 'POST',
  body: JSON.stringify({
    completed: false,
    id: 1,
    title: 'New Todo',
    userId: 1,
  }),
  headers: new Headers({
    'Content-Type': 'application/json; charset=UTF-8',
  }),
})
.then((response) => response.json())
.then((json) => console.log(json));

The POST call must have a body. Take a look at the Fetch documentation for more details.

## Implementing interceptors

There are two ways to add interceptors to our Fetch API calls; we can either use monkey patching or the fetch-intercept library.

## Monkey patching with Fetch

One way to create an interceptor for any JavaScript function or method is to monkey patch it. Monkey patching is an approach to override the original functionality with your version of the function.

Let’s take a step-by-step look at how you can create an interceptor for the Fetch API with monkey patching:

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config ] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    // response interceptor here
    return response;
};

The code above overrides the original Fetch method with a custom implementation and calls the original Fetch method inside it. You’ll use this boilerplate code to create request and response interceptors.
Request interceptor

In the following example, we’ll create a simple request interceptor that changes the resource URL of an illustration:

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    let [resource, config ] = args;

    // request interceptor starts
    resource = 'https://jsonplaceholder.typicode.com/todos/2';
    // request interceptor ends

    const response = await originalFetch(resource, config);

    // response interceptor here
    return response;
};


fetch('https://jsonplaceholder.typicode.com/todos/1')
.then((response) => response.json())
.then((json) => console.log(json));

// log
// {
//   "userId": 1,
//   "id": 2,
//   "title": "quis ut nam facilis et officia qui",
//   "completed": false
// }

This API call would fetch data from https://jsonplaceholder.typicode.com/todos/2 instead of https://jsonplaceholder.typicode.com/todos/1, as shown by the ID 2 of the todo.

    Note: One of the most common use cases for request interceptors is to change the headers for authentication.

Response interceptor

The response interceptor would intercept the API response before it is delivered to the actual caller. Let’s take a look at the following code:

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;

  let response = await originalFetch(resource, config);

  // response interceptor
  const json = () =>
    response
      .clone()
      .json()
      .then((data) => ({ ...data, title: `Intercepted: ${data.title}` }));

  response.json = json;
  return response;
};

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then((response) => response.json())
  .then((json) => console.log(json));

// log
// {
//     "userId": 1,
//     "id": 1,
//     "title": "Intercepted: delectus aut autem",
//     "completed": false
// }

In the code above, we changed the JSON method to return some custom data instead of the original data. Check out the documentation to learn more about the properties that you can change.

    Note: Responses are only allowed to be consumed once. Therefore, you need to clone the response each time you want to use it.

Handling errors

You can easily handle errors for requests by checking the values for response.ok and response.status. In the code snippet below, you can intercept 404 errors:

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;
  let response = await originalFetch(resource, config);
  if (!response.ok && response.status === 404) {
    // 404 error handling
    return Promise.reject(response);
  }
  return response;
};
fetch('https://jsonplaceholder.typicode.com/todos/1000000')
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((error) => console.error(error));