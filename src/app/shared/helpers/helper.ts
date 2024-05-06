import { environment } from "../../../environments/environment";
import { NetworkErrorsEnum } from "../types/errors.enum";

export const helper = () => {
  // Global variable to track the time when the last request was made
  let lastRequestTime = 0;

  // Wait for a certain amount of time before proceeding to comply with rate limiting
  async function waitForRateLimit() {
      // Calculate the time since the last request was made
      const currentTime = Date.now();
      const timeSinceLastRequest = currentTime - lastRequestTime;

      // If less than a second has passed since the last request, wait for the remaining time
      if (timeSinceLastRequest < 1000) {
          const timeToWait = 1000 - timeSinceLastRequest;
          await new Promise(resolve => setTimeout(resolve, timeToWait));
      }

      // Update the last request time to the current time
      lastRequestTime = Date.now();
  }

  // Extract repository owner, repository name, and folder path from the GitHub URL
  const extractGitHubInfo = (url: string): {repoOwner: string, repoName:string, folderPath:string} => {
    // const regex = /^https:\/\/github.com\/([^/]+)\/([^/]+)(?:\/(?:tree|blob)\/main\/([^/]+\/?.*))?/;
    const regex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/|www\.)?github.com\/([^/]+)\/([^/]+)(?:\/(?:tree|blob)\/main\/([^/]+\/?.*))?/;
    const match = url.match(regex);
    // console.log(url.match(regex));
    
    if (match) {
        const [, , repoOwner, repoName, folderPath] = match;
        // If folderPath is undefined (no match for folderPath), set it to an empty string
        return { repoOwner, repoName, folderPath: folderPath || '' }; //URL doesn't contain the /tree/main/ or /blob/main/ part. Additionally, it should still work when the URL points directly to the repository without specifying a file or folder within it
    } else {
        throw new Error('Invalid GitHub URL!', {cause: `${NetworkErrorsEnum.invalid}`});
    }
  }

  // Generate the API URL for the given GitHub URL
  const generateAPIUrl = (url: string): string => {
    // Extract repository owner, repository name, and folder path from the URL
    const { repoOwner, repoName, folderPath } = extractGitHubInfo(url);

    // Construct the API URL
    return `${environment.config.apiUrl}/${repoOwner}/${repoName}/contents/${folderPath}`
  }

  // Check for a connection status(internet)
  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/assets/empty.json');
      return response.ok // either true or false
    } catch (err) {
      return false; // definitely offline / connection issue
    }
  };

  return {
    lastRequestTime,
    waitForRateLimit,
    extractGitHubInfo,
    generateAPIUrl,
    checkConnectionStatus
  }
}