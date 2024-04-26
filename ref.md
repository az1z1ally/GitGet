This code snippet will give you the last segment of the path, which corresponds to the word “src” in your provided URL

1. If you are working with the URL as a string: If you have the URL as a string (like the one you provided), you can directly split it by slashes and extract the last part. Here are a couple of variations:
Using location.href (if you are on a page with this URL):

const hrefParts = location.href.split("/");
const lastPart = hrefParts[hrefParts.length - 1];

2. Otherwise (if you have the URL as a string):

const url = "https://github.com/az1z1ally/GitGet/tree/main/src";
const lastPart = url.split("/")[url.split("/").length - 1];
