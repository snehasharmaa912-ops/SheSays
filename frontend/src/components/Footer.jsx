import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size={30} />
          <span>SheSays</span>
        </div>
        <p>A space where girls talk about everything — confidence, beauty, passion, periods, real life.</p>
        <p className="footer-email">
          <a href="mailto:snehasharmaa912@gmail.com">snehasharmaa912@gmail.com</a>
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} SheSays. All voices welcome.</p>
      </div>
    </footer>
  )
}
