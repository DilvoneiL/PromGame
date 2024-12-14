'use client';

import React, { useState } from 'react';
import styles from '@/app/(entidades)/entidades.module.css';

interface UploadImagemProps {
  onImageChange: (url: string) => void; // Callback para atualizar a URL da imagem no componente pai
  imagemInicial?: string; // URL inicial da imagem, caso exista
}

const UploadImagem: React.FC<UploadImagemProps> = ({ onImageChange, imagemInicial }) => {
  const [imagemUrl, setImagemUrl] = useState<string>(imagemInicial || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const url = event.target?.result as string;
        setImagemUrl(url);
        onImageChange(url); // Atualiza o estado da imagem no componente pai
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagemUrl(url);
    onImageChange(url); // Atualiza o estado da imagem no componente pai
  };

  return (
    <div className={styles['AdcJogo-upload-section']}>
      {/* Visualização da Imagem */}
      {imagemUrl ? (
        <img
          src={imagemUrl}
          alt="Pré-visualização"
          className={styles['AdcJogo-upload-preview']}
        />
      ) : (
        <div className={styles['AdcJogo-upload-icon']}>⤴</div>
      )}

      {/* Botão de Upload */}
      <label className={styles['AdcJogo-upload-button']}>
        Upload de Imagem
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }} // Esconde o input para usar o botão estilizado
        />
      </label>

      {/* Input para URL da Imagem */}
      <input
        type="text"
        placeholder="Ou cole a URL da imagem"
        value={imagemUrl}
        onChange={handleUrlInputChange}
        className={styles['AdcJogo-upload-url']}
      />
    </div>
  );
};

export default UploadImagem;
