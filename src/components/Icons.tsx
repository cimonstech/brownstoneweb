"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faGem,
  faRulerCombined,
  faArrowRight,
  faMap,
  faCheck,
  faBullseye,
  faHandshake,
  faPhone,
  faLocationDot,
  faCity,
  faHouse,
  faScroll,
  faDownload,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faRecycle,
  faEnvelope,
  faGlobe,
  faBars,
  faXmark,
  faUmbrellaBeach,
  faMartiniGlass,
  faUtensils,
  faKitchenSet,
  faSailboat,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faInstagram, faXTwitter, faFacebook, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons";

export { FontAwesomeIcon };
export const icons = {
  leaf: faLeaf,
  gem: faGem,
  ruler: faRulerCombined,
  arrowRight: faArrowRight,
  map: faMap,
  check: faCheck,
  bullseye: faBullseye,
  handshake: faHandshake,
  phone: faPhone,
  location: faLocationDot,
  city: faCity,
  house: faHouse,
  scroll: faScroll,
  download: faDownload,
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
  chevronDown: faChevronDown,
  recycle: faRecycle,
  envelope: faEnvelope,
  globe: faGlobe,
  bars: faBars,
  xmark: faXmark,
  umbrellaBeach: faUmbrellaBeach,
  martiniGlass: faMartiniGlass,
  utensils: faUtensils,
  kitchenSet: faKitchenSet,
  sailboat: faSailboat,
  linkedin: faLinkedin,
  instagram: faInstagram,
  xTwitter: faXTwitter,
  facebook: faFacebook,
  whatsapp: faWhatsapp,
  youtube: faYoutube,
} as const;

export type IconName = keyof typeof icons;

type FaIconProps = {
  name: IconName;
  className?: string;
};

export function FaIcon({ name, className = "" }: FaIconProps) {
  return (
    <FontAwesomeIcon icon={icons[name]} className={className} />
  );
}
