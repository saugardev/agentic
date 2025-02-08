import MenuButton from './menu-button';

export default function LevelOverlay() {
  return (
    <div
      className="inset-x-0 h-56 pointer-events-none bg-cover bg-no-repeat bg-center p-5"
      style={{ backgroundImage: "url('/menus/background.png')" }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-5 pointer-events-auto items-center justify-center h-full">
          <MenuButton>
            Exit
          </MenuButton>
        </div>
      </div>
    </div>
  );
}