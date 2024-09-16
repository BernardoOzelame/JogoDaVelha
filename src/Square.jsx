function Square({ value, onClick, disabled }) {
    const className = `square ${value ? value.toLowerCase() : ''} ${disabled ? 'disabled' : ''}`;
    return (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {value}
      </button>
    );
}

export default Square;