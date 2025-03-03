import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/styles.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DonationTrends = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('edu');
  const apiKey = '0e8476c9-f530-46d5-a71d-a5be463c3642';
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
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
          activities: project.getElementsByTagName('activities')[0]?.textContent || 'No activities available',
          title: project.getElementsByTagName('contactName')[0]?.textContent || 'Untitled Project',
          country: project.getElementsByTagName('country')[0]?.textContent || 'No country data',
          imageUrl:
            project.getElementsByTagName('imagelink')[2]?.getElementsByTagName('url')[0]?.textContent || '',
          donationOptions: Array.from(project.getElementsByTagName('donationOption')).map((donationOption) => ({
            amount: donationOption.getElementsByTagName('amount')[0]?.textContent,
            description: donationOption.getElementsByTagName('description')[0]?.textContent,
          })),
        }));

        setProjects(parsedProjects);
        setLoading(false);
      } catch (error) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedTheme]);

  const handleDonateClick = (project, donationOption) => {
    if (!donationOption) {
      toast.error("Donation option is undefined");
      return;
    }
  
    // Retrieve the current list of saved donation projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('donationProjects')) || [];
  
    // Create an object with only the necessary data to store in localStorage
    const projectToSave = {
      title: project.title,    // Project title
      country: project.country, // Project country
      donationAmount: donationOption.amount,  // Selected donation amount
      donationDescription: donationOption.description, // Selected donation description
    };
  
    // Add the selected project donation option to the saved projects array
    savedProjects.push(projectToSave);
  
    // Save the updated array back to localStorage
    localStorage.setItem('donationProjects', JSON.stringify(savedProjects));
  
    // Display the success toast notification
    toast.success('Added to cart successfully!');
  };
  
  
  return (
    <div className="donation-trends-page">
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
            <div className="spinner"></div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : projects.length === 0 ? (
            <div>No projects found.</div>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <p>
                    <strong>Country:</strong> {project.country}
                  </p>
                </div>

                <div className="project-content">
                  <img src={project.imageUrl} alt={project.title} className="project-image" />
                  <div className="project-activities">
                    <p>
                      <strong>Activities:</strong> {project.activities}
                    </p>
                  </div>
                </div>

                <section className="donation-options">
                  <h4>Donation Options for {project.title}</h4>
                  {project.donationOptions.map((option, optionIndex) => (
  <div key={optionIndex} className="donation-option">
    <h5>Amount: ${option.amount}</h5>
    <p><strong>Description:</strong> {option.description}</p>
    <button
      className="donate-button"
      onClick={() => handleDonateClick(project, option)} // Pass both project and specific donation option
    >
      Donate
    </button>
  </div>
))}

                </section>
              </div>
            ))
          )}
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default DonationTrends;
