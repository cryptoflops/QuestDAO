export default function Footer() {
  return (
    <footer>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 border-t border-black/5">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-stacks-black/40 mb-6">
          <span>Built by <a href="https://github.com/cryptoflops" className="hover:text-[#F04A10] transition-colors">cryptoflops</a></span>
          <span>·</span>
          <a href="https://aegis-aev.pages.dev" className="hover:text-stacks-black transition-colors">Aegis</a>
          <a href="https://gm-on-stacks.pages.dev" className="hover:text-stacks-black transition-colors">GM on Stacks</a>
          <a href="https://stacks-jackpot-wall.pages.dev" className="hover:text-stacks-black transition-colors">Jackpot Wall</a>
        </div>
      </div>
    </footer>
  );
}
