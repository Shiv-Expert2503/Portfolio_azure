// --------------------------------------------fixed for black background
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isOnRagPage = location.pathname === '/multimodal-rag';
  const isOnProjectsPage = location.pathname === '/projects';
  const isOnHomePage = location.pathname === '/';
  const hasVisitedRag = localStorage.getItem('hasVisitedRag') === 'true';

  const renderNavigation = () => {
    // Home page: Show RAG and Projects (if RAG has been visited)
    if (isOnHomePage) {
      return (
        <>
          
          <NavLink 
            to="/multimodal-rag" 
            className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}
          >
            Video Generation
          </NavLink>
          
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}>
            Projects
          </NavLink>
        </>
      );
    }
    
    // RAG page: Show only Projects
    if (isOnRagPage) {
      return (
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}>
          Projects
        </NavLink>
      );
    }
    
    // Projects page: Show only RAG (in place of Projects)
    if (isOnProjectsPage && hasVisitedRag) {
      return (
        <NavLink 
          to="/multimodal-rag" 
          className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}
        >
          Video Generation
        </NavLink>
      );
    }
    
    // Default fallback for other pages
    return (
      <>
        {hasVisitedRag && (
          <NavLink 
            to="/multimodal-rag" 
            className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}
          >
            RAG
          </NavLink>
        )}
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-white'}>
          Projects
        </NavLink>
      </>
    );
  };

  return (
    <header className={`header ${isOnRagPage ? 'bg-black border-b border-white/10' : ''}`}>
        <div className="flex items-center justify-between w-full">
            <NavLink to="/" className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md">
                <p className="blue-gradient_text">SS</p>
            </NavLink>
            <nav className="flex text-lg gap-7 font-medium ml-auto">
                {renderNavigation()}
            </nav>
        </div>
    </header>
  );
};

export default Navbar;