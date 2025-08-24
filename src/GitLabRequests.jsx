// src/components/GitlabRequests.js
import React, { useState, useEffect } from 'react';

// Accept token as a prop
const GitLabRequests = ({ token, domain }) => {
  const [mergeRequests, setMergeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMergeRequests = async () => {
      const apiUrl = `https://${domain}/api/v4/merge_requests?state=opened&scope=assigned_to_me`;

      try {
        const response = await fetch(apiUrl, {
          headers: { 'Private-Token': token }, // Use the token from props
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setMergeRequests(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if the token is available
    if (token) {
      fetchMergeRequests();
    }
  }, [token]); // Add token to the dependency array

  if (loading) return <div>Loading GitLab merge requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {mergeRequests.length > 0 ? (
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
            {mergeRequests.map((mr, index) => (
              <tr
                key={mr.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                }}
              >
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {mr.id}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <a
                    href={mr.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mr.title}
                  </a>
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {mr.author.name}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {mr.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No open merge requests found.</div>
      )}
    </div>
  );
};

export default GitLabRequests;
