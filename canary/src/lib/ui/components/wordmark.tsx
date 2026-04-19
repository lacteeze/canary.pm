interface WordmarkProps {
  className?: string;
}

export default function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="dot" />
      canary<span style={{ opacity: 0.4, fontWeight: 500 }}>.pm</span>
    </span>
  );
}
