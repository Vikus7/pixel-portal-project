import React from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import defaultGameCover from '../assets/default-game-cover.png';
import PlatformIcon from './PlatformIcon';

const GameCard = ({ game, onEdit, onDelete }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group w-64">  {/* Ajustamos el ancho */}
      {/* Botones flotantes */}
      <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit(game)}
          className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
        >
          <Edit2 size={16} className="text-white" />
        </button>
        <button
          onClick={() => onDelete(game.id)}
          className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
        >
          <Trash2 size={16} className="text-white" />
        </button>
      </div>

      {/* Imagen del juego */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={game.imagen instanceof File ? URL.createObjectURL(game.imagen) : (game.imagen || defaultGameCover)}
          alt={game.nombre}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Información del juego */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{game.nombre}</h3>
        <p className="text-gray-300 mb-2 text-sm">
          {expanded ? game.descripcion : `${game.descripcion.slice(0, 100)}...`}
          {game.descripcion.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-cyan-400 hover:text-cyan-300 ml-2"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </p>
        <p className="text-gray-400 mb-2 text-sm">{game.desarrollador}</p>
        <div className="flex flex-wrap gap-2">
          {game.plataformas.map((platform, index) => (
            <PlatformIcon key={index} platform={platform} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard;