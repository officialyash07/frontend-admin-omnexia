import ThemeMenu from "./ThemeMenu";
import "../assets/css/styles/studio-header.css";

export default function StudioHeader() {
  return (
    <header className="h-12 border-b bg-white flex items-center justify-between px-4">
      <div className="font-semibold">OMNIXIA Admin</div>
      <ThemeMenu />
    </header>
  );
}
