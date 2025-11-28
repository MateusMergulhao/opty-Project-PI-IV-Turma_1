import { Link } from "react-router-dom";
import { Tag, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Sobre", href: "/#about" },
      { name: "Contato", href: "/#contact" },
      { name: "Carreiras", href: "#" },
    ],
    legal: [
      { name: "Termos de Uso", href: "#" },
      { name: "Política de Privacidade", href: "#" },
      { name: "Cookies", href: "#" },
    ],
    social: [
      { name: "GitHub", icon: Github, href: "#" },
      { name: "LinkedIn", icon: Linkedin, href: "#" },
      { name: "Twitter", icon: Twitter, href: "#" },
    ],
  };

  return (
    <footer className="bg-gradient-subtle border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Opty</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-4">
              Encontre os melhores preços com inteligência artificial. Compare produtos em
              milhares de lojas e economize nas suas compras.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Opty. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
