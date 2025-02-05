import ParallaxLevel from "@/components/paralax-level";
import { levels } from "@/config/levels";
export default function MockGamePage() {
  return (
    <div>
      <ParallaxLevel config={levels[0]} />
    </div>
  );
}