import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search, User } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameFormModal from '../components/GameFormModal';
import { MessageCircle } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import UserAvatar from '../components/UserAvatar';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingGame, setEditingGame] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Obtener datos del usuario del localStorage
  // En el Home.jsx
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated');
      if (!isAuth) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/login');
        return;
      }
      
      setUser(userData);

      // Cargar juegos del usuario
      const fetchUserGames = async () => {
        try {
          // Primero obtener el ID del usuario de la DB
          const userIdResponse = await fetch('http://localhost:3000/api/users/id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nombreUsuario: userData.displayName,
              email: userData.email
            })
          });
          
          const userIdData = await userIdResponse.json();
          
          if (userIdData.userId) {
            // Luego obtener los juegos
            const gamesResponse = await fetch(`http://localhost:3000/api/users/${userIdData.userId}/games`);
            const gamesData = await gamesResponse.json();
            
            if (Array.isArray(gamesData)) {
              const formattedGames = gamesData.map(game => ({
                id: game.juego_id,
                nombre: game.juego_nombre,
                portada: game.juego_portada,
                descripcion: game.juego_descripcion,
                desarrollador: game.juego_desarrollador,
                plataformas: game.juego_plataformas.split(',') // Asumiendo que las plataformas están en string separado por comas
              }));
              setGames(formattedGames);
            }
          }
        } catch (error) {
          console.error('Error al cargar los juegos:', error);
        }
      };

      fetchUserGames();
    };

    checkAuth();
  }, [navigate]);

  const handleAddGame = async (gameData) => {
    try {
      if (editingGame) {
        // Lógica de edición existente
        setGames(games.map(game => 
          game.id === editingGame.id 
            ? { ...gameData, id: game.id }
            : game
        ));
      } else {
        // Crear nuevo juego
        const response = await fetch('http://localhost:3000/api/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...gameData,
            userId: user.uid
          })
        });

        const newGame = await response.json();
        
        if (newGame.id) {
          setGames(prev => [...prev, newGame]);
        }
      }
      setEditingGame(null);
    } catch (error) {
      console.error('Error al guardar el juego:', error);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/games/${gameId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            setGames(games.filter(game => game.id !== gameId));
        }
    } catch (error) {
        console.error('Error al eliminar el juego:', error);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };


  const handleEditGame = (game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
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
          <div className="flex items-center space-x-4">
            <UserAvatar 
              src={user?.fotoPerfil} 
              alt={user?.nombreUsuario}
              size="medium"
            />
            <h1 className="text-3xl font-bold text-white">
              ¡Bienvenido, {user?.nombreUsuario || 'Usuario'}!
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
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
            <span>Agregar juego</span>
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

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      >
        <MessageCircle size={24} />
      </button>

      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Home;