// ProfileLink.tsx
import Link from 'next/link';
import React from 'react';

interface ProfileLinkProps {
  userRole: string;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ userRole }) => (
  <Link href={`/${userRole}/profile`} legacyBehavior>
    <a className="dropdown-item">
      <i className="ni ni-single-02" />
      <span>My Profile</span>
    </a>
  </Link>
);

export default ProfileLink;