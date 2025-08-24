// src/components/GithubRequests.js
import React, { useState, useEffect } from 'react';

// Accept username and token as props
const GithubRequests = ({ username, token }) => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPullRequests = async () => {
      // Fetch open pull requests in the TINYhr org assigned to the user
      // Use 'involves' to match PRs where the user is involved (author, assignee, reviewer, commenter)
      const apiUrl = `https://api.github.com/search/issues?q=is:pr+is:open+involves:${username}+org:TINYhr&sort=created&order=desc`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Filter PRs by author (user.login === username)
        const authoredPRs = data.items.filter(
          (pr) => pr.user && pr.user.login === username
        );
        setPullRequests(authoredPRs);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if username and token are available
    if (username && token) {
      fetchPullRequests();
    }
  }, [username, token]); // Add username and token to the dependency array

  if (loading) return <div>Loading GitHub pull requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {pullRequests.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>
                Title
              </th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>
                Author
              </th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {pullRequests.map((pr, index) => (
              <tr
                key={pr.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                }}
              >
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {pr.id}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pr.title}
                  </a>
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {pr.user.login}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {pr.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No open pull requests found.</div>
      )}
    </div>
  );
};

export default GithubRequests;
