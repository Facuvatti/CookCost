import './App.css'
import Ingredients from './components/ingredients/ingredients'
function App() {

  return (
    <>
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
            <h1 className="text-center font-bold text-green-600 dark:text-green-400 transition-colors duration-200">CookCost</h1>
            <button 
                id="darkModeToggle"
                className="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 shadow-md"
                aria-label="Toggle dark mode"
            >
                <svg id="sunIcon" className="w-6 h-6 text-yellow-400 hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
                </svg>

                <svg id="moonIcon" className="w-6 h-6 text-gray-800 hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
            </button>
        </div>
        < Ingredients />
        
        <div className="container max-w-4xl mx-auto" id="recipes">
            <div className="title bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">RECETAS</h1>
                    <button className="add_recipe add bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold text-2xl w-12 h-12 rounded-full transition-colors duration-200 shadow-md">+</button>
                </div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto" id="recipes">
            <div className="title bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">RECETAS</h1>
                    <button id="" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold text-2xl w-12 h-12 rounded-full transition-colors duration-200 shadow-md">+</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default App
