import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, Plus, BarChart3, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const PredictionMarketMVP = () => {
  // User Authentication State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showProfile, setShowProfile] = useState(false);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('predictionMarketUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const [markets, setMarkets] = useState([
    {
      id: 1,
      title: "Will AI achieve AGI by 2030?",
      description: "Artificial General Intelligence reaching human-level performance across all domains",
      category: "Technology",
      endDate: "2030-01-01",
      yesVotes: 45,
      noVotes: 55,
      totalVotes: 100,
      created: "2024-01-15",
      resolved: false
    },
    {
      id: 2,
      title: "Will Bitcoin reach $100K by end of 2025?",
      description: "Bitcoin price hitting $100,000 USD on major exchanges",
      category: "Finance",
      endDate: "2025-12-31",
      yesVotes: 62,
      noVotes: 38,
      totalVotes: 100,
      created: "2024-02-10",
      resolved: false
    },
    {
      id: 3,
      title: "Will there be a successful Mars landing by 2026?",
      description: "Human crew successfully landing on Mars surface",
      category: "Space",
      endDate: "2026-12-31",
      yesVotes: 73,
      noVotes: 27,
      totalVotes: 100,
      created: "2024-03-05",
      resolved: false
    }
  ]);

  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMarket, setNewMarket] = useState({
    title: '',
    description: '',
    category: '',
    endDate: ''
  });
  const [userVotes, setUserVotes] = useState({});
  const [users, setUsers] = useState([]); // Store all users

  // Initialize users and votes from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('predictionMarketUsers');
    const savedVotes = localStorage.getItem('predictionMarketVotes');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedVotes && user) {
      setUserVotes(JSON.parse(savedVotes)[user.id] || {});
    }
  }, [user]);

  const categories = ['Technology', 'Finance', 'Politics', 'Sports', 'Space', 'Climate', 'Other'];

  // Authentication Functions
  const handleLogin = () => {
    const { username, password } = authForm;
    
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    // Check if user exists
    const existingUser = users.find(u => u.username === username && u.password === password);
    
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('predictionMarketUser', JSON.stringify(existingUser));
      setAuthForm({ username: '', email: '', password: '', confirmPassword: '' });
      setShowAuthModal(false);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleSignup = () => {
    const { username, email, password, confirmPassword } = authForm;
    
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      alert('Username already exists');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      joinDate: new Date().toISOString(),
      totalPredictions: 0,
      correctPredictions: 0,
      reputation: 1000, // Starting reputation
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('predictionMarketUsers', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('predictionMarketUser', JSON.stringify(newUser));
    setAuthForm({ username: '', email: '', password: '', confirmPassword: '' });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setUserVotes({});
    localStorage.removeItem('predictionMarketUser');
    setShowProfile(false);
  };

  const handleVote = (marketId, vote) => {
    if (!user) {
      alert('Please login to vote!');
      setShowAuthModal(true);
      return;
    }

    if (userVotes[marketId]) {
      alert('You have already voted on this market!');
      return;
    }

    setMarkets(markets.map(market => {
      if (market.id === marketId) {
        const newMarket = { ...market };
        if (vote === 'yes') {
          newMarket.yesVotes += 1;
        } else {
          newMarket.noVotes += 1;
        }
        newMarket.totalVotes += 1;
        return newMarket;
      }
      return market;
    }));

    const newUserVotes = { ...userVotes, [marketId]: vote };
    setUserVotes(newUserVotes);

    // Update user's total predictions
    const updatedUser = { ...user, totalPredictions: user.totalPredictions + 1 };
    setUser(updatedUser);
    localStorage.setItem('predictionMarketUser', JSON.stringify(updatedUser));

    // Update users array
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('predictionMarketUsers', JSON.stringify(updatedUsers));

    // Save votes to localStorage
    const allVotes = JSON.parse(localStorage.getItem('predictionMarketVotes') || '{}');
    allVotes[user.id] = newUserVotes;
    localStorage.setItem('predictionMarketVotes', JSON.stringify(allVotes));
  };

  const createMarket = () => {
    if (!user) {
      alert('Please login to create markets!');
      setShowAuthModal(true);
      return;
    }

    if (!newMarket.title || !newMarket.description || !newMarket.category || !newMarket.endDate) {
      alert('Please fill in all fields');
      return;
    }

    const market = {
      id: markets.length + 1,
      title: newMarket.title,
      description: newMarket.description,
      category: newMarket.category,
      endDate: newMarket.endDate,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      created: new Date().toISOString().split('T')[0],
      resolved: false,
      createdBy: user.username,
      createdById: user.id
    };

    setMarkets([...markets, market]);
    setNewMarket({ title: '', description: '', category: '', endDate: '' });
    setShowCreateModal(false);
  };

  const getYesPercentage = (market) => {
    if (market.totalVotes === 0) return 50;
    return Math.round((market.yesVotes / market.totalVotes) * 100);
  };

  const getNoPercentage = (market) => {
    if (market.totalVotes === 0) return 50;
    return Math.round((market.noVotes / market.totalVotes) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilEnd = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PredictHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Market</span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.totalPredictions} predictions</p>
                    </div>
                    <button
                      onClick={() => setShowProfile(true)}
                      className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors"
                    >
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Markets</p>
                <p className="text-2xl font-bold text-gray-900">{markets.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Markets</p>
                <p className="text-2xl font-bold text-gray-900">{markets.filter(m => !m.resolved).length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{markets.reduce((sum, m) => sum + m.totalVotes, 0)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div key={market.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {market.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {getDaysUntilEnd(market.endDate)}d left
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{market.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{market.description}</p>
                
                {/* Probability Display */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">YES</span>
                    <span className="text-sm font-bold text-green-600">{getYesPercentage(market)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getYesPercentage(market)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NO</span>
                    <span className="text-sm font-bold text-red-600">{getNoPercentage(market)}%</span>
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVote(market.id, 'yes')}
                    disabled={userVotes[market.id]}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      userVotes[market.id] === 'yes'
                        ? 'bg-green-500 text-white'
                        : userVotes[market.id]
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    onClick={() => handleVote(market.id, 'no')}
                    disabled={userVotes[market.id]}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      userVotes[market.id] === 'no'
                        ? 'bg-red-500 text-white'
                        : userVotes[market.id]
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    NO
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                  <span>{market.totalVotes} predictions</span>
                  <div className="text-right">
                    <div>Created {formatDate(market.created)}</div>
                    {market.createdBy && <div className="text-xs">by {market.createdBy}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Market Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Market</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Question
                </label>
                <input
                  type="text"
                  value={newMarket.title}
                  onChange={(e) => setNewMarket({ ...newMarket, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Will X happen by Y date?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newMarket.description}
                  onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Provide clear criteria for resolution..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newMarket.category}
                  onChange={(e) => setNewMarket({ ...newMarket, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newMarket.endDate}
                  onChange={(e) => setNewMarket({ ...newMarket, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createMarket}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Market
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-4 mb-6">
              <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Joined {formatDate(user.joinDate)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.totalPredictions}</div>
                  <div className="text-sm text-blue-800">Total Predictions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.reputation}</div>
                  <div className="text-sm text-green-800">Reputation</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {user.totalPredictions > 0 ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0}%
                </div>
                <div className="text-sm text-purple-800">Accuracy Rate</div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Recent Predictions</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(userVotes).map(([marketId, vote]) => {
                    const market = markets.find(m => m.id === parseInt(marketId));
                    return market ? (
                      <div key={marketId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 truncate">{market.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          vote === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {vote.toUpperCase()}
                        </span>
                      </div>
                    ) : null;
                  })}
                  {Object.keys(userVotes).length === 0 && (
                    <p className="text-gray-500 text-sm">No predictions yet</p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full mt-6 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={authMode === 'login' ? handleLogin : handleSignup}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionMarketMVP;