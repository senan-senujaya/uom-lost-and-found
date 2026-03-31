import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Modal } from './components/Modal';

function App() {
  // --- 1. THE BRAIN (STATE) ---
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Lost', category: 'ID Card', location: '', reporterName: '', reporterEmail: '', imageUrl: ''
  });
  
  // Calculate how many items are marked as 'Found'
  const foundCount = items.filter(item => item.type === 'Found').length;

  // --- 2. FETCH REAL DATA FROM DATABASE ---
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

  // --- 3. THE FUNCTIONS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/items', formData);
      setItems([res.data, ...items]); 
      setIsModalOpen(false); 
      setFormData({ title: '', description: '', type: 'Lost', category: 'ID Card', location: '', reporterName: '', reporterEmail: '', imageUrl: '' }); 
      
      // NEW: Show the user their token!
      alert(`🎉 Item Reported Successfully!\n\n⚠️ IMPORTANT: Your secret token is: ${res.data.secretToken}\n\nWrite this down! You will need it to click 'Resolve' and remove this post once the item is recovered.`);
      
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Failed to report item.');
    }
  };

  // --- TIME AGO CALCULATOR ---
  const getTimeAgo = (mongoId) => {
    // Extract the timestamp from the MongoDB ID
    const timestamp = parseInt(mongoId.substring(0, 8), 16) * 1000;
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    let interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  const handleDelete = async (id) => {
    // Prompt the user for their token OR the admin password
    const userToken = window.prompt('🔒 Enter your Secret Token (or Admin Password) to resolve this item:');
    
    // If they click 'Cancel' or leave it blank, stop the function
    if (!userToken) return; 

    try {
      // Send the token to the backend
      await axios.delete(`http://localhost:5001/api/items/${id}`, {
        data: { token: userToken.toUpperCase() } 
      });
      
      // FIX: Use prevItems to safely and instantly remove the card from the UI
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      
      alert('✅ Item successfully resolved and removed from the network!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error.response?.data?.message || 'Failed to delete the item. Wrong token?');
    }
  };

  const handleShare = (item) => {
    const shareText = `🚨 ${item.type.toUpperCase()} ITEM ALERT 🚨\n\nItem: ${item.title}\nLocation: ${item.location}\nDescription: ${item.description}\n\nContact: ${item.reporterEmail}\n\nPlease help spread the word!`;
    if (navigator.share) {
      navigator.share({ title: `UoM ${item.type} Item`, text: shareText }).catch(console.error);
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // --- 4. THE FILTER SIEVE ---
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Common glass styling for our select dropdowns and textareas
  const glassInputStyle = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md focus:outline-none focus:bg-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/30 [&>option]:bg-slate-900";

  // --- 5. THE FACE (UI) ---
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-purple-500/30 pb-20">
      
      {/* Background Decorative Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />

      {/* Pass the foundCount down to the Navbar */}
      <Navbar foundCount={foundCount} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
            Find what you lost. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Return what you found.
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            The next-generation campus recovery network. Powered by community.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            + Report an Item
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg">
          <input 
            type="text" 
            placeholder="🔍 Search items..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className={glassInputStyle}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={glassInputStyle}>
            <option value="All">All Types</option>
            <option value="Lost">Lost Items</option>
            <option value="Found">Found Items</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={glassInputStyle}>
            <option value="All">All Categories</option>
            <option value="ID Card">ID Card</option>
            <option value="Wallet">Wallet / Purse</option>
            <option value="Electronics">Electronics</option>
            <option value="Keys">Keys</option>
            <option value="Books">Books / Notes</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-500 text-lg">
              No items match your search.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item._id} className="flex flex-col h-full">
                <div className="flex-grow">
                  <img 
                    src={item.imageUrl || 'https://placehold.co/600x400/1e293b/94a3b8?text=No+Image+Provided'} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-xl mb-4 border border-white/10"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Invalid+Link'; }}
                  />
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${item.type === 'Lost' ? 'text-pink-400 bg-pink-400/10 border border-pink-400/20' : 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20'}`}>
                        {item.type}
                      </span>
                      <span className="text-slate-400 text-sm font-semibold">{item.category}</span>
                    </div>
                    {/* NEW: The Time Ago Display */}
                    <span className="text-slate-500 text-xs font-medium">
                      {getTimeAgo(item._id)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm mb-2"><strong className="text-slate-500">Location:</strong> {item.location}</p>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3"><strong className="text-slate-500">Details:</strong> {item.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 mb-6">
                    <p className="text-xs text-slate-500">Reported by: <span className="text-slate-300">{item.reporterName}</span></p>
                    <p className="text-xs text-slate-500">Contact: <a href={`mailto:${item.reporterEmail}`} className="text-blue-400 hover:text-blue-300 transition-colors">{item.reporterEmail}</a></p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button onClick={() => handleShare(item)} className="flex-1 py-2 bg-white/5 hover:bg-[#25D366]/20 text-white text-sm font-semibold rounded-lg border border-white/10 hover:border-[#25D366]/50 hover:text-[#25D366] transition-all duration-300">
                    📲 Share
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="flex-1 py-2 bg-white/5 hover:bg-pink-500/20 text-white text-sm font-semibold rounded-lg border border-white/10 hover:border-pink-500/50 hover:text-pink-400 transition-all duration-300">
                    ✓ Resolve
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

      </main>

      {/* The Reporting Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report an Item">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-300 mb-1 block">Item Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={glassInputStyle}>
                <option value="Lost">I Lost This</option>
                <option value="Found">I Found This</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-300 mb-1 block">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={glassInputStyle}>
                <option value="ID Card">ID Card</option>
                <option value="Wallet">Wallet / Purse</option>
                <option value="Electronics">Electronics</option>
                <option value="Keys">Keys</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <Input label="Item Title" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Blue Hydroflask" />
          
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1 block">Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Distinguishing features, brand, contents..." className={`${glassInputStyle} min-h-[100px] resize-y`} />
          </div>
          
          <Input label="Location" name="location" required value={formData.location} onChange={handleChange} placeholder="Where exactly was it lost/found?" />
          <Input label="Image URL (Optional)" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          
          <div className="flex gap-4">
            <div className="flex-1">
               <Input label="Your Name" name="reporterName" required value={formData.reporterName} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="flex-1">
               <Input label="University Email" type="email" name="reporterEmail" required value={formData.reporterEmail} onChange={handleChange} placeholder="john@uom.lk" />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Submit Report to Network
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default App;