import React, { useState, useRef, useEffect } from 'react'
import './PuzzleGame.css'

interface PuzzlePiece {
  id: number
  x: number
  y: number
  correctX: number
  correctY: number
  imageUrl: string
  isPlaced: boolean
}

const PuzzleGame: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const puzzleAreaRef = useRef<HTMLDivElement>(null)

  // 初始化拼图碎片
  useEffect(() => {
    const initializePuzzle = () => {
      const cols = 3
      const rows = 2
      const pieceWidth = 200
      const pieceHeight = 200
      
      const newPieces: PuzzlePiece[] = []
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          newPieces.push({
            id: row * cols + col,
            x: Math.random() * 100, // 初始随机位置x
            y: Math.random() * 100 + 500, // 初始随机位置y (放在屏幕下方)
            correctX: col * pieceWidth,
            correctY: row * pieceHeight,
            imageUrl: `${imageUrl}#xywh=${col*pieceWidth},${row*pieceHeight},${pieceWidth},${pieceHeight}`,
            isPlaced: false
          })
        }
      }
      
      setPieces(newPieces)
    }

    initializePuzzle()
  }, [imageUrl])

  // 检查游戏是否完成
  useEffect(() => {
    if (pieces.length > 0 && pieces.every(piece => piece.isPlaced)) {
      setGameCompleted(true)
    }
  }, [pieces])

  const handlePieceDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('text/plain', id.toString())
  }

  const handlePuzzleAreaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!puzzleAreaRef.current) return
    
    const id = parseInt(e.dataTransfer.getData('text/plain'))
    const piece = pieces.find(p => p.id === id)
    if (!piece || piece.isPlaced) return
    
    const rect = puzzleAreaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 100 // 减去一半宽度居中
    const y = e.clientY - rect.top - 100 // 减去一半高度居中
    
    // 检查是否放置在正确位置附近
    const isCorrectPosition = 
      Math.abs(x - piece.correctX) < 50 && 
      Math.abs(y - piece.correctY) < 50
    
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
    <div className="puzzle-game">
      <div 
        className="puzzle-area" 
        ref={puzzleAreaRef}
        onDrop={handlePuzzleAreaDrop}
        onDragOver={handleDragOver}
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: '600px 400px',
          width: '600px',
          height: '400px',
          position: 'relative'
        }}
      >
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
              width: '200px',
              height: '200px',
              backgroundImage: `url(${piece.imageUrl})`,
              cursor: piece.isPlaced ? 'default' : 'grab',
              opacity: piece.isPlaced ? 0.5 : 1,
              transition: piece.isPlaced ? 'opacity 0.3s' : 'none'
            }}
          />
        ))}
      </div>
      
      {gameCompleted && (
        <div className="completion-message">
          <h2>Congratulations! Puzzle Completed!</h2>
        </div>
      )}
    </div>
  )
}

export default PuzzleGame