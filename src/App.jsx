/**
 * App shell: providers + route table + persistent chrome.
 *
 * Order matters:
 *   BrowserRouter → TransitionProvider (owns the outlet location)
 *   → AnimatePresence(mode="wait") around <Routes> keyed on the displayed path
 *   → Preloader, Curtain, Navbar, Outlet, Footer, EasterEggs
 */

import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import EasterEggs from './components/system/EasterEggs'
import Preloader from './components/system/Preloader'
import TransitionCurtain from './components/system/TransitionCurtain'
import { TransitionProvider } from './context/TransitionContext'
import { useTransition } from './context/transitionStore'
import { initClickSplash } from './lib/clickSplash'

import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Shell />
      </TransitionProvider>
    </BrowserRouter>
  )
}

function Shell() {
  const { display } = useTransition()

  // mount the imperative splash layer once
  useEffect(() => {
    initClickSplash(document.body)
  }, [])

  // scroll to top whenever the displayed route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [display.pathname])

  return (
    <>
      <Preloader />
      <TransitionCurtain />
      <div className="grain-layer" aria-hidden="true" />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <EasterEggs>
        <div className="min-h-screen">
          {/*
            No <AnimatePresence> wrapper here on purpose: the ink curtain makes
            the route swap physically invisible, so an exit animation would only
            delay the new page's entrance. <Page> fades its own content in
            underneath the curtain as it lifts.
          */}
          <Routes location={display}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>
      </EasterEggs>
    </>
  )
}
