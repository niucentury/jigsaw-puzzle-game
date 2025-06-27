import React, { useState, useRef, useEffect } from 'react'
import './PuzzleGame.css'

interface PuzzlePiece {
  id: number
  x: number
  y: number
  correctX: number
  correctY: number
  imageUrl: string
  offsetX: number
  offsetY: number
  isPlaced: boolean
}

const PuzzleGame: React.FC<{ imageUrl: string, difficulty: string }> = ({ imageUrl, difficulty }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  //window.addEventListener('resize', handleResize)
  //return () => window.removeEventListener('resize', handleResize)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [puzzleAreaSize, setPuzzleAreaSize] = useState({ width: 0, height: 0 })
  const [puzzleSize, setPuzzleSize] = useState(() => {
    switch(difficulty) {
      case 'easy': return { cols: 3, rows: 2 }
      case 'medium': return { cols: 6, rows: 4 }
      case 'hard': return { cols: 9, rows: 6 }
      default: return { cols: 6, rows: 4 }
    }
  })

  // 获取图片原始尺寸
  useEffect(() => {
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
  }, [imageUrl])

  // 计算拼图框尺寸
  useEffect(() => {
    if (imageSize.width === 0 || imageSize.height === 0) return
    
    setPuzzleAreaSize({
      width: windowSize.width,
      height: imageSize.height * (windowSize.width / imageSize.width)
    })
  }, [imageSize, windowSize])

  // 初始化拼图碎片
  useEffect(() => {
    if (puzzleAreaSize.width === 0 || puzzleAreaSize.height === 0) return
    
    const initializePuzzle = () => {
      const cols = puzzleSize.cols
      const rows = puzzleSize.rows
      const pieceWidth = puzzleAreaSize.width / cols
      const pieceHeight = puzzleAreaSize.height / rows
      const newPieces: PuzzlePiece[] = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          newPieces.push({
            id: row * cols + col,
            x: Math.random() * (windowSize.width - pieceWidth),
            y: Math.random() * (windowSize.height - puzzleAreaSize.height - pieceHeight) + puzzleAreaSize.height,
            correctX: col * pieceWidth,
            correctY: row * pieceHeight,
            imageUrl: imageUrl,
            offsetX: -col * pieceWidth,
            offsetY: -row * pieceHeight,
            isPlaced: false
          })
        }
      }
      
      setPieces(newPieces)
    }

    initializePuzzle()
  }, [imageUrl, puzzleAreaSize, windowSize])

  // 检查游戏是否完成
  useEffect(() => {
    if (pieces.length > 0 && pieces.every(piece => piece.isPlaced)) {
      setGameCompleted(true)
    }
  }, [pieces])

  const handlePieceDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    const piece = pieces.find(p => p.id === id)
    if (!piece) return
    
    // 计算鼠标相对于碎片左上角的偏移量
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    e.dataTransfer.setData('text/plain', `${id},${offsetX},${offsetY}`)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const [idStr, offsetXStr, offsetYStr] = e.dataTransfer.getData('text/plain').split(',')
    const id = parseInt(idStr)
    const offsetX = parseFloat(offsetXStr)
    const offsetY = parseFloat(offsetYStr)
    const piece = pieces.find(p => p.id === id)
    if (!piece || piece.isPlaced) return
    
    // 计算相对于窗口的位置，考虑鼠标偏移量
    const x = e.clientX - offsetX
    const y = e.clientY - offsetY
    // 检查是否放置在正确位置附近
    const maxGapX = Math.max(puzzleAreaSize.width / puzzleSize.cols / 5, 10)
    const maxGapY = Math.max(puzzleAreaSize.height / puzzleSize.rows / 5, 10)
    const isCorrectPosition = 
      Math.abs(x - piece.correctX) < maxGapX && 
      Math.abs(y - piece.correctY) < maxGapY
    
    setPieces(prevPieces => 
      prevPieces.map(p => 
        p.id === id 
          ? { 
              ...p, 
              x: isCorrectPosition ? piece.correctX : x,
              y: isCorrectPosition ? piece.correctY : y,
              isPlaced: isCorrectPosition
            } 
          : p
      )
    )
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="puzzle-game"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}>
      <div 
        className="puzzle-area" 
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: `${puzzleAreaSize.width}px`,
          height: `${puzzleAreaSize.height}px`,
          backgroundColor: '#f0f0f0',
          opacity: 0.5,
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      
      {pieces.map(piece => (
        <div
          key={piece.id}
          className={`puzzle-piece ${piece.isPlaced ? 'placed' : ''}`}
          draggable={!piece.isPlaced}
          onDragStart={(e) => handlePieceDragStart(e, piece.id)}
          style={{
            position: 'absolute',
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${puzzleAreaSize.width / puzzleSize.cols}px`,
            height: `${puzzleAreaSize.height / puzzleSize.rows}px`,
            backgroundSize: `${puzzleAreaSize.width}px ${puzzleAreaSize.height}px`,
            backgroundPosition: `${piece.offsetX}px ${piece.offsetY}px`,
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${piece.imageUrl})`,
            cursor: piece.isPlaced ? 'default' : 'grab',
            opacity: 1,
            transition: piece.isPlaced ? 'opacity 0.3s' : 'none'
          }}
        />
      ))}
      
      {gameCompleted && (
        <div 
          className="completion-message"
          style={{
            top: `${puzzleAreaSize.height}px`
          }}
        >
          <h2>恭喜通关！</h2>
        </div>
      )}
    </div>
  )
}

export default PuzzleGame