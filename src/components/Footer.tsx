export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-text">
          &copy; {new Date().getFullYear()} Ashlock Tech Solutions
        </span>
        <span className="footer-mark">// case closed</span>
      </div>
    </footer>
  );
}
