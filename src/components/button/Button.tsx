interface ButtonProps {
    onClick: () => void;
    label: string;
    disabled?: boolean;
    loading?: boolean; // New loading state
    type?: 'primary' | 'secondary' | 'danger'; // Button types
}

const Button: React.FC<ButtonProps> = ({ onClick, label, disabled = false, loading = false, type = 'primary' }) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`button ${type}`}
        aria-busy={loading} // Accessibility for loading state
    >
        {loading ? <span className="spinner" /> : label}
    </button>
);

export default Button;
