import './App.css';

// components
import Navbar from './components/Navbar';
import Main from './components/Main';

const App: React.FC = () => {
  return (
    <>
      {/* main div */}
      <div className="w-full min-h-screen px-4 lg:px-[300px] md:py-6">
        <Navbar />
        <Main />
      </div>
    </>
  );
};

export default App;
