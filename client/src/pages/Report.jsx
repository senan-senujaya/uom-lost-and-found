import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Report() {
  const navigate = useNavigate(); // This lets us redirect the user after they submit
  
  // This holds all the data the user types into the form
const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lost',
    category: 'ID Card',
    location: '',
    reporterName: '',
    reporterEmail: '',
    imageUrl: '' // <-- We added this!
  });

  // This updates our state whenever the user types something
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This runs when they click "Submit"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    try {
      // Send the data to our backend door!
      await axios.post('http://localhost:5001/api/items', formData);
      alert('Item reported successfully!');
      navigate('/'); // Send them back to the home page
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Failed to report item. Is your backend server running?');
    }
  };

  // Simple styling for our form
  const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '0 auto', gap: '15px' };
  const inputStyle = { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Report an Item</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>I have...</label>
        <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
          <option value="Lost">Lost Something</option>
          <option value="Found">Found Something</option>
        </select>

        <label>Item Category</label>
        <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
          <option value="ID Card">ID Card</option>
          <option value="Wallet">Wallet / Purse</option>
          <option value="Electronics">Electronics (Phone, Laptop, etc.)</option>
          <option value="Keys">Keys</option>
          <option value="Books">Books / Notes</option>
          <option value="Other">Other</option>
        </select>

        <label>Item Title (Short description)</label>
        <input type="text" name="title" required placeholder="e.g., Blue Student ID Wallet" value={formData.title} onChange={handleChange} style={inputStyle} />

        <label>Detailed Description</label>
        <textarea name="description" required placeholder="What does it look like? Any distinct marks?" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} />

        <label>Location (Where was it lost/found?)</label>
        <input type="text" name="location" required placeholder="e.g., Main Library, 2nd Floor" value={formData.location} onChange={handleChange} style={inputStyle} />

        <label>Image URL (Optional - paste a link to a photo)</label>
        <input 
          type="text" 
          name="imageUrl" 
          placeholder="e.g., https://imgur.com/myphoto.jpg" 
          value={formData.imageUrl} 
          onChange={handleChange} 
          style={inputStyle} 
        />

        <label>Your Name</label>
        <input type="text" name="reporterName" required value={formData.reporterName} onChange={handleChange} style={inputStyle} />

        <label>Your University Email</label>
        <input type="email" name="reporterEmail" required value={formData.reporterEmail} onChange={handleChange} style={inputStyle} />

        <button type="submit" style={{ padding: '12px', backgroundColor: '#002147', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default Report;