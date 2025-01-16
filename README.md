# Behance URL Scraper

A scraper that helps you collect Behance search results URLs and other info. You can use it to find stuff like embedded Figma links or whatever you need from the posts. Makes it easy to save and check multiple projects at once instead of clicking through everything manually.

## Features
- Search Behance projects by keywords
- Save URLs to a text file
- Get project details like views, likes, creator info
- Customize how many results you want

## Setup
1. Make sure you have Node.js installed
2. Clone this repo
3. Run `npm install` to install dependencies
4. Get your auth token and cookies from Behance:
   - Open Behance website in your browser
   - Open developer tools (F12 or right-click -> "Inspect")
   - Go to "Network" tab and filter by XHR/fetch
   - Perform a search on Behance
   - Find a request to "graphql"
   - Look in request headers for "Cookie" and "Authorization"
   - Copy these values and update them in the code

## How to Use
```javascript
const api = new BehanceAPI();

// Save just URLs to a file
api.saveProjectsToFile("figma", 200);  // Will save 200 results for "figma" search

// Get full project details
api.searchProjects("figma", 200).then((result) => {
  console.log(result);
});
```

## Output
- Creates a file named `[search_term]_links.txt`
- Each URL is on a new line
- File is saved in the same folder as the script

## Tips
- The auth token expires, so you'll need to update it sometimes
- Add some delay between requests to avoid rate limiting
