export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 text-sm text-foreground/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Ayursutra. Holistic wellness, modern
          care.
        </p>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#centres" className="hover:text-foreground">
            Centres
          </a>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
