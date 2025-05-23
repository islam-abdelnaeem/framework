import  {React, useEffect, useState } from 'react'
import './Domains.css'
import axios from 'axios'



const Domains = () => {
  
  const [domains, setDomains] = useState("")
  


  const handleSubmit = (e) =>{
    e.preventDefault();
    if (domains !== e.target.elements.domains.value){
      setDomains(e.target.elements.domains.value);
      console.log(domains)
    } else {
      console.log(domains)
    }
  }

  const res = async () =>{
    try {
      const response = await axios.post('http://localhost:5678/webhook-test/c1163b11-7572-4657-ade2-de8c12f72fdc',{domains})
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    if (domains) {
      console.log(domains)
      res();
    }
  }, [domains]);

  
    return (
    <div>
    <form onSubmit={(e) => handleSubmit(e)} >
      <p>
          Enter Domains
      </p>
      <br/>
      <textarea  name="domains" rows="4" cols="20"  placeholder='enter domains'/>
      <br/>
      <button type='submit'>submit</button>
    </form>
    </div>

    
  )
}
export default Domains