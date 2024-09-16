import React, { useState, useEffect } from 'react'; 
import Square from './Square.jsx';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function Board({ difficulty, resetScores, setResetScores, player1Name, player2Name }) {
    const savedSquares = JSON.parse(localStorage.getItem('squares'));
    const savedXIsNext = JSON.parse(localStorage.getItem('xIsNext'));
    const savedScores = JSON.parse(localStorage.getItem('scores')) || { X: 0, O: 0, Draws: 0 };

    const [squares, setSquares] = useState(savedSquares || Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(savedXIsNext !== null ? savedXIsNext : true);
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);
    const [computerPlaying, setComputerPlaying] = useState(false);
    const [scores, setScores] = useState(savedScores);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const playerNames = {
        'X': player1Name,
        'O': player2Name,
    };

    useEffect(() => {
        if (resetScores) {
            setScores({ X: 0, O: 0, Draws: 0 });
            localStorage.removeItem('scores');
            setResetScores(false);
        }
    }, [resetScores, setResetScores]);

    useEffect(() => {
        localStorage.setItem('squares', JSON.stringify(squares));
        localStorage.setItem('xIsNext', JSON.stringify(xIsNext));
        localStorage.setItem('scores', JSON.stringify(scores));

        const newWinner = calculateWinner(squares);
        if (newWinner) {
            setWinner(newWinner);
            setIsDraw(false);
            setScores(prevScores => ({ ...prevScores, [newWinner]: prevScores[newWinner] + 1 }));
            setComputerPlaying(false);
        } else if (!squares.includes(null)) {
            setIsDraw(true);
            setScores(prevScores => ({ ...prevScores, Draws: prevScores.Draws + 1 }));
            setComputerPlaying(false);
        } else if (!xIsNext && !newWinner) {
            setComputerPlaying(true);
            const timer = setTimeout(() => {
                computerPlay(difficulty);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [squares, xIsNext, difficulty]);

    const handleResetScores = () => {
        const confirmacao = window.confirm("Você tem certeza de que deseja zerar o placar? \nClique em 'OK' para confirmar ou 'Cancelar' para desistir.");
        if (confirmacao) {
            setResetScores(true);
        }
    };

    const handleClick = (i) => {
        if (winner || squares[i] || isDraw || computerPlaying) return;

        const newSquares = squares.slice();
        newSquares[i] = 'X';
        setSquares(newSquares);
        setXIsNext(false);
    };

    const handleReset = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
        setWinner(null);
        setIsDraw(false);
        setComputerPlaying(false);
        localStorage.removeItem('squares');
        localStorage.removeItem('xIsNext');
    };

    const computerPlay = (difficulty) => {
        const newSquares = squares.slice();
        const emptySquares = newSquares.map((square, index) => (square === null ? index : null)).filter(val => val !== null);

        if (emptySquares.length > 0) {
            let index;
            if (difficulty === 'difícil') {
                index = findBestMove(newSquares);
            } else {
                index = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            }
            newSquares[index] = 'O';
            setSquares(newSquares);
            setXIsNext(true);
            setComputerPlaying(false);
        }
    };

    const findBestMove = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let [a, b, c] of lines) {
            if (squares[a] === 'O' && squares[b] === 'O' && squares[c] === null) return c;
            if (squares[a] === 'O' && squares[c] === 'O' && squares[b] === null) return b;
            if (squares[b] === 'O' && squares[c] === 'O' && squares[a] === null) return a;
        }

        for (let [a, b, c] of lines) {
            if (squares[a] === 'X' && squares[b] === 'X' && squares[c] === null) return c;
            if (squares[a] === 'X' && squares[c] === 'X' && squares[b] === null) return b;
            if (squares[b] === 'X' && squares[c] === 'X' && squares[a] === null) return a;
        }

        return squares.indexOf(null);
    };

    const toggleScoreModal = () => {
        setShowScoreModal(!showScoreModal);
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

    const generateParticles = () => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F4FF33', '#33FFF0'];
        const particles = [];

        for (let i = 0; i < 100; i++) {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.push(
                <div
                    key={i}
                    className="particle"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        top: `${top}%`,
                        animationDelay: `${delay}s`,
                        backgroundColor: color,
                    }}
                />
            );  
        }
        return <div className="particle-container">{particles}</div>;
    };

    const renderSquare = (i) => {
        return <Square value={squares[i]} onClick={() => handleClick(i)} disabled={computerPlaying} />;
    };

    return (
        <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {!showScoreModal && (
                <div className="scores">
                    <button className="btn btn-primary position-fixed top-0 start-0 m-3 fs-4" onClick={toggleScoreModal}><i class="fa-solid fa-star"></i></button>
                </div>
            )}

            {showScoreModal && (
                <div
                    className={`modal fade show d-block`}
                    tabIndex="-1"
                    style={{
                    display: showScoreModal ? 'block' : 'none',
                    position: 'absolute',
                    top: modalPosition.top,
                    left: modalPosition.left,
                    zIndex: 1050,
                    }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" onMouseDown={handleMouseDown} style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
                                <h5 className="modal-title">Placar</h5>
                                <button type="button" className="btn-close" onClick={toggleScoreModal}></button>
                            </div>
                            <div className="modal-body">
                                <p><b>{playerNames['X']}:</b> {scores.X}</p>
                                <p><b>{playerNames['O']}:</b> {scores.O}</p>
                                <p><b>Empates:</b> {scores.Draws}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleResetScores}>Zerar Placar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        {(winner || isDraw) && (
            <div className="victory-screen">
                <h2>{winner ? `Vencedor: ${playerNames[winner]}` : 'Empate!'}</h2>
                {generateParticles()}
                <button className="btn btn-primary victory-reset-button" onClick={handleReset}>
                    Jogar Novamente
                </button>
            </div>
        )}


            <div className={`board ${winner ? 'board-winner' : ''}`}>
                <div className="board-row">
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className="board-row">
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row">
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
        </div>
    );
}

export default Board;