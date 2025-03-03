import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/styles.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DonationData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('edu');
  const apiKey = '0e8476c9-f530-46d5-a71d-a5be463c3642';
  const navigate = useNavigate(); // Initialize navigate

  // Fetch projects based on the selected theme
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null); // Clear previous error
      try {
        const response = await fetch(
          `https://api.globalgiving.org/api/public/projectservice/themes/${selectedTheme}/projects/active?api_key=${apiKey}`
        );
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        const projectsData = xmlDoc.getElementsByTagName('project');
        const parsedProjects = Array.from(projectsData).map((project) => ({
          id: project.getElementsByTagName('nextProjectId')[0]?.textContent || 'N/A',
          title: project.getElementsByTagName('contactName')[0]?.textContent || 'Untitled Project',
          country: project.getElementsByTagName('country')[0]?.textContent || 'No country data',
          donationOptions: Array.from(project.getElementsByTagName('donationOption')).map((donationOption) => ({
            amount: donationOption.getElementsByTagName('amount')[0]?.textContent,
            description: donationOption.getElementsByTagName('description')[0]?.textContent,
          })),
        }));

        setProjects(parsedProjects);
      } catch (error) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedTheme]);

  return (
    <div className="donation-data-page">
      <header className="header">
        <h1>Donation Projects</h1>
        <p>Select a theme to view active donation projects</p>
      </header>

      <div className="filter-section">
        <label className="theme-label" htmlFor="theme-select">
          Choose Theme:
        </label>
        <select
          id="theme-select"
          className="theme-select"
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option value="edu">Education</option>
          <option value="health">Health</option>
          <option value="env">Environment</option>
          <option value="ecdev">Economic Development</option>
          <option value="children">Child Protection</option>
          <option value="disaster">Disaster Recovery</option>
          <option value="animals">Animals</option>
          <option value="water">Water and Sanitation</option>
          <option value="hunger">Hunger and Nutrition</option>
          <option value="human">Human Rights</option>
          <option value="disability">Disability</option>
          <option value="tech">Technology</option>
          <option value="endabuse">Abusement</option>
          <option value="refugee">Refugee</option>
          <option value="reproductive">Reproductive</option>
        </select>
      </div>

      <section className="projects-section">
        <div className="projects-container">
          {loading ? (
            <div className="spinner">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : projects.length === 0 ? (
            <div>No projects found.</div>
          ) : (
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Theme</th>
                  <th>Country</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>
                    <td>{selectedTheme}</td>
                    <td>{project.country}</td>
                    <td>
                      {project.donationOptions.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          ${option.amount}
                        </div>
                      ))}
                    </td>
                    <td>
                      {project.donationOptions.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          {option.description}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default DonationData;
