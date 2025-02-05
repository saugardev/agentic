'use client';

import MenuButton from "./menu-button";

export default function Auth() {
  return (
    <MenuButton onClick={() => console.log('Login clicked')}>
      Login
    </MenuButton>
  );
}