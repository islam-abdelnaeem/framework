import  {React, useEffect, useState } from 'react'
import './Domains.css'
import axios from 'axios'



const Domains = () => {
  
  const [domains, setDomains] = useState("");
  const [subdomainsList, setSubdomainsList] = useState([]);
  const [subdomainCount, setSubdomainCount] = useState(0);
  


  const handleSubmit = (e) => {
    e.preventDefault();
    const newDomainsValue = e.target.elements.domains.value;
    setSubdomainsList([]); // Clear previous results
    setSubdomainCount(0);   // Clear previous results
    setDomains(newDomainsValue); // This will trigger the useEffect which calls res()
  };

  const res = async () =>{
    try {
      const response = await axios.post('http://localhost:5678/webhook-test/c1163b11-7572-4657-ade2-de8c12f72fdc',{domains})
      console.log("Full response data:", response.data); // Log the full response for debugging

      // The n8n Code node returns [{ json: { subdomains: subdomains, count: count } }]
      // The "Respond to Webhook" node with respondWith: "firstIncomingItem" will send the inner json object.
      // So, response.data should be { json: { subdomains: [...], count: ... } }.
      if (response.data && response.data.json && Array.isArray(response.data.json.subdomains) && typeof response.data.json.count === 'number') {
        setSubdomainsList(response.data.json.subdomains);
        setSubdomainCount(response.data.json.count);
      } else {
        setSubdomainsList([]);
        setSubdomainCount(0);
        console.error("Received unexpected data structure from n8n workflow. Expected response.data.json.subdomains (array) and response.data.json.count (number). Actual data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching subdomains:", error);
      setSubdomainsList([]);
      setSubdomainCount(0);
    }
  }


  useEffect(() => {
    if (domains) { // Only call res if domains is not empty
      // console.log("Domains changed, calling res():", domains); // Kept for debugging
      res();
    }
  }, [domains]); // Effect depends on domains state

  
    return (
    <div className="domains-container"> {/* Added a wrapper class for potential styling */}
      <form onSubmit={handleSubmit} className="domains-form">
        <p>
            Enter Domains
        </p>
        <br/>
        <textarea  name="domains" rows="4" cols="30"  placeholder='enter domains (one per line)'/>
        <br/>
        <button type='submit'>Find Subdomains</button>
      </form>

      {subdomainCount > 0 && (
        <div className="results-container">
          <h2>Found {subdomainCount} subdomains:</h2>
          <textarea
            name="subdomainsResult"
            rows="10" // Or a suitable number of rows
            cols="50" // Or a suitable width
            readOnly
            value={subdomainsList.join('\n')} // Display subdomains, one per line
            placeholder="Found subdomains will appear here..."
            className="subdomains-textarea"
          />
          {/* Optional: Display as a list
          <ul className="subdomains-list">
            {subdomainsList.map((subdomain, index) => (
              <li key={index}>{subdomain}</li>
            ))}
          </ul>
          */}
        </div>
      )}
    </div>
  )
}
export default Domains