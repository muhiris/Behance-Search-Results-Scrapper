const fs = require("fs").promises;

class BehanceAPI {
  // how to get cookies and auth token from behance website?
  // 1. Open the Behance website in your browser.
  // 2. Open the developer tools (F12 or right-click and select "Inspect").
  // 3. Go to the "Network" tab and apply filter XHR or fetch.
  // 4. Perform a search on the website.
  // 5. Look for a request to the Behance API (e.g., graphql).
  // 6. In the request headers, you should see the "Cookie" and "Authorization" headers.
  // 7. Copy the values of these headers and use them in your script.

  constructor() {
    this.baseURL = "https://www.behance.net/v3/graphql";
    this.cookies = "Add your cookies here";
    this.authToken = "Add your auth token here";
  }

  async searchProjects(searchTerm, totalResults = 200) {
    const pageSize = 48;
    let allProjects = [];
    let endCursor = null;

    while (allProjects.length < totalResults) {
      const query = {
        query: `query ProjectsSearchPage($query: query, $first: Int!, $after: String) {
                    search(query: $query, type: PROJECT, first: $first, after: $after) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        metaContent {
                            totalEntityCount
                        }
                        nodes {
                            ... on Project {
                                id
                                name
                                url
                                covers {
                                    size_404 {
                                        url
                                    }
                                }
                                stats {
                                    appreciations {
                                        all
                                    }
                                    views {
                                        all
                                    }
                                }
                                owners {
                                    displayName
                                    url
                                    location
                                }
                            }
                        }
                    }
                }`,
        variables: {
          query: searchTerm,
          first: pageSize,
          after: endCursor,
        },
      };

      try {
        const response = await fetch(this.baseURL, {
          method: "POST",
          headers: {
            accept: "*/*",
            authorization: `Bearer ${this.authToken}`,
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            Origin: "https://www.behance.net",
            Referer: "https://www.behance.net/",
            Cookie: this.cookies,
          },
          body: JSON.stringify(query),
        });

        const data = await response.json();
        const searchData = data.data.search;

        const projects = searchData.nodes.map((project) => ({
          url: project.url,
        }));

        allProjects = [...allProjects, ...projects];

        if (allProjects.length === pageSize) {
          console.log(
            `Total available results: ${searchData.metaContent.totalEntityCount}`
          );
        }

        if (
          !searchData.pageInfo.hasNextPage ||
          allProjects.length >= totalResults
        ) {
          break;
        }

        endCursor = searchData.pageInfo.endCursor;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error fetching projects:", error);
        break;
      }
    }

    return allProjects.slice(0, totalResults);
  }

  async saveProjectsToFile(searchTerm, totalResults = 200) {
    try {
      const projects = await this.searchProjects(searchTerm, totalResults);
      const urls = projects.map((project) => project.url).join("\n");

      // Create filename based on search term (remove special characters and spaces)
      const filename = `${searchTerm.replace(/[^a-zA-Z0-9]/g, "_")}_links.txt`;

      // Using Node.js fs module to write the file
      const fs = require("fs").promises;
      await fs.writeFile(filename, urls, "utf8");

      console.log(`Successfully saved ${projects.length} URLs to ${filename}`);
      return filename;
    } catch (error) {
      console.error("Error saving to file:", error);
      throw error;
    }
  }
}

// Usage example:
const api = new BehanceAPI();

// Search for projects and save URLs to file
api
  .saveProjectsToFile("figma", 200)
  .then((filename) => {
    console.log(`File saved as: ${filename}`);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
