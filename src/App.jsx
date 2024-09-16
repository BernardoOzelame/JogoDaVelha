import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './Board.jsx';

function Game() {
  const [difficulty, setDifficulty] = useState(localStorage.getItem('difficulty') || 'fácil');
  const [resetScores, setResetScores] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 850 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [player1Name, setPlayer1Name] = useState(localStorage.getItem('player1Name') || 'X');
  const [player2Name, setPlayer2Name] = useState(localStorage.getItem('player2Name') || 'O');
  const [player1Input, setPlayer1Input] = useState('');
  const [player2Input, setPlayer2Input] = useState('');

  useEffect(() => {
    const savedPlayer1Name = localStorage.getItem('player1Name');
    const savedPlayer2Name = localStorage.getItem('player2Name');
    const savedDifficulty = localStorage.getItem('difficulty');

    if (savedPlayer1Name) {
      setPlayer1Name(savedPlayer1Name);
    }

    if (savedPlayer2Name) {
      setPlayer2Name(savedPlayer2Name);
    }

    if (savedDifficulty) {
      setDifficulty(savedDifficulty);
    }
  }, []);

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    const userConfirmed = window.confirm(`Você tem certeza de que deseja alterar a dificuldade para "${newDifficulty}"? Isso resetará o jogo e o placar. Clique em 'OK' para confirmar ou 'Cancelar' para manter a dificuldade atual.`);
    if (userConfirmed) {
      setDifficulty(newDifficulty);
      localStorage.setItem('difficulty', newDifficulty);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - modalPosition.left,
      y: e.clientY - modalPosition.top,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setModalPosition({
        left: e.clientX - dragOffset.x,
        top: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const updatedPlayer1Name = player1Input || 'X';
    const updatedPlayer2Name = player2Input || 'O';

    setPlayer1Name(updatedPlayer1Name);
    setPlayer2Name(updatedPlayer2Name);

    localStorage.setItem('player1Name', updatedPlayer1Name);
    localStorage.setItem('player2Name', updatedPlayer2Name);

    closeModal();
  };

  const handleResetNames = () => {
    const confirmacao = window.confirm("Tem certeza de que deseja redefinir os nomes dos jogadores para os padrões?");
    if (confirmacao) {
      setPlayer1Name('X');
      setPlayer2Name('O');

      localStorage.setItem('player1Name', 'X');
      localStorage.setItem('player2Name', 'O');

      closeModal();
    }
  };

  return (
    <div className="game container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {!showModal && (
        <button className="btn btn-primary position-fixed top-0 end-0 m-3 fs-4" onClick={openModal}>
          <i className="fa-solid fa-signature"></i>
        </button>
      )}

      {showModal && (
        <div
          className={`modal fade show d-block`}
          tabIndex="-1"
          style={{
            display: showModal ? 'block' : 'none',
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog position-fixed"
          >
            <div className="modal-content">
              <div className="modal-header" onMouseDown={handleMouseDown} style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
                <h5 className="modal-title">Nomes dos Jogadores</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleNameSubmit}>
                  <div className="mb-3 d-flex align-items-center">
                    <label htmlFor="player1" className="me-3 fs-5">X:</label>
                    <input type="text" className="form-control" id="player1" value={player1Input} placeholder={player1Name} onChange={(e) => setPlayer1Input(e.target.value)} maxLength={12} style={{ width: 'auto' }} />
                  </div>
                  <div className="mb-3 d-flex align-items-center">
                    <label htmlFor="player2" className="me-3 fs-5">O:</label>
                    <input type="text" className="form-control" id="player2" value={player2Input} placeholder={player2Name} onChange={(e) => setPlayer2Input(e.target.value)} maxLength={12} style={{ width: 'auto' }} />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" title='Salvar nomes'><i class="fa-solid fa-floppy-disk"></i></button>
                    <button className="btn btn-secondary" onClick={handleResetNames} title='Redefinir nomes'><i class="fa-solid fa-arrow-rotate-right"></i></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1>Jogo da Velha</h1>
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Dificuldade:</label>
        <select id="difficulty" value={difficulty} onChange={handleDifficultyChange} className="form-select mb-3">
          <option value="fácil">Fácil</option>
          <option value="difícil">Difícil</option>
        </select>
      </div>
      <Board
        difficulty={difficulty}
        resetScores={resetScores}
        setResetScores={setResetScores}
        player1Name={player1Name}
        player2Name={player2Name}
      />
    </div>
  );
}

export default Game;