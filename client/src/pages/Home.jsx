import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [items, setItems] = useState([]);
  
  // NEW: State variables to hold our search and filter choices
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure this item is resolved? It will be removed from the feed.')) {
      try {
        await axios.delete(`http://localhost:5001/api/items/${id}`);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete the item.');
      }
    }
  };

  // NEW: The Social Share Function
  const handleShare = (item) => {
    // 1. Format the message we want to share
    const shareText = `🚨 ${item.type.toUpperCase()} ITEM ALERT 🚨\n\nItem: ${item.title}\nLocation: ${item.location}\nDescription: ${item.description}\n\nContact: ${item.reporterEmail}\n\nPlease help spread the word!`;

    // 2. Check if the user is on a mobile device that supports native sharing
    if (navigator.share) {
      navigator.share({
        title: `UoM ${item.type} Item`,
        text: shareText,
      }).catch(console.error);
    } else {
      // 3. If on a laptop/desktop, generate a WhatsApp Web share link
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // NEW: The "Sieve" - This filters the items array before drawing it on screen
  const filteredItems = items.filter((item) => {
    // Check if the title or description contains the search words
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if it matches the dropdowns (or if 'All' is selected)
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Styles
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px', marginTop: '10px' };
  const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white', display: 'flex', flexDirection: 'column' };
  const tagStyle = (type) => ({ display: 'inline-block', padding: '5px 10px', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '10px', backgroundColor: type === 'Lost' ? '#d9534f' : '#5cb85c' });
  const buttonStyle = { marginTop: 'auto', paddingTop: '10px' };
  const filterBarStyle = { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' };
  const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#002147' }}>UoM Lost and Found Feed</h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>Help your fellow students by returning what you've found, or post what you're missing!</p>

      {/* NEW: The Search and Filter Bar UI */}
      <div style={filterBarStyle}>
        <input 
          type="text" 
          placeholder="🔍 Search items..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={inputStyle} 
        />
        
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={inputStyle}>
          <option value="All">All Types (Lost & Found)</option>
          <option value="Lost">Only Lost Items</option>
          <option value="Found">Only Found Items</option>
        </select>

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={inputStyle}>
          <option value="All">All Categories</option>
          <option value="ID Card">ID Card</option>
          <option value="Wallet">Wallet / Purse</option>
          <option value="Electronics">Electronics</option>
          <option value="Keys">Keys</option>
          <option value="Books">Books / Notes</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={gridStyle}>
        {/* Notice we use filteredItems here now, not items! */}
        {filteredItems.length === 0 ? (
          <h3 style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>No items match your search.</h3>
        ) : (
          filteredItems.map((item) => (
            <div key={item._id} style={cardStyle}>
              <div>
                <img 
                  src={item.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=No+Image+Provided'} 
                  alt={item.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} 
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400/eeeeee/999999?text=Invalid+Image+Link'; }}
                />
                <span style={tagStyle(item.type)}>{item.type}</span>
                <span style={{ marginLeft: '10px', color: '#777', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.category}</span>
                <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>{item.title}</h3>
                <p style={{ color: '#444', fontSize: '0.95rem' }}><strong>Description:</strong> {item.description}</p>
                <p style={{ color: '#444', fontSize: '0.95rem' }}><strong>Location:</strong> {item.location}</p>
                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }} />
                <p style={{ fontSize: '0.85rem', color: '#888' }}>
                  Reported by: {item.reporterName} <br/>
                  Contact: <a href={`mailto:${item.reporterEmail}`} style={{ color: '#002147' }}>{item.reporterEmail}</a>
                </p>
              </div>
              
              {/* BUTTON ROW: Share & Resolve */}
              <div style={{ ...buttonStyle, display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleShare(item)}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#e3e3e3"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"/></svg> Share
                </button>
                
                <button 
                  onClick={() => handleDelete(item._id)}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ✓ Resolve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;