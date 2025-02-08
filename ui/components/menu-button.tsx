export interface MenuButtonProps {
  children: React.ReactNode;
}

export default function MenuButton({ children }: MenuButtonProps) {
  return (
    <button 
      className="w-64 h-12 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform"
      style={{ backgroundImage: "url('/menus/main/button-background.png')" }}
    >
      <span className="text-white text-2xl font-bold">{children}</span>
    </button>
  );
} 