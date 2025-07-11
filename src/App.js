import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  X, 
 // User, 
  LogOut, 
  Eye, 
  Target,
  Trophy,
  Star
} from 'lucide-react';

const PredictionMarketMVP = () => {
  const [markets, setMarkets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMarket, setNewMarket] = useState({
    title: '',
    description: '',
    category: 'Technology',
    endDate: ''
  });
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const categories = ['Technology', 'Finance', 'Politics', 'Sports', 'Space', 'Climate', 'Other'];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMarkets = localStorage.getItem('predictionMarkets');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedMarkets) {
      setMarkets(JSON.parse(savedMarkets));
    } else {
      // Initialize with sample data
      const sampleMarkets = [
        {
          id: 1,
          title: "Will AI achieve AGI by 2025?",
          description: "Will artificial general intelligence be achieved by the end of 2025?",
          category: "Technology",
          endDate: "2025-12-31",
          yesVotes: 42,
          noVotes: 58,
          totalVotes: 100,
          created: "2024-01-15",
          resolved: false,
          createdBy: "tech_analyst",
          createdById: 1
        },
        {
          id: 2,
          title: "Bitcoin to reach $100K in 2025?",
          description: "Will Bitcoin's price reach $100,000 USD by end of 2025?",
          category: "Finance",
          endDate: "2025-12-31",
          yesVotes: 67,
          noVotes: 33,
          totalVotes: 100,
          created: "2024-01-10",
          resolved: false,
          createdBy: "crypto_expert",
          createdById: 2
        },
        {
          id: 3,
          title: "SpaceX Mars mission in 2026?",
          description: "Will SpaceX successfully launch a crewed mission to Mars in 2026?",
          category: "Space",
          endDate: "2026-12-31",
          yesVotes: 38,
          noVotes: 62,
          totalVotes: 100,
          created: "2024-01-05",
          resolved: false,
          createdBy: "space_enthusiast",
          createdById: 3
        }
      ];
      setMarkets(sampleMarkets);
      localStorage.setItem('predictionMarkets', JSON.stringify(sampleMarkets));
    }
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleVote = (marketId, voteType) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const userVotes = JSON.parse(localStorage.getItem(`userVotes_${currentUser.id}`)) || {};
    
    if (userVotes[marketId]) {
      alert("You have already voted on this market!");
      return;
    }

    const updatedMarkets = markets.map(market => {
      if (market.id === marketId) {
        const newMarket = { ...market };
        if (voteType === 'yes') {
          newMarket.yesVotes += 1;
        } else {
          newMarket.noVotes += 1;
        }
        newMarket.totalVotes += 1;
        return newMarket;
      }
      return market;
    });

    setMarkets(updatedMarkets);
    localStorage.setItem('predictionMarkets', JSON.stringify(updatedMarkets));
    
    // Track user's vote
    userVotes[marketId] = voteType;
    localStorage.setItem(`userVotes_${currentUser.id}`, JSON.stringify(userVotes));
    
    // Update user's prediction count
    const updatedUser = { ...currentUser, totalPredictions: currentUser.totalPredictions + 1 };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users list
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleCreateMarket = () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    if (!newMarket.title || !newMarket.description || !newMarket.endDate) {
      alert("Please fill in all fields");
      return;
    }

    const market = {
      id: markets.length + 1,
      ...newMarket,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      created: new Date().toISOString().split('T')[0],
      resolved: false,
      createdBy: currentUser.username,
      createdById: currentUser.id
    };

    const updatedMarkets = [...markets, market];
    setMarkets(updatedMarkets);
    localStorage.setItem('predictionMarkets', JSON.stringify(updatedMarkets));
    
    setNewMarket({
      title: '',
      description: '',
      category: 'Technology',
      endDate: ''
    });
    setShowCreateModal(false);
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '' });
    } else {
      alert("Invalid username or password");
    }
  };

  const handleSignup = () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.username === signupForm.username)) {
      alert("Username already exists");
      return;
    }

    if (users.some(u => u.email === signupForm.email)) {
      alert("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
      joinDate: new Date().toISOString(),
      totalPredictions: 0,
      correctPredictions: 0,
      reputation: 1000,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupForm.username}`
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    setShowSignupModal(false);
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const getTotalMarkets = () => markets.length;
  const getActiveMarkets = () => markets.filter(m => !m.resolved).length;
  const getTotalPredictions = () => markets.reduce((sum, m) => sum + m.totalVotes, 0);

  const getYesPercentage = (market) => {
    if (market.totalVotes === 0) return 50;
    return Math.round((market.yesVotes / market.totalVotes) * 100);
  };

  const getNoPercentage = (market) => {
    if (market.totalVotes === 0) return 50;
    return Math.round((market.noVotes / market.totalVotes) * 100);
  };

  const getUserAccuracy = () => {
    if (!currentUser || currentUser.totalPredictions === 0) return 0;
    return Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">PredictHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Market
                  </button>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{currentUser.username}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Markets</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalMarkets()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Markets</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveMarkets()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalPredictions()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div key={market.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {market.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {market.endDate}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{market.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{market.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {market.totalVotes} predictions
                </div>
                <div className="text-sm text-gray-500">
                  by {market.createdBy}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">YES</span>
                  <span className="text-sm font-bold text-green-600">{getYesPercentage(market)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getYesPercentage(market)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">NO</span>
                  <span className="text-sm font-bold text-red-600">{getNoPercentage(market)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getNoPercentage(market)}%` }}
                  ></div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleVote(market.id, 'yes')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Vote YES
                  </button>
                  <button
                    onClick={() => handleVote(market.id, 'no')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Vote NO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Market Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Market</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newMarket.title}
                  onChange={(e) => setNewMarket({...newMarket, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter market title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newMarket.description}
                  onChange={(e) => setNewMarket({...newMarket, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe the market"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newMarket.category}
                  onChange={(e) => setNewMarket({...newMarket, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={newMarket.endDate}
                  onChange={(e) => setNewMarket({...newMarket, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleCreateMarket}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Create Market
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Login</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowSignupModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sign Up</h3>
              <button
                onClick={() => setShowSignupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={signupForm.username}
                  onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleSignup}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignupModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img 
                src={currentUser.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold">{currentUser.username}</h4>
              <p className="text-gray-600">{currentUser.email}</p>
              <p className="text-sm text-gray-500">
                Joined {new Date(currentUser.joinDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">Total Predictions</span>
                </div>
                <span className="font-bold">{currentUser.totalPredictions}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <span className="font-bold">{getUserAccuracy()}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium">Reputation</span>
                </div>
                <span className="font-bold">{currentUser.reputation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionMarketMVP;