import React, { useState } from 'react'
import './styles/main.css'
import PuzzleGame from './components/PuzzleGame'

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium')

  const images = [
    '/images/xiaoxin.jpg', // 蜡笔小新
    '/images/kenan.jpeg', // 柯南
    '/images/nezha.jpeg', // 哪吒
    '/images/xiongchumo.jpeg', // 熊出没
    '/images/pikaqiu.jpeg', // 皮卡丘
    '/images/wangwangdui.jpeg', // 汪汪队
    '/images/peiqi.jpeg', // 小猪佩奇
    '/images/haxiaolang.jpeg', // 哈小浪
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
            <h3>选择关卡</h3>
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
          <div className="difficulty-selection">
            <h3>选择难度</h3>
            <div className="difficulty-options">
              <button 
                className={`difficulty-option ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                简单 (2×3)
                {difficulty === 'easy' && <div className="check-mark">✓</div>}
              </button>
              <button 
                className={`difficulty-option ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                中等 (4×6)
                {difficulty === 'medium' && <div className="check-mark">✓</div>}
              </button>
              <button 
                className={`difficulty-option ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                困难 (6×9)
                {difficulty === 'hard' && <div className="check-mark">✓</div>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <PuzzleGame imageUrl={selectedImage} difficulty={difficulty} />
          <button 
            className="back-button"
            onClick={() => setGameStarted(false)}
          >
            回到首页
          </button>
        </div>
      )}
    </div>
  )
}

export default App