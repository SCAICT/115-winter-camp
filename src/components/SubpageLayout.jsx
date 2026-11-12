import { useRef } from 'react';
import usePageMotion from '../hooks/usePageMotion';
import SiteFooter from './SiteFooter';
import SiteNavbar from './SiteNavbar';

// 子頁共用外框：導覽列與頁尾的錨點連結都帶回首頁（"/#..."）。
export default function SubpageLayout({ skipTo, skipLabel, children }) {
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  usePageMotion(pageRef, progressRef);

  return (
    <div id="top" ref={pageRef}>
      <a className="skip-link" href={skipTo}>{skipLabel}</a>
      <SiteNavbar progressRef={progressRef} home="/" />
      <main>{children}</main>
      <SiteFooter home="/" />
    </div>
  );
}
