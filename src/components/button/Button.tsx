//Button.tsx

interface ButtonProps {
    onClick?: () => void; // Made optional for cases like 'submit'
    label: string;
    disabled?: boolean;
    loading?: boolean; // Loading state
    type?: 'primary' | 'secondary' | 'danger'; // Button types for styling
    htmlType?: 'button' | 'submit' | 'reset'; // Native button types
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    label,
    disabled = false,
    loading = false,
    type = 'primary',
    htmlType = 'button', // Default to 'button'
}) => (
    <button
        type={htmlType} // Use native HTML type
        onClick={onClick}
        disabled={disabled || loading}
        className={`button ${type}`}
        aria-busy={loading} // Accessibility for loading state
    >
        {loading ? <span className="spinner" /> : label}
    </button>
);

export default Button;
