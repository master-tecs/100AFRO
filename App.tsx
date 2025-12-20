import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import VideoGallery from './pages/VideoGallery';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Sitemap from './pages/Sitemap';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Advertise from './pages/Advertise';
import Charts from './pages/Charts';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans bg-gray-900 text-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/videos" element={<VideoGallery />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/advertise" element={<Advertise />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;