import { useEffect, useState } from 'react';

const JobPreferencePage = () => {
  const [jobPreferences, setJobPreferences] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        alert("You are not authenticated. Please log in.");
        return; 
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return; 

    const fetchJobPreferences = async () => {
      try {
        const response = await fetch('http://localhost:8000/job-preference/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job preferences');
        }

        const data = await response.json();
        setJobPreferences(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobPreferences();
  }, [token]);

  // Deleting job preferences (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/job-preference/', {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Failed to delete job preference');
      }

      // Remove deleted preference from the list
      setJobPreferences(jobPreferences.filter(pref => pref.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Updating job preferences (PUT)
  const handleUpdate = async (id, updatedKeywords, updatedLocation) => {
    const updatedJobPreference = { keywords: updatedKeywords, location: updatedLocation };

    try {
      const response = await fetch(`http://localhost:8000/job-preference/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updatedJobPreference),
      });

      if (!response.ok) {
        throw new Error('Failed to update job preference');
      }

      const updatedData = await response.json();
      setJobPreferences(jobPreferences.map(pref => 
        pref.id === id ? updatedData : pref
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle submitting new job preferences (POST)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newJobPreference = { keywords, location };

    try {
      const response = await fetch('http://localhost:8000/job-preference/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newJobPreference),
      });

      if (!response.ok) {
        throw new Error('Failed to add job preference');
      }

      const data = await response.json();
      setJobPreferences([data, ...jobPreferences]);
      setKeywords('');
      setLocation('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Job Preferences</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {jobPreferences.length === 0 && !loading && <p>No job preferences found</p>}

      <ul>
        {jobPreferences.map((pref) => (
          <li key={pref.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              {pref.keywords} - {pref.location}
            </div>
            <button 
              onClick={() => handleUpdate(pref.id, "Updated Keywords", "Updated Location")}
              style={{
                backgroundColor: '#4CAF50', 
                color: 'white', 
                padding: '5px 10px', 
                margin: '0 5px', 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button 
              onClick={() => handleDelete(pref.id)} 
              style={{
                backgroundColor: '#f44336', 
                color: 'white', 
                padding: '5px 10px', 
                margin: '0 5px', 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Submit Job Preference</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Keywords:
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default JobPreferencePage;
