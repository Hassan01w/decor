import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useBlog } from './context/BlogContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { SavedPostsDrawer } from './components/common/SavedPostsDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const BlogArchivePage = lazy(() => import('./pages/BlogArchivePage').then(module => ({ default: module.BlogArchivePage })));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage').then(module => ({ default: module.ArticleDetailPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(module => ({ default: module.DisclaimerPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));

// Admin Pages (Lazy Loaded)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminPostsList = lazy(() => import('./pages/admin/AdminPostsList').then(module => ({ default: module.AdminPostsList })));
const AdminPostEditor = lazy(() => import('./pages/admin/AdminPostEditor').then(module => ({ default: module.AdminPostEditor })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(module => ({ default: module.AdminCategories })));
const AdminHomepageCMS = lazy(() => import('./pages/admin/AdminHomepageCMS').then(module => ({ default: module.AdminHomepageCMS })));
const AdminNavigation = lazy(() => import('./pages/admin/AdminNavigation').then(module => ({ default: module.AdminNavigation })));
const AdminMediaLibrary = lazy(() => import('./pages/admin/AdminMediaLibrary').then(module => ({ default: module.AdminMediaLibrary })));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers').then(module => ({ default: module.AdminSubscribers })));
const AdminSiteSettings = lazy(() => import('./pages/admin/AdminSiteSettings').then(module => ({ default: module.AdminSiteSettings })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(module => ({ default: module.AdminUsers })));

// Permissions
import { 
  canManageCategories, 
  canManageHomepage, 
  canManageNavigation, 
  canManageSettings, 
  canManageSubscribers, 
  canManageUsers 
} from './utils/permissions';
import { Lock, ArrowLeft, ArrowUp } from 'lucide-react';

function RestrictedPage({ requiredRole = 'Administrator' }: { requiredRole?: string }) {
  const { navigate, currentUser } = useBlog();

  return (
    <div className="p-8 sm:p-16 max-w-xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#EFEAE1] text-[#2F3A32] flex items-center justify-center mx-auto border border-[#E5DED2]">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242522]">
          {requiredRole} Access Required
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7369] leading-relaxed">
          Your current profile (<strong>{currentUser?.name}</strong>) is assigned the <strong>{currentUser?.role.toUpperCase()}</strong> role. This section requires {requiredRole} privileges.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={() => navigate('/admin/posts')}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EFEAE1] text-[#242522] border border-[#E5DED2] rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          View My Articles
        </button>
      </div>
    </div>
  );
}

export function App() {
  const { currentPath, isAdminAuthenticated, currentUser, navigate } = useBlog();
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top whenever path changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Scroll listener for "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Dispatcher
  const renderContent = () => {
    // 1. ADMIN ROUTES
    if (currentPath.startsWith('/admin')) {
      if (currentPath === '/admin/login' || !isAdminAuthenticated) {
        return <AdminLogin />;
      }

      // Determine active tab for AdminLayout
      let activeTab = 'dashboard';
      if (currentPath.startsWith('/admin/posts')) activeTab = 'posts';
      else if (currentPath.startsWith('/admin/categories')) activeTab = 'categories';
      else if (currentPath.startsWith('/admin/homepage')) activeTab = 'homepage';
      else if (currentPath.startsWith('/admin/navigation')) activeTab = 'navigation';
      else if (currentPath.startsWith('/admin/media')) activeTab = 'media';
      else if (currentPath.startsWith('/admin/subscribers')) activeTab = 'subscribers';
      else if (currentPath.startsWith('/admin/users')) activeTab = 'users';
      else if (currentPath.startsWith('/admin/settings')) activeTab = 'settings';

      return (
        <AdminLayout activeTab={activeTab}>
          {(() => {
            if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
              return <AdminDashboard />;
            }
            if (currentPath === '/admin/posts/new') {
              return <AdminPostEditor />;
            }
            if (currentPath.startsWith('/admin/posts/edit/')) {
              const postId = currentPath.replace('/admin/posts/edit/', '');
              return <AdminPostEditor postId={postId} />;
            }
            if (currentPath === '/admin/posts') {
              return <AdminPostsList />;
            }
            if (currentPath === '/admin/categories') {
              return canManageCategories(currentUser) ? <AdminCategories /> : <RestrictedPage requiredRole="Editor or Administrator" />;
            }
            if (currentPath === '/admin/homepage') {
              return canManageHomepage(currentUser) ? <AdminHomepageCMS /> : <RestrictedPage requiredRole="Administrator" />;
            }
            if (currentPath === '/admin/navigation') {
              return canManageNavigation(currentUser) ? <AdminNavigation /> : <RestrictedPage requiredRole="Administrator" />;
            }
            if (currentPath === '/admin/media') {
              return <AdminMediaLibrary />;
            }
            if (currentPath === '/admin/subscribers') {
              return canManageSubscribers(currentUser) ? <AdminSubscribers /> : <RestrictedPage requiredRole="Editor or Administrator" />;
            }
            if (currentPath === '/admin/users') {
              return canManageUsers(currentUser) ? <AdminUsers /> : <RestrictedPage requiredRole="Administrator" />;
            }
            if (currentPath === '/admin/settings') {
              return canManageSettings(currentUser) ? <AdminSiteSettings /> : <RestrictedPage requiredRole="Administrator" />;
            }
            return <AdminDashboard />;
          })()}
        </AdminLayout>
      );
    }

    // 2. PUBLIC ROUTES
    let pageComponent = <HomePage />;

    if (currentPath === '/' || currentPath === '') {
      pageComponent = <HomePage />;
    } else if (currentPath === '/blog') {
      pageComponent = <BlogArchivePage />;
    } else if (currentPath === '/about') {
      pageComponent = <AboutPage />;
    } else if (currentPath === '/privacy') {
      pageComponent = <PrivacyPage />;
    } else if (currentPath === '/terms') {
      pageComponent = <TermsPage />;
    } else if (currentPath === '/disclaimer') {
      pageComponent = <DisclaimerPage />;
    } else if (currentPath === '/contact') {
      pageComponent = <ContactPage />;
    } else if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      pageComponent = <ArticleDetailPage slug={slug} />;
    } else if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      pageComponent = <CategoryPage slug={slug} />;
    } else {
      pageComponent = <HomePage />;
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#242522]">
        <Header onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />
        <main className="flex-1">
          {pageComponent}
        </main>
        <Footer />
      </div>
    );
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]"><div className="w-8 h-8 border-4 border-[#2F3A32] border-t-transparent rounded-full animate-spin"></div></div>}>
      {renderContent()}
      
      {/* Global Drawers & Modals */}
      <SearchModal />
      <SavedPostsDrawer 
        isOpen={isSavedDrawerOpen} 
        onClose={() => setIsSavedDrawerOpen(false)} 
      />
      <ToastContainer />
      <CookieConsentBanner />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#2F3A32] text-[#F7F4EE] rounded-full shadow-lg hover:bg-[#202722] hover:-translate-y-1 transition-all z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </Suspense>
  );
}

export default App;
