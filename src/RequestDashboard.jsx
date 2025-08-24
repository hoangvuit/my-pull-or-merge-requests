// src/components/RequestDashboard.js
import React, { useState } from 'react';
import GitLabRequests from './GitLabRequests';
import GithubRequests from './GithubRequests';

const RequestDashboard = () => {
  const [activeTab, setActiveTab] = useState('gitlab');

  // Get tokens and username from environment variables
  // Use Vite's import.meta.env and correct variable names
  const gitlabToken = import.meta.env.VITE_GITLAB_ACCESS_TOKEN;
  const gitlabDomain = import.meta.env.VITE_GITLAB_DOMAIN;
  const githubToken = import.meta.env.VITE_GITHUB_ACCESS_TOKEN;
  const githubUsername = import.meta.env.VITE_GITHUB_USERNAME;

  const tabButtonStyle = {
    padding: '10px 20px',
    marginRight: '10px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    backgroundColor: '#f1f1f1',
    transition: 'background-color 0.3s',
    borderRadius: '4px',
  };

  const activeTabStyle = {
    ...tabButtonStyle,
    color: '#fff',
    backgroundColor: 'rgb(58, 105, 247)',
    border: '1px solid rgba(58, 105, 247, 0.5)',
  };

  return (
    <div>
      <h1>My Open Requests</h1>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #ccc',
          justifyContent: 'center',
        }}
      >
        <button
          style={activeTab === 'gitlab' ? activeTabStyle : tabButtonStyle}
          onClick={() => setActiveTab('gitlab')}
        >
          GitLab Merge Requests
        </button>
        <button
          style={activeTab === 'github' ? activeTabStyle : tabButtonStyle}
          onClick={() => setActiveTab('github')}
        >
          GitHub Pull Requests
        </button>
      </div>

      <div style={{ paddingTop: '20px' }}>
        {activeTab === 'gitlab' ? (
          <GitLabRequests
            token={gitlabToken}
            domain={gitlabDomain || 'gitlab.com'}
          />
        ) : (
          <GithubRequests username={githubUsername} token={githubToken} />
        )}
      </div>
    </div>
  );
};

export default RequestDashboard;
