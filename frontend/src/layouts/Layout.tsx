import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"


//the 'Props' interface specifies that the 'Layout' component expects a single prop called children,
//which is of type React.ReactNode. This allows for the inclusion of nested React elements within the Layout component.
interface Props{
    children:React.ReactNode;
}

const Layout = ({children}:Props) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header/>
      <Hero/>
      <div className="container mx-auto py-10 flex-1">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default Layout

