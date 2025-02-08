export interface MenuButtonProps {
  children: React.ReactNode;
}

export default function MenuButton({ children }: MenuButtonProps) {
  return (
    <div 
      className="w-64 h-12 bg-contain bg-center bg-no-repeat hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
      style={{ backgroundImage: "url('/menus/main/button-background.png')" }}
    >
      <span className="text-white text-2xl font-bold">{children}</span>
    </div>
  );
} 