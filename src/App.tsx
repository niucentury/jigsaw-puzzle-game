import React, { useState } from 'react'
import './styles/main.css'
import PuzzleGame from './components/PuzzleGame'

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const images = [
    '/images/xiaoxin.jpg' // 本地图片
  ]

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setGameStarted(true)
  }

  return (
    <div className="app">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>拼图游戏</h1>
          <div className="image-selection">
            <h3>请选择关卡</h3>
            <div className="image-options">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="image-option"
                  onClick={() => handleImageSelect(image)}
                >
                  <img src={image} alt={`Puzzle option ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <PuzzleGame imageUrl={selectedImage} />
          <button 
            className="back-button"
            onClick={() => setGameStarted(false)}
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  )
}

export default App