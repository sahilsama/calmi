type Props = {
    onStart: () => void;
    onLogoClick: () => void;
  };
  
  export default function Header({ onStart, onLogoClick }: Props) {
    return (
      <header className="sticky top-0 z-50 bg-[#f5f5f3] border-b ">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
  
          <button
            onClick={onLogoClick}
            className="text-xl font-semibold"
          >
            Yellow
          </button>
  
          <nav className="hidden md:flex gap-8 text-sm text-neutral-600 ">
            <a href="#benefits">Benefits</a>
            <a href="#how">How it works</a>
            <a href="#contact">Documentations</a>
          </nav>
  
          {/* <button
            onClick={onStart}
            className="bg-yellow-400 text-white px-5 py-2 rounded-full text-sm"
          >
            Start your safe space →
          </button> */}
  
        </div>
      </header>
    );
  }