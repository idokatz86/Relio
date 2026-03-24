import { BrowserRouter, Routes, Route } from "react-router-dom"
import Hero from "./components/Hero"
import About from "./components/About"
import WaitlistForm from "./components/WaitlistForm"
import Footer from "./components/Footer"
import Privacy from "./components/Privacy"
import Terms from "./components/Terms"

function Landing() {
  return (
    <>
      <Hero />
      <About />
      <WaitlistForm />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
