import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function AdminTopbar() {
  return (
    <header className="adm-topbar">
      <Link className="adm-back-link" href="/">
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Retour à l'accueil</span>
      </Link>
    </header>
  );
}
