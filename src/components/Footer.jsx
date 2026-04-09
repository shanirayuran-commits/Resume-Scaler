/* ============================================
   Footer Component
   Simple dark footer with links and branding
   ============================================ */
'use client';

export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-glow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-display font-bold gradient-text">
                RateMyResume
              </span>
          </div>
          <p className="text-surface-500 text-sm max-w-xs text-center md:text-left">
            Empowering job seekers with AI-driven insights to boost their career prospects. Built with modern tech for a seamless experience.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12">
            <div className="flex flex-col gap-3">
                <span className="text-white font-semibold text-sm">Product</span>
                <a href="#features" className="text-surface-500 hover:text-white transition-colors text-sm">Features</a>
                <a href="#how-it-works" className="text-surface-500 hover:text-white transition-colors text-sm">How It Works</a>
                <a href="#upload" className="text-surface-500 hover:text-white transition-colors text-sm">Analyze</a>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-white font-semibold text-sm">Privacy</span>
                <a href="#" className="text-surface-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-surface-500 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-surface-500 hover:text-white transition-colors text-sm">Cookie Settings</a>
            </div>
        </div>

        {/* Social / Copy */}
        <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-all cursor-pointer flex items-center justify-center text-surface-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </div>
            </div>
            <p className="text-surface-600 text-xs">
              © {new Date().getFullYear()} RateMyResume. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
