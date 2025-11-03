export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Made with
            <span className="text-red-500 animate-pulse">❤️</span>
            by
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Sahil Bazard
            </span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {currentYear} Frontend Prep Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

