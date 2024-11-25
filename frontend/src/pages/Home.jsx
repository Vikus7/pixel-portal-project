import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-900 to-purple-800 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">¡Bienvenido!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>
        <p className="text-xl">Próximamente: Gestión de tu biblioteca de juegos</p>
      </div>
    </div>
  );
};

export default Home;