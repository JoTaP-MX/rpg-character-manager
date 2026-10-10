import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ProfileDrawer } from './components/ProfileDrawer';
import { useTheme } from './hooks/useTheme';
import { Home } from './pages/Home';
import { CampaignView } from './pages/CampaignView';
import { DocumentView } from './pages/DocumentView';
import { Trash } from './pages/Trash';
import { Search } from './pages/Search';
import { Favorites } from './pages/Favorites';

function Shell() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <Topbar onOpenProfile={() => setProfileOpen(true)} />

      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/"              element={<Home />} />
          <Route path="/campanha/:id"  element={<CampaignView />} />
          <Route path="/documento/:id" element={<DocumentView />} />
          <Route path="/busca"         element={<Search />} />
          <Route path="/favoritos"     element={<Favorites />} />
          <Route path="/lixeira"       element={<Trash />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
