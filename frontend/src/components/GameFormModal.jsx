import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { add } from 'date-fns';

const PLATFORM_OPTIONS = [
  { value: 'ps5', label: '🎮 PlayStation 5' },
  { value: 'xbox', label: '🎮 Xbox Series X|S' },
  { value: 'switch', label: '🎮 Nintendo Switch' },
  { value: 'pc', label: '💻 PC' },
  { value: 'other', label: '➕ Otro' }
];
const userData = JSON.parse(localStorage.getItem('user'));

const GameFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: null,
    descripcion: '',
    desarrollador: '',
    plataformas: [],
    customPlatform: ''
  });
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  // En el useEffect del modal:
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        plataformas: initialData.plataformas.split(',').map(p => p.trim())
      });
    } else {
      setFormData({
        nombre: '',
        portada: null,
        descripcion: '',
        desarrollador: '',
        plataformas: []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos requeridos
    if (!formData.nombre || !formData.descripcion || !formData.desarrollador || !formData.plataformas.length) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const gameData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      desarrollador: formData.desarrollador,
      plataformas: formData.plataformas.join(','),
      portada: formData.imagen || null
    };

    console.log('Datos del juego a enviar:', gameData);

    try {
      enviarJuego(gameData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };



  const enviarJuego = async (gameData) => {
    console.log('Datos del juego a enviar:', gameData);
  
    try {
      // Primero, se añade el juego y esperamos la respuesta.
      const addedGame = await addGames(gameData);
  
      // Ahora, con los datos del juego agregados (como `addedGame` si es necesario),
      // vinculamos el juego al usuario.
      await linkGameToUser(gameData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };
  

  

  const addGames = async (gameData) => {

    try {
      const response = await fetch('http://localhost:3001/api/games/addGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "nombre": gameData.nombre,
          "portada": gameData.portada,
          "descripcion": gameData.descripcion,
          "desarrollador": gameData.desarrollador,
          "plataformas": gameData.plataformas
        })
      });

      const data = await response.json();
      console.log('Agregar juegos: ', data);

      
    } catch (error) {
      console.error('Error al obtener ID:', error);
    }

  };

  

  const linkGameToUser = async (gameData) => {
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
      console.log('link juegos: ', data);
    

      
    } catch (error) {
      console.error('Error al obtener ID:', error);
    }

  };




  // Función auxiliar para convertir imagen a base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handlePlatformChange = (platform) => {
    if (platform === 'other') {
      return; // Manejar la entrada personalizada separadamente
    }

    setFormData(prev => ({
      ...prev,
      plataformas: prev.plataformas.includes(platform)
        ? prev.plataformas.filter(p => p !== platform)
        : [...prev.plataformas, platform]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {initialData ? 'Editar juego' : 'Agregar nuevo juego'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre del juego"
              className={`w-full bg-gray-700 text-white p-3 rounded-lg ${errors.nombre ? 'border-red-500' : ''
                }`}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-gray-700 text-white p-3 rounded-lg"
              onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
            />
          </div>

          <div>
            <textarea
              placeholder="Descripción"
              className={`w-full bg-gray-700 text-white p-3 rounded-lg ${errors.descripcion ? 'border-red-500' : ''
                }`}
              rows="4"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Desarrollador"
              className={`w-full bg-gray-700 text-white p-3 rounded-lg ${errors.desarrollador ? 'border-red-500' : ''
                }`}
              value={formData.desarrollador}
              onChange={(e) => setFormData({ ...formData, desarrollador: e.target.value })}
            />
            {errors.desarrollador && (
              <p className="text-red-500 text-sm mt-1">{errors.desarrollador}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Plataformas</label>
            <div className="space-y-2">
              {PLATFORM_OPTIONS.map((platform) => (
                <label key={platform.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.plataformas.includes(platform.value)}
                    onChange={() => handlePlatformChange(platform.value)}
                    className="form-checkbox text-purple-500"
                  />
                  <span className="text-white">{platform.label}</span>
                </label>
              ))}
            </div>
            {errors.plataformas && (
              <p className="text-red-500 text-sm mt-1">{errors.plataformas}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-all duration-300"
          >
            {initialData ? 'Guardar Cambios' : 'Agregar Juego'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameFormModal;