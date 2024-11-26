import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameFormModal from '../components/GameFormModal';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingGame, setEditingGame] = useState(null);
  
  // Obtener datos del usuario del localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  const userName = userData?.nombreUsuario || 'Usuario';

  // Agregamos la función handleLogout que faltaba
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddGame = (gameData) => {
    if (editingGame) {
      setGames(games.map(game => 
        game.id === editingGame.id 
          ? { ...gameData, id: game.id }
          : game
      ));
      setEditingGame(null);
    } else {
      setGames([...games, { ...gameData, id: Date.now() }]);
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
  };

  const handleDeleteGame = (gameId) => {
    setGames(games.filter(game => game.id !== gameId));
  };

  const filteredGames = games
    .filter(game => 
      game.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.desarrollador.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareResult = a.nombre.localeCompare(b.nombre);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-900 to-purple-800">
      <header className="bg-gray-900 bg-opacity-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            ¡Bienvenido, {userName}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por nombre o desarrollador..."
              className="w-full bg-gray-800 text-white p-3 pl-10 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          
          <select
            className="bg-gray-800 text-white p-3 rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>

          <button
            onClick={() => {
              setEditingGame(null);
              setIsModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-300"
          >
            <Plus size={20} />
            <span>Agregar Juego</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {filteredGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
            />
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No hay juegos en tu biblioteca. ¡Agrega algunos!
          </div>
        )}
      </main>

      <GameFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddGame}
        initialData={editingGame}
      />
    </div>
  );
};

export default Home;