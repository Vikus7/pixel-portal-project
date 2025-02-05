import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
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
  const userAddedRef = useRef(false); // Usa useRef para rastrear si el usuario ya fue añadido

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Iniciando checkAuth');
      const isAuth = localStorage.getItem('isAuthenticated');
      if (!isAuth) {
        navigate('/login');
        return;
      }

      console.log('userData del localStorage:', userData);
      
      if (!userData) {
        navigate('/login');
        return;
      }
      
      setUser(userData);
    };

    const anadirUsuario = async () => {
      if (!userData || userAddedRef.current) { // Verifica si el usuario ya fue añadido usando el ref
        console.error('userData is null or user already added');
        return;
      }

      console.log('Email enviado en el body:', userData.email);
      console.log('Nombre de usuario enviado en el body:', userData.nombreUsuario);

      console.log('Iniciando anadirUsuario');
      try {
        const response = await fetch('http://localhost:3001/api/games/addUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userData.nombreUsuario,
            email: userData.email
          })
        });
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        userAddedRef.current = true; // Marca que el usuario ya fue añadido usando el ref
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
    anadirUsuario();
    fetchGames();
  }, [navigate]); // Elimina userAdded de las dependencias

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games/getGames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email
        })
      });

      const data = await response.json();
      console.log('fectch juegos: ', data);

      const gamesArray = data.juegos?.juegos || data.juegos || [];
      if (Array.isArray(gamesArray)) {
        console.log('Juegos a mostrar:', gamesArray);
        setGames(gamesArray);
      } else {
        console.error('Estructura de datos inesperada:', data);
      }
    } catch (error) {
      console.error('Error al obtener ID:', error);
    }
  };

  const handleAddGame = async (gameData) => {
    try {
      const response = await fetch('http://localhost:3001/api/games/addGameToUserList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": userData.email,
          "juego_nombre": gameData.nombre
        })
      });

      const data = await response.json();
      console.log('response add games:', data);
    } catch (error) {
      console.error('Error al obtener ID:', error);
    }
  };

  const handleEditGame = async (game) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/games/${user.dbId}/${gameId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchGames(); // Recargar la lista después de eliminar
      }
    } catch (error) {
      console.error('Error al eliminar juego:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    sessionStorage.removeItem('userAdded'); // Limpiar la marca de usuario añadido
    navigate('/');
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
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colores duration-300"
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
